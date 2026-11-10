<?php
/**
 * WordPress AJAX Wholesale Inquiry Handler (`wp_mail` + `gt_inquiry` CPT)
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function grantrade_handle_inquiry_ajax() {
	if ( 'POST' !== strtoupper( $_SERVER['REQUEST_METHOD'] ?? '' ) ) {
		wp_send_json_error( array( 'message' => __( 'Invalid request method.', 'grantrade' ) ), 405 );
	}

	if ( ! check_ajax_referer( 'grantrade_inquiry_nonce', 'nonce', false ) ) {
		if ( function_exists( 'grantrade_log_blocked_attempt' ) ) {
			grantrade_log_blocked_attempt( 'Built-in Inquiry Form', 'Invalid security nonce' );
		}
		wp_send_json_error( array( 'message' => __( 'Security session expired. Please refresh the page and submit again.', 'grantrade' ) ), 403 );
	}

	// Honeypot trap — never store or dispatch bot submissions
	$bot = isset( $_POST['bot_field'] ) ? trim( sanitize_text_field( wp_unslash( $_POST['bot_field'] ) ) ) : '';
	if ( '' !== $bot ) {
		if ( function_exists( 'grantrade_log_blocked_attempt' ) ) {
			grantrade_log_blocked_attempt( 'Built-in Inquiry Form', 'Triggered hidden honeypot field' );
		}
		wp_send_json_error( array( 'message' => __( 'Automated submission blocked.', 'grantrade' ) ), 403 );
	}

	if ( function_exists( 'grantrade_check_rate_limit' ) && ! grantrade_check_rate_limit( 'builtin_inquiry', 8, 600 ) ) {
		grantrade_log_blocked_attempt( 'Built-in Inquiry Form', 'Exceeded per-IP rate limit' );
		wp_send_json_error( array( 'message' => __( 'Too many inquiries sent recently. Please wait 10 minutes or call the yard directly.', 'grantrade' ) ), 429 );
	}

	if ( function_exists( 'grantrade_verify_form_token' ) ) {
		$form_token  = isset( $_POST['_gt_form_token'] ) ? sanitize_text_field( wp_unslash( $_POST['_gt_form_token'] ) ) : '';
		$token_check = grantrade_verify_form_token( $form_token );
		if ( is_wp_error( $token_check ) ) {
			grantrade_log_blocked_attempt( 'Built-in Inquiry Form', $token_check->get_error_message() );
			wp_send_json_error( array( 'message' => $token_check->get_error_message() ), 400 );
		}
	}

	$raw_inputs = array(
		'fullName'         => isset( $_POST['fullName'] ) ? (string) wp_unslash( $_POST['fullName'] ) : '',
		'companyName'      => isset( $_POST['companyName'] ) ? (string) wp_unslash( $_POST['companyName'] ) : '',
		'email'            => isset( $_POST['email'] ) ? (string) wp_unslash( $_POST['email'] ) : '',
		'phone'            => isset( $_POST['phone'] ) ? (string) wp_unslash( $_POST['phone'] ) : '',
		'inquiryType'      => isset( $_POST['inquiryType'] ) ? (string) wp_unslash( $_POST['inquiryType'] ) : '',
		'stonesOfInterest' => isset( $_POST['stonesOfInterest'] ) ? (string) wp_unslash( $_POST['stonesOfInterest'] ) : '',
		'message'          => isset( $_POST['message'] ) ? (string) wp_unslash( $_POST['message'] ) : '',
	);

	if ( function_exists( 'grantrade_array_has_malicious_payload' ) && grantrade_array_has_malicious_payload( $raw_inputs ) ) {
		grantrade_log_blocked_attempt( 'Built-in Inquiry Form', 'Blocked script/SQL/spam link payload' );
		wp_send_json_error( array( 'message' => __( 'Your submission contains unsupported scripts or links and was blocked.', 'grantrade' ) ), 400 );
	}

	$full_name    = substr( sanitize_text_field( $raw_inputs['fullName'] ), 0, 120 );
	$company      = substr( sanitize_text_field( $raw_inputs['companyName'] ?: 'Individual / Homeowner' ), 0, 160 );
	$email        = substr( sanitize_email( $raw_inputs['email'] ), 0, 160 );
	$phone        = substr( sanitize_text_field( $raw_inputs['phone'] ), 0, 40 );
	$inquiry_type = substr( sanitize_text_field( $raw_inputs['inquiryType'] ?: 'general' ), 0, 80 );
	$stones       = substr( sanitize_text_field( $raw_inputs['stonesOfInterest'] ?: 'Full Catalog Inquiry' ), 0, 200 );
	$message      = substr( sanitize_textarea_field( $raw_inputs['message'] ), 0, 3000 );

	if ( function_exists( 'grantrade_validate_genuine_email' ) ) {
		$email_check = grantrade_validate_genuine_email( $raw_inputs['email'] );
		if ( is_wp_error( $email_check ) ) {
			grantrade_log_blocked_attempt( 'Built-in Inquiry Form', $email_check->get_error_message() );
			wp_send_json_error( array( 'message' => $email_check->get_error_message() ), 400 );
		}
	}

	if ( '' === $full_name || ! is_email( $email ) || '' === $message ) {
		wp_send_json_error(
			array( 'message' => __( 'Please provide your name, a valid email address, and project details.', 'grantrade' ) ),
			400
		);
	}

	$dup_key = 'gt_inq_dup_' . sha1( strtolower( $email ) . '|' . $message );
	if ( false !== get_transient( $dup_key ) ) {
		wp_send_json_error( array( 'message' => __( 'This exact inquiry was already received moments ago.', 'grantrade' ) ), 429 );
	}
	set_transient( $dup_key, 1, 60 );

	$post_content = sprintf(
		"Customer: %s\nCompany / Fabricator: %s\nEmail: %s\nPhone: %s\nInquiry Type: %s\nSlabs / Lot Interest: %s\n\nDetails:\n%s",
		$full_name,
		$company,
		$email,
		$phone,
		$inquiry_type,
		$stones,
		$message
	);

	$post_id = wp_insert_post(
		array(
			'post_type'    => 'gt_inquiry',
			'post_status'  => 'private',
			'post_title'   => sprintf( '%s — %s (%s)', $full_name, $stones, current_time( 'M j, Y g:i A' ) ),
			'post_content' => $post_content,
		)
	);

	if ( $post_id && ! is_wp_error( $post_id ) ) {
		update_post_meta( $post_id, '_gt_inq_name', $full_name );
		update_post_meta( $post_id, '_gt_inq_email', $email );
		update_post_meta( $post_id, '_gt_inq_phone', $phone );
		update_post_meta( $post_id, '_gt_inq_company', $company );
		update_post_meta( $post_id, '_gt_inq_stones', $stones );
		update_post_meta( $post_id, '_gt_inq_type', $inquiry_type );
		update_post_meta( $post_id, '_gt_inq_status', 'new' );
	}

	$inquiry_email = grantrade_get_option( 'gt_inquiry_email', 'grantrade@gmail.com' );
	$safe_name     = function_exists( 'grantrade_sanitize_header_name' ) ? grantrade_sanitize_header_name( $full_name ) : $full_name;
	$subject       = sprintf( '[Gran Trade Inquiry] %s — %s', substr( $stones, 0, 80 ), $safe_name );
	$headers       = array(
		'Content-Type: text/plain; charset=UTF-8',
		sprintf( 'Reply-To: %s <%s>', $safe_name ?: 'Website Visitor', $email ),
	);

	$mail_sent = wp_mail( $inquiry_email, $subject, $post_content, $headers );

	wp_send_json_success(
		array(
			'postId'   => $post_id,
			'mailSent' => (bool) $mail_sent,
			'target'   => $inquiry_email,
		)
	);
}
add_action( 'wp_ajax_grantrade_submit_inquiry', 'grantrade_handle_inquiry_ajax' );
add_action( 'wp_ajax_nopriv_grantrade_submit_inquiry', 'grantrade_handle_inquiry_ajax' );

