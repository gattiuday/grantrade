<?php
/**
 * Gran Trade Website & Contact Form Security Firewall
 *
 * Hardens contact forms (built-in, WPForms, Contact Form 7, Ninja Forms),
 * blocks script/PHP/XSS/header injections, rate-limits form & login floods,
 * restricts dangerous file uploads, disables XML-RPC, and sets security headers.
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Privacy-safe per-IP hash scoped with site auth salt.
 */
function grantrade_get_client_ip_hash() {
	$raw = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : 'unknown';
	return substr( hash_hmac( 'sha256', $raw, wp_salt( 'auth' ) ), 0, 24 );
}

/**
 * Sliding transient rate limiter.
 *
 * @return bool True if permitted, false if rate limit exceeded.
 */
function grantrade_check_rate_limit( $bucket, $max_attempts, $window_seconds ) {
	$key   = 'gt_rl_' . sanitize_key( $bucket ) . '_' . grantrade_get_client_ip_hash();
	$state = get_transient( $key );
	$now   = time();

	if ( ! is_array( $state ) || ( $now - (int) ( $state['start'] ?? 0 ) ) >= $window_seconds ) {
		set_transient( $key, array( 'start' => $now, 'count' => 1 ), $window_seconds );
		return true;
	}

	if ( (int) $state['count'] >= $max_attempts ) {
		return false;
	}

	$state['count'] = (int) $state['count'] + 1;
	$remaining      = max( 1, $window_seconds - ( $now - (int) $state['start'] ) );
	set_transient( $key, $state, $remaining );
	return true;
}

/**
 * Record blocked contact-form attack/spam attempts safely for WP Admin review.
 */
function grantrade_log_blocked_attempt( $source, $reason ) {
	$log   = get_option( 'grantrade_blocked_form_log', array() );
	$log   = is_array( $log ) ? $log : array();
	array_unshift(
		$log,
		array(
			'time'   => current_time( 'mysql' ),
			'source' => sanitize_text_field( (string) $source ),
			'reason' => sanitize_text_field( (string) $reason ),
			'ip_id'  => substr( grantrade_get_client_ip_hash(), 0, 10 ),
		)
	);
	update_option( 'grantrade_blocked_form_log', array_slice( $log, 0, 25 ), false );
}

/**
 * Detect script, PHP, DOM event handler, SQLi, or spam-flood payloads in form inputs.
 */
function grantrade_has_malicious_payload( $value ) {
	$text = (string) $value;
	if ( '' === trim( $text ) ) {
		return false;
	}

	$patterns = array(
		'/<\s*script\b/i',
		'/<\?(?:php|=)?/i',
		'/\b(?:javascript|vbscript)\s*:/i',
		'/data\s*:\s*text\/html/i',
		'/\bon(?:load|error|click|mouseover|focus|blur|submit|input)\s*=/i',
		'/\b(?:eval|base64_decode|shell_exec|passthru|system|proc_open|assert)\s*\(/i',
		'/\bunion\s+(?:all\s+)?select\b/i',
		'/\bsleep\s*\(\s*\d+\s*\)/i',
	);

	foreach ( $patterns as $regex ) {
		if ( preg_match( $regex, $text ) ) {
			return true;
		}
	}

	if ( preg_match_all( '/https?:\/\//i', $text ) > 3 ) {
		return true;
	}

	return false;
}

/**
 * Recursively check strings in nested arrays for malicious form payloads.
 */
function grantrade_array_has_malicious_payload( $data ) {
	if ( is_string( $data ) ) {
		return grantrade_has_malicious_payload( $data );
	}
	if ( is_array( $data ) ) {
		foreach ( $data as $val ) {
			if ( grantrade_array_has_malicious_payload( $val ) ) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Strip CR/LF/angle brackets from email header display names to stop CRLF header injection.
 */
function grantrade_sanitize_header_name( $name ) {
	$clean = preg_replace( '/[\r\n\x00<>"]+/', '', (string) $name );
	return trim( substr( $clean, 0, 100 ) );
}

/**
 * Return blocked disposable, burner, and placeholder domains for genuine-email checks.
 */
function grantrade_get_blocked_email_domains() {
	return array(
		// Reserved / placeholder / test domains
		'example.com', 'example.org', 'example.net', 'example.edu',
		'test.com', 'test.org', 'test.net', 'invalid.com', 'fake.com', 'fake.org',
		'localhost', 'domain.com', 'email.com',
		// Disposable / burner / throwaway providers
		'mailinator.com', 'mailinator.net', 'mailinator.org',
		'guerrillamail.com', 'guerrillamail.net', 'guerrillamail.org', 'guerrillamail.biz', 'guerrillamailblock.com',
		'sharklasers.com', 'grr.la',
		'tempmail.com', 'tempmail.net', 'temp-mail.org', 'temp-mail.io', 'temp-mail.ru',
		'10minutemail.com', '10minutemail.net', '10minutemail.org',
		'yopmail.com', 'yopmail.fr', 'yopmail.net',
		'trashmail.com', 'trashmail.net',
		'getnada.com', 'nada.email', 'throwawaymail.com', 'maildrop.cc', 'fakeinbox.com',
		'mintemail.com', 'dispostable.com', 'mohmal.com', 'emailondeck.com',
		'burnermail.io', 'mailnesia.com', 'spamgourmet.com', 'mytemp.email', 'tempr.email',
		'mailcatch.com', 'trbvm.com', 'tempinbox.com', 'discard.email', 'mailnull.com',
		'incognitomail.org', 'tempail.com',
	);
}

/**
 * Check whether outbound DNS resolution is functional on the current host (cached 10 minutes).
 */
function grantrade_is_dns_online() {
	$cached = get_transient( 'gt_dns_online' );
	if ( 'yes' === $cached ) {
		return true;
	}
	if ( 'no' === $cached ) {
		return false;
	}
	$online = function_exists( 'checkdnsrr' ) && checkdnsrr( 'gmail.com', 'MX' );
	set_transient( 'gt_dns_online', $online ? 'yes' : 'no', 10 * MINUTE_IN_SECONDS );
	return $online;
}

/**
 * Verify that an inquiry sender submitted a genuine, reachable email address.
 *
 * @param string $raw_email Sender email address.
 * @return true|WP_Error True if genuine, WP_Error with user-friendly reason if rejected.
 */
function grantrade_validate_genuine_email( $raw_email ) {
	$email = strtolower( trim( (string) $raw_email ) );
	if ( '' === $email || strlen( $email ) > 160 || preg_match( '/[\r\n\s<>]/', $email ) || ! is_email( $email ) ) {
		return new WP_Error( 'gt_email_format', __( 'Please enter a valid email address (for example, name@company.com).', 'grantrade' ) );
	}

	if ( false === strpos( $email, '@' ) ) {
		return new WP_Error( 'gt_email_format', __( 'Please enter a valid email address.', 'grantrade' ) );
	}

	list( $local, $domain ) = explode( '@', $email, 2 );
	if (
		'' === $local || '' === $domain ||
		false !== strpos( $local, '..' ) || false !== strpos( $domain, '..' ) ||
		! preg_match( '/^[a-z0-9.-]+\.[a-z]{2,24}$/', $domain )
	) {
		return new WP_Error( 'gt_email_domain', __( 'Please enter a valid business or personal email address.', 'grantrade' ) );
	}

	$blocked_domains = grantrade_get_blocked_email_domains();
	foreach ( $blocked_domains as $blocked ) {
		if ( $domain === $blocked || substr( $domain, -strlen( '.' . $blocked ) ) === '.' . $blocked ) {
			return new WP_Error(
				'gt_disposable_email',
				__( 'Please use a genuine business or personal email address (temporary, disposable, or example addresses are not accepted).', 'grantrade' )
			);
		}
	}

	$blocked_locals = array(
		'noreply', 'no-reply', 'donotreply', 'do-not-reply',
		'mailer-daemon', 'postmaster', 'nobody', 'fake', 'spam', 'trash', 'dummy', 'asdf', 'qwerty', '123456',
	);
	$domain_prefix  = strtok( $domain, '.' );
	if (
		in_array( $local, $blocked_locals, true ) ||
		( 'test' === $local && in_array( $domain_prefix, array( 'test', 'demo', 'fake' ), true ) )
	) {
		return new WP_Error(
			'gt_placeholder_email',
			__( 'Please enter a genuine personal or company email address so our sales team can reply.', 'grantrade' )
		);
	}

	if ( grantrade_is_dns_online() ) {
		$has_mail_host = checkdnsrr( $domain, 'MX' ) || checkdnsrr( $domain, 'A' ) || checkdnsrr( $domain, 'AAAA' );
		if ( ! $has_mail_host ) {
			return new WP_Error(
				'gt_unresolvable_email',
				__( 'That email domain could not be verified to receive replies. Please enter a genuine, active email address.', 'grantrade' )
			);
		}
	}

	return true;
}

/**
 * Validate any email fields present inside a nested form submission payload.
 *
 * @return true|WP_Error
 */
function grantrade_validate_emails_in_array( $data ) {
	if ( is_string( $data ) ) {
		$trimmed = trim( $data );
		if ( '' !== $trimmed && false !== strpos( $trimmed, '@' ) && ! preg_match( '/\s/', $trimmed ) && false !== strpos( $trimmed, '.' ) ) {
			return grantrade_validate_genuine_email( $trimmed );
		}
		return true;
	}
	if ( is_array( $data ) ) {
		foreach ( $data as $val ) {
			$check = grantrade_validate_emails_in_array( $val );
			if ( is_wp_error( $check ) ) {
				return $check;
			}
		}
	}
	return true;
}

/**
 * Issue a signed silent browser-timing token (replaces visible math captcha).
 */
function grantrade_create_form_token() {
	$ts  = time();
	$sig = hash_hmac( 'sha256', 'gt_form|' . $ts, wp_salt( 'nonce' ) );
	return base64_encode( $ts . '.' . $sig );
}

/**
 * Verify silent browser-timing token (requires genuine page view >= 2s, rejects instant bots & stale replays).
 *
 * @return true|WP_Error
 */
function grantrade_verify_form_token( $token ) {
	$raw = base64_decode( (string) $token, true );
	if ( false === $raw || false === strpos( $raw, '.' ) ) {
		return new WP_Error( 'gt_token_invalid', __( 'Form security token is missing or invalid. Please refresh the page and try again.', 'grantrade' ) );
	}
	list( $ts_str, $sig ) = explode( '.', $raw, 2 );
	if ( ! ctype_digit( $ts_str ) ) {
		return new WP_Error( 'gt_token_invalid', __( 'Form security token is invalid. Please refresh the page and try again.', 'grantrade' ) );
	}
	$ts           = (int) $ts_str;
	$expected_sig = hash_hmac( 'sha256', 'gt_form|' . $ts, wp_salt( 'nonce' ) );
	if ( ! hash_equals( $expected_sig, $sig ) ) {
		return new WP_Error( 'gt_token_invalid', __( 'Form security verification failed. Please refresh the page and submit again.', 'grantrade' ) );
	}
	$age = time() - $ts;
	if ( $age < 2 ) {
		return new WP_Error( 'gt_token_too_fast', __( 'Submission was sent too quickly. Please wait a moment and submit again.', 'grantrade' ) );
	}
	if ( $age > DAY_IN_SECONDS ) {
		return new WP_Error( 'gt_token_expired', __( 'Your form session expired. Please refresh the page and submit again.', 'grantrade' ) );
	}
	return true;
}

/**
 * Protect WordPress third-party contact forms (CF7, WPForms, Ninja Forms) from malicious payloads, fake emails & floods.
 */
function grantrade_guard_cf7_submission( $spam, $submission ) {
	if ( $spam ) {
		return true;
	}
	if ( ! grantrade_check_rate_limit( 'cf7_form', 6, 600 ) ) {
		grantrade_log_blocked_attempt( 'Contact Form 7', 'Rate limit exceeded' );
		return true;
	}
	$posted = is_object( $submission ) && method_exists( $submission, 'get_posted_data' ) ? $submission->get_posted_data() : array();
	if ( grantrade_array_has_malicious_payload( $posted ) ) {
		grantrade_log_blocked_attempt( 'Contact Form 7', 'Blocked script/SQL/spam payload' );
		return true;
	}
	$email_check = grantrade_validate_emails_in_array( $posted );
	if ( is_wp_error( $email_check ) ) {
		grantrade_log_blocked_attempt( 'Contact Form 7', $email_check->get_error_message() );
		return true;
	}
	return false;
}
add_filter( 'wpcf7_spam', 'grantrade_guard_cf7_submission', 10, 2 );

function grantrade_guard_wpforms_submission( $errors, $form_data ) {
	$form_id = absint( $form_data['id'] ?? 0 );
	if ( ! grantrade_check_rate_limit( 'wpforms', 6, 600 ) ) {
		grantrade_log_blocked_attempt( 'WPForms', 'Rate limit exceeded' );
		$errors[ $form_id ]['header'] = __( 'Too many form submissions. Please wait a few minutes and try again.', 'grantrade' );
		return $errors;
	}
	$fields = isset( $_POST['wpforms']['fields'] ) ? wp_unslash( $_POST['wpforms']['fields'] ) : array(); // phpcs:ignore WordPress.Security.NonceVerification.Missing,WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
	if ( grantrade_array_has_malicious_payload( $fields ) ) {
		grantrade_log_blocked_attempt( 'WPForms', 'Blocked script/SQL/spam payload' );
		$errors[ $form_id ]['header'] = __( 'Your message contains unsupported characters or scripts and was blocked by security filtering.', 'grantrade' );
		return $errors;
	}
	if ( is_array( $fields ) && ! empty( $form_data['fields'] ) ) {
		foreach ( $form_data['fields'] as $fid => $fmeta ) {
			if ( 'email' === ( $fmeta['type'] ?? '' ) && isset( $fields[ $fid ] ) ) {
				$raw_val     = is_array( $fields[ $fid ] ) ? ( $fields[ $fid ]['primary'] ?? '' ) : $fields[ $fid ];
				$email_check = grantrade_validate_genuine_email( $raw_val );
				if ( is_wp_error( $email_check ) ) {
					grantrade_log_blocked_attempt( 'WPForms', $email_check->get_error_message() );
					$errors[ $form_id ][ $fid ] = $email_check->get_error_message();
				}
			}
		}
	}
	return $errors;
}
add_filter( 'wpforms_process_initial_errors', 'grantrade_guard_wpforms_submission', 10, 2 );

function grantrade_guard_ninja_forms_submission( $form_data ) {
	if ( ! grantrade_check_rate_limit( 'ninja_forms', 6, 600 ) ) {
		grantrade_log_blocked_attempt( 'Ninja Forms', 'Rate limit exceeded' );
		$form_data['errors']['form']['gt_rate'] = __( 'Too many submissions. Please try again shortly.', 'grantrade' );
		return $form_data;
	}
	if ( isset( $form_data['fields'] ) && grantrade_array_has_malicious_payload( $form_data['fields'] ) ) {
		grantrade_log_blocked_attempt( 'Ninja Forms', 'Blocked script/SQL/spam payload' );
		$form_data['errors']['form']['gt_sec'] = __( 'Blocked unsafe HTML/script content in submission.', 'grantrade' );
		return $form_data;
	}
	if ( ! empty( $form_data['fields'] ) && is_array( $form_data['fields'] ) ) {
		foreach ( $form_data['fields'] as $fid => $field ) {
			$val   = $field['value'] ?? '';
			$ftype = $field['type'] ?? '';
			if ( 'email' === $ftype && '' !== trim( (string) $val ) ) {
				$email_check = grantrade_validate_genuine_email( $val );
				if ( is_wp_error( $email_check ) ) {
					grantrade_log_blocked_attempt( 'Ninja Forms', $email_check->get_error_message() );
					$form_data['errors']['fields'][ $fid ] = $email_check->get_error_message();
				}
			}
		}
	}
	return $form_data;
}
add_filter( 'ninja_forms_submit_data', 'grantrade_guard_ninja_forms_submission', 10, 1 );

/**
 * Send defensive HTTP security headers on frontend & admin responses.
 */
function grantrade_send_security_headers() {
	if ( headers_sent() ) {
		return;
	}
	header( 'X-Content-Type-Options: nosniff' );
	header( 'X-Frame-Options: SAMEORIGIN' );
	header( 'Referrer-Policy: strict-origin-when-cross-origin' );
	header( 'Permissions-Policy: camera=(), microphone=(), geolocation=()' );
}
add_action( 'send_headers', 'grantrade_send_security_headers' );

/**
 * Disable XML-RPC, remove WP generator fingerprint, and block pingbacks.
 */
add_filter( 'xmlrpc_enabled', '__return_false' );
add_filter( 'the_generator', '__return_empty_string' );
remove_action( 'wp_head', 'wp_generator' );

function grantrade_strip_pingback_header( $headers ) {
	unset( $headers['X-Pingback'] );
	return $headers;
}
add_filter( 'wp_headers', 'grantrade_strip_pingback_header' );

/**
 * Block unauthenticated REST user enumeration and `?author=N` probing.
 */
function grantrade_restrict_rest_user_endpoints( $endpoints ) {
	if ( ! is_user_logged_in() ) {
		unset( $endpoints['/wp/v2/users'] );
		unset( $endpoints['/wp/v2/users/(?P<id>[\d]+)'] );
	}
	return $endpoints;
}
add_filter( 'rest_endpoints', 'grantrade_restrict_rest_user_endpoints' );

function grantrade_block_author_enum_redirect() {
	if ( ! is_admin() && isset( $_GET['author'] ) && is_numeric( $_GET['author'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		wp_safe_redirect( home_url( '/' ), 301 );
		exit;
	}
}
add_action( 'template_redirect', 'grantrade_block_author_enum_redirect' );

/**
 * Block double-extension script uploads and executable file types in WP Media Library.
 */
function grantrade_validate_upload_filename( $file ) {
	$name = isset( $file['name'] ) ? (string) $file['name'] : '';
	if ( '' === $name ) {
		return $file;
	}
	if ( 0 === strpos( basename( $name ), '.' ) ) {
		$file['error'] = __( 'Hidden dotfiles are blocked for security reasons.', 'grantrade' );
		return $file;
	}
	if ( preg_match( '/\.(?:php\d*|phtml|phar|pl|py|cgi|sh|exe|bat|cmd)(?:\.|$)/i', $name ) ) {
		$file['error'] = __( 'Executable or script filenames are blocked for security reasons.', 'grantrade' );
		return $file;
	}
	return $file;
}
add_filter( 'wp_handle_upload_prefilter', 'grantrade_validate_upload_filename' );

/**
 * Brute-force throttling on wp-login.php (max 8 failures / 15 min per IP hash).
 */
function grantrade_track_failed_login() {
	$key   = 'gt_login_fail_' . grantrade_get_client_ip_hash();
	$count = (int) get_transient( $key );
	set_transient( $key, $count + 1, 15 * MINUTE_IN_SECONDS );
}
add_action( 'wp_login_failed', 'grantrade_track_failed_login' );

function grantrade_check_login_lockout( $user ) {
	$key   = 'gt_login_fail_' . grantrade_get_client_ip_hash();
	$count = (int) get_transient( $key );
	if ( $count >= 8 ) {
		return new WP_Error(
			'grantrade_login_locked',
			__( '<strong>Security Notice:</strong> Too many failed login attempts. Please wait 15 minutes before trying again.', 'grantrade' )
		);
	}
	return $user;
}
add_filter( 'authenticate', 'grantrade_check_login_lockout', 30, 1 );

/**
 * Render Security Shield & Blocked Form Attempts Card inside Gran Trade Control Center.
 */
function grantrade_render_security_status_card() {
	$log = get_option( 'grantrade_blocked_form_log', array() );
	$log = is_array( $log ) ? $log : array();
	?>
	<div class="gt-card">
		<h2><?php esc_html_e( 'Contact Form Firewall & Website Security Shield', 'grantrade' ); ?></h2>
		<ul style="margin:0 0 12px; padding-left:18px; line-height:1.8;">
			<li><span class="gt-badge gt-badge-ok"><?php esc_html_e( 'Active', 'grantrade' ); ?></span> <?php esc_html_e( 'Contact Form Firewall across Built-in Inquiry, WPForms, Contact Form 7 & Ninja Forms (XSS, PHP, SQLi & spam link filtering)', 'grantrade' ); ?></li>
			<li><span class="gt-badge gt-badge-ok"><?php esc_html_e( 'Active', 'grantrade' ); ?></span> <?php esc_html_e( 'Genuine Email Verification (Blocks Disposable/Fake Domains & Verifies Mail Domain) + Silent Session Timing Token + Honeypot + Rate Limiting', 'grantrade' ); ?></li>
			<li><span class="gt-badge gt-badge-ok"><?php esc_html_e( 'Active', 'grantrade' ); ?></span> <?php esc_html_e( 'XML-RPC Disabled, Author/User REST Enumeration Blocked, Login Brute-Force Throttling (8 tries / 15 min), Security Headers & Upload Extension Filter', 'grantrade' ); ?></li>
		</ul>
		<?php if ( ! empty( $log ) ) : ?>
			<h3 style="margin-bottom:6px;"><?php esc_html_e( 'Recently Blocked Form Attacks / Floods', 'grantrade' ); ?></h3>
			<table class="widefat striped">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Time', 'grantrade' ); ?></th>
						<th><?php esc_html_e( 'Form Source', 'grantrade' ); ?></th>
						<th><?php esc_html_e( 'Blocked Reason', 'grantrade' ); ?></th>
						<th><?php esc_html_e( 'Client ID', 'grantrade' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( array_slice( $log, 0, 8 ) as $entry ) : ?>
						<tr>
							<td><?php echo esc_html( $entry['time'] ?? '' ); ?></td>
							<td><?php echo esc_html( $entry['source'] ?? '' ); ?></td>
							<td><?php echo esc_html( $entry['reason'] ?? '' ); ?></td>
							<td><code><?php echo esc_html( $entry['ip_id'] ?? '' ); ?></code></td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		<?php else : ?>
			<p class="description" style="margin:0;"><?php esc_html_e( 'No malicious or flood form submissions blocked yet.', 'grantrade' ); ?></p>
		<?php endif; ?>
	</div>
	<?php
}
