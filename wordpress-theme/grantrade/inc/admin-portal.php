<?php
/**
 * Gran Trade WordPress Admin Portal
 *
 * Unifies Overview & 50-Stone Catalog Importer, Warehouse & Site Settings,
 * Theme File Manager & Core Code Editor, Custom CSS & JS / Code Snippets,
 * and WP Dashboard Overview Widget inside `wp-admin`.
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared option helper for Custom CSS / Head / JS snippets.
 */
function grantrade_get_custom_snippets() {
	return array(
		'css_enabled'  => '1' === get_option( 'grantrade_custom_css_enabled', '1' ),
		'css'          => (string) get_option( 'grantrade_custom_css', '' ),
		'head_enabled' => '1' === get_option( 'grantrade_custom_head_enabled', '1' ),
		'head'         => (string) get_option( 'grantrade_custom_head', '' ),
		'js_enabled'   => '1' === get_option( 'grantrade_custom_js_enabled', '1' ),
		'js'           => (string) get_option( 'grantrade_custom_js', '' ),
	);
}

/**
 * Print saved Custom CSS and Head Snippets in `<head>`.
 */
function grantrade_output_custom_head_code() {
	if ( is_admin() ) {
		return;
	}
	$sn = grantrade_get_custom_snippets();
	if ( $sn['css_enabled'] && '' !== trim( $sn['css'] ) ) {
		echo "\n<style id=\"grantrade-custom-css\">\n" . wp_strip_all_tags( $sn['css'] ) . "\n</style>\n";
	}
	if ( $sn['head_enabled'] && '' !== trim( $sn['head'] ) ) {
		echo "\n" . $sn['head'] . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Saved exclusively by manage_options admin.
	}
}
add_action( 'wp_head', 'grantrade_output_custom_head_code', 98 );

/**
 * Print saved Custom Footer JS / Scripts before `</body>`.
 */
function grantrade_output_custom_footer_js() {
	if ( is_admin() ) {
		return;
	}
	$sn = grantrade_get_custom_snippets();
	if ( ! $sn['js_enabled'] || '' === trim( $sn['js'] ) ) {
		return;
	}
	$code = trim( $sn['js'] );
	if ( false !== stripos( $code, '<script' ) ) {
		echo "\n" . $code . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Saved exclusively by manage_options admin.
	} else {
		echo "\n<script id=\"grantrade-custom-js\">\n" . $code . "\n</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
	}
}
add_action( 'wp_footer', 'grantrade_output_custom_footer_js', 98 );

/**
 * Register the Gran Trade Admin Menu & Shortcuts in WordPress Sidebar.
 */
function grantrade_register_admin_menus() {
	add_menu_page(
		__( 'Gran Trade Admin Portal', 'grantrade' ),
		__( 'Gran Trade', 'grantrade' ),
		'manage_options',
		'grantrade-admin',
		'grantrade_render_admin_overview_page',
		'dashicons-store',
		25
	);

	add_submenu_page(
		'grantrade-admin',
		__( 'Overview & Importer', 'grantrade' ),
		__( 'Overview & Importer', 'grantrade' ),
		'manage_options',
		'grantrade-admin',
		'grantrade_render_admin_overview_page'
	);

	add_submenu_page(
		'grantrade-admin',
		__( 'Warehouse & Settings', 'grantrade' ),
		__( 'Warehouse & Settings', 'grantrade' ),
		'manage_options',
		'grantrade-settings',
		'grantrade_render_settings_page'
	);

	add_submenu_page(
		'grantrade-admin',
		__( 'File Manager & Core Code', 'grantrade' ),
		__( 'File Manager', 'grantrade' ),
		'edit_themes',
		'grantrade-file-manager',
		'grantrade_render_file_manager_page'
	);

	add_submenu_page(
		'grantrade-admin',
		__( 'Custom CSS & JS', 'grantrade' ),
		__( 'Custom CSS & JS', 'grantrade' ),
		'manage_options',
		'grantrade-custom-code',
		'grantrade_render_custom_code_page'
	);
}
add_action( 'admin_menu', 'grantrade_register_admin_menus' );

/**
 * Register Gran Trade Overview & Inquiries Dashboard Widget on `/wp-admin/index.php`.
 */
function grantrade_register_dashboard_widget() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		return;
	}
	wp_add_dashboard_widget(
		'grantrade_dashboard_overview',
		__( 'Gran Trade — Catalog, Inquiries & Quick Controls', 'grantrade' ),
		'grantrade_render_dashboard_widget'
	);
}
add_action( 'wp_dashboard_setup', 'grantrade_register_dashboard_widget' );

function grantrade_render_dashboard_widget() {
	$slab_counts   = wp_count_posts( 'gt_slab' );
	$inq_counts    = wp_count_posts( 'gt_inquiry' );
	$page_counts   = wp_count_posts( 'page' );
	$slabs_total   = (int) ( $slab_counts->publish ?? 0 );
	$inq_total     = (int) ( ( $inq_counts->private ?? 0 ) + ( $inq_counts->publish ?? 0 ) );
	$pages_total   = (int) ( $page_counts->publish ?? 0 );
	$recent_inqs   = get_posts(
		array(
			'post_type'      => 'gt_inquiry',
			'post_status'    => array( 'private', 'publish' ),
			'posts_per_page' => 5,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);
	?>
	<div style="display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-bottom:14px;">
		<div style="background:#f6f7f7; padding:10px 12px; border-radius:4px; border:1px solid #dcdcde;">
			<div style="font-size:20px; font-weight:700;"><?php echo esc_html( (string) $slabs_total ); ?></div>
			<div style="font-size:11px; color:#646970;"><?php esc_html_e( 'WP Stone Slabs', 'grantrade' ); ?></div>
		</div>
		<div style="background:#f6f7f7; padding:10px 12px; border-radius:4px; border:1px solid #dcdcde;">
			<div style="font-size:20px; font-weight:700;"><?php echo esc_html( (string) $pages_total ); ?></div>
			<div style="font-size:11px; color:#646970;"><?php esc_html_e( 'Published Pages', 'grantrade' ); ?></div>
		</div>
		<div style="background:#f6f7f7; padding:10px 12px; border-radius:4px; border:1px solid #dcdcde;">
			<div style="font-size:20px; font-weight:700;"><?php echo esc_html( (string) $inq_total ); ?></div>
			<div style="font-size:11px; color:#646970;"><?php esc_html_e( 'Yard Inquiries', 'grantrade' ); ?></div>
		</div>
	</div>

	<?php
	$home_id = (int) get_option( 'page_on_front' );
	?>
	<div style="display:flex; flex-wrap:wrap; gap:6px; margin-bottom:14px;">
		<a class="button button-primary" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>"><?php esc_html_e( 'Edit Pages', 'grantrade' ); ?></a>
		<?php if ( $home_id && defined( 'ELEMENTOR_VERSION' ) ) : ?>
			<a class="button button-secondary" href="<?php echo esc_url( admin_url( 'post.php?post=' . $home_id . '&action=elementor' ) ); ?>"><?php esc_html_e( 'Edit with Elementor', 'grantrade' ); ?></a>
		<?php endif; ?>
		<a class="button button-secondary" href="<?php echo esc_url( admin_url( 'edit.php?post_type=gt_slab' ) ); ?>"><?php esc_html_e( 'Stone Slabs', 'grantrade' ); ?></a>
		<a class="button button-secondary" href="<?php echo esc_url( admin_url( 'media-new.php' ) ); ?>"><?php esc_html_e( 'Upload Pictures', 'grantrade' ); ?></a>
		<a class="button button-secondary" href="<?php echo esc_url( admin_url( 'plugin-install.php' ) ); ?>"><?php esc_html_e( 'Add Plugins', 'grantrade' ); ?></a>
		<a class="button button-secondary" href="<?php echo esc_url( admin_url( defined( 'WPCODE_VERSION' ) || class_exists( 'WPCode' ) ? 'admin.php?page=wpcode' : 'admin.php?page=grantrade-custom-code' ) ); ?>"><?php esc_html_e( 'WPCode / Snippets', 'grantrade' ); ?></a>
		<?php if ( function_exists( 'wpforms' ) ) : ?>
			<a class="button button-secondary" href="<?php echo esc_url( admin_url( 'admin.php?page=wpforms-overview' ) ); ?>"><?php esc_html_e( 'WPForms', 'grantrade' ); ?></a>
		<?php endif; ?>
		<a class="button button-secondary" href="<?php echo esc_url( admin_url( 'admin.php?page=grantrade-file-manager' ) ); ?>"><?php esc_html_e( 'File Manager', 'grantrade' ); ?></a>
	</div>

	<?php if ( ! empty( $recent_inqs ) ) : ?>
		<h4 style="margin:8px 0 6px;"><?php esc_html_e( 'Recent Yard Inquiries', 'grantrade' ); ?></h4>
		<ul style="margin:0; padding:0; list-style:none;">
			<?php foreach ( $recent_inqs as $inq ) : ?>
				<li style="padding:6px 0; border-top:1px solid #eee; display:flex; justify-content:space-between; gap:8px;">
					<a href="<?php echo esc_url( get_edit_post_link( $inq->ID ) ); ?>"><?php echo esc_html( $inq->post_title ); ?></a>
					<span style="color:#646970; font-size:11px;"><?php echo esc_html( get_post_meta( $inq->ID, '_gt_inq_status', true ) ?: 'new' ); ?></span>
				</li>
			<?php endforeach; ?>
		</ul>
	<?php else : ?>
		<p style="margin:0; color:#646970;"><?php esc_html_e( 'No customer inquiries logged yet.', 'grantrade' ); ?></p>
	<?php endif;
}

/**
 * Render consistent Gran Trade notice banner from URL query flag.
 */
function grantrade_admin_render_notice( $notice_key ) {
	if ( ! $notice_key ) {
		return;
	}
	$messages = array(
		'imported'     => array( 'success', __( 'Built-in catalog imported into WordPress Stone Slabs.', 'grantrade' ) ),
		'settings_ok'  => array( 'success', __( 'Warehouse & catalog settings saved.', 'grantrade' ) ),
		'code_ok'      => array( 'success', __( 'Custom CSS & JS snippets saved.', 'grantrade' ) ),
		'file_saved'   => array( 'success', __( 'Core file saved cleanly.', 'grantrade' ) ),
		'file_uploaded'=> array( 'success', __( 'File uploaded successfully.', 'grantrade' ) ),
		'dir_created'  => array( 'success', __( 'Directory created.', 'grantrade' ) ),
		'php_syntax'   => array( 'error', __( 'PHP syntax check failed. The live file was NOT modified — check your syntax and try again.', 'grantrade' ) ),
		'invalid_path' => array( 'error', __( 'Blocked invalid or unsafe file path.', 'grantrade' ) ),
		'upload_err'   => array( 'error', __( 'Upload failed or file extension is not permitted.', 'grantrade' ) ),
	);
	if ( ! isset( $messages[ $notice_key ] ) ) {
		return;
	}
	list( $type, $text ) = $messages[ $notice_key ];
	$extra = '';
	if ( 'imported' === $notice_key && isset( $_GET['created'], $_GET['skipped'] ) ) {
		$extra = sprintf(
			' (%d created, %d already in WordPress)',
			absint( $_GET['created'] ),
			absint( $_GET['skipped'] )
		);
	}
	echo '<div class="notice notice-' . esc_attr( $type ) . ' is-dismissible"><p>' . esc_html( $text . $extra ) . '</p></div>';
}

/**
 * Page 1: Gran Trade Overview & Built-in Catalog Importer.
 */
function grantrade_render_admin_overview_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	$notice     = isset( $_GET['gt_notice'] ) ? sanitize_key( wp_unslash( $_GET['gt_notice'] ) ) : '';
	$slab_cnt   = (int) ( wp_count_posts( 'gt_slab' )->publish ?? 0 );
	$page_cnt   = (int) ( wp_count_posts( 'page' )->publish ?? 0 );
	$inq_obj    = wp_count_posts( 'gt_inquiry' );
	$inq_cnt    = (int) ( ( $inq_obj->private ?? 0 ) + ( $inq_obj->publish ?? 0 ) );
	$media_cnt  = (int) ( wp_count_posts( 'attachment' )->inherit ?? 0 );
	$mode       = grantrade_get_option( 'gt_catalog_mode', 'wp_only' );
	$active_plugins = count( (array) get_option( 'active_plugins', array() ) );
	$export_json_url = wp_nonce_url( admin_url( 'admin-post.php?action=grantrade_export_catalog_json' ), 'grantrade_export_catalog' );
	?>
	<div class="wrap gt-admin-wrap">
		<?php grantrade_admin_render_notice( $notice ); ?>

		<div class="gt-admin-hero">
			<div>
				<h1><?php esc_html_e( 'Gran Trade WordPress Control Center', 'grantrade' ); ?></h1>
				<p><?php esc_html_e( 'Manage pages, stone slab inventory, picture uploads, plugins, core theme files, and custom CSS & JS directly from WordPress.', 'grantrade' ); ?></p>
			</div>
			<div class="gt-hero-actions">
				<a href="<?php echo esc_url( home_url( '/' ) ); ?>" target="_blank" rel="noopener noreferrer" class="button button-secondary"><?php esc_html_e( 'View Live Website', 'grantrade' ); ?></a>
				<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=gt_slab' ) ); ?>" class="button button-primary"><?php esc_html_e( '+ Add New Stone Slab', 'grantrade' ); ?></a>
			</div>
		</div>

		<div class="gt-kpi-grid">
			<div class="gt-kpi-card">
				<div class="gt-kpi-val"><?php echo esc_html( (string) $slab_cnt ); ?></div>
				<div class="gt-kpi-lbl"><?php esc_html_e( 'WordPress Stone Slabs', 'grantrade' ); ?></div>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=gt_slab' ) ); ?>"><?php esc_html_e( 'Manage Stone Slabs →', 'grantrade' ); ?></a>
			</div>
			<div class="gt-kpi-card">
				<div class="gt-kpi-val"><?php echo esc_html( (string) $page_cnt ); ?></div>
				<div class="gt-kpi-lbl"><?php esc_html_e( 'Editable Site Pages', 'grantrade' ); ?></div>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>"><?php esc_html_e( 'Edit Pages →', 'grantrade' ); ?></a>
			</div>
			<div class="gt-kpi-card">
				<div class="gt-kpi-val"><?php echo esc_html( (string) $media_cnt ); ?></div>
				<div class="gt-kpi-lbl"><?php esc_html_e( 'Media Library Pictures', 'grantrade' ); ?></div>
				<a href="<?php echo esc_url( admin_url( 'upload.php' ) ); ?>"><?php esc_html_e( 'Upload / Browse Pictures →', 'grantrade' ); ?></a>
			</div>
			<div class="gt-kpi-card">
				<div class="gt-kpi-val"><?php echo esc_html( (string) $inq_cnt ); ?></div>
				<div class="gt-kpi-lbl"><?php esc_html_e( 'Yard Inquiries', 'grantrade' ); ?></div>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=gt_inquiry' ) ); ?>"><?php esc_html_e( 'View Leads →', 'grantrade' ); ?></a>
			</div>
			<div class="gt-kpi-card">
				<div class="gt-kpi-val"><?php echo esc_html( (string) $active_plugins ); ?></div>
				<div class="gt-kpi-lbl"><?php esc_html_e( 'Active Plugins', 'grantrade' ); ?></div>
				<a href="<?php echo esc_url( admin_url( 'plugin-install.php' ) ); ?>"><?php esc_html_e( 'Add Plugins →', 'grantrade' ); ?></a>
			</div>
		</div>

		<div class="gt-card">
			<h2><?php esc_html_e( 'Quick Admin Shortcuts', 'grantrade' ); ?></h2>
			<?php $home_id = (int) get_option( 'page_on_front' ); ?>
			<div class="gt-quick-grid">
				<a class="gt-quick-link" href="<?php echo esc_url( $home_id ? admin_url( 'post.php?post=' . $home_id . '&action=edit' ) : admin_url( 'edit.php?post_type=page' ) ); ?>">
					<span class="dashicons dashicons-edit-page"></span>
					<span><?php esc_html_e( 'Edit Home Page', 'grantrade' ); ?></span>
				</a>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'edit.php?post_type=page' ) ); ?>">
					<span class="dashicons dashicons-admin-page"></span>
					<span><?php esc_html_e( 'All Website Pages', 'grantrade' ); ?></span>
				</a>
				<?php if ( defined( 'ELEMENTOR_VERSION' ) && $home_id ) : ?>
					<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'post.php?post=' . $home_id . '&action=elementor' ) ); ?>">
						<span class="dashicons dashicons-layout"></span>
						<span><?php esc_html_e( 'Edit with Elementor', 'grantrade' ); ?></span>
					</a>
				<?php endif; ?>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'admin.php?page=' . ( defined( 'WPCODE_VERSION' ) || class_exists( 'WPCode' ) ? 'wpcode' : 'grantrade-custom-code' ) ) ); ?>">
					<span class="dashicons dashicons-editor-code"></span>
					<span><?php esc_html_e( 'WPCode / Code Snippets', 'grantrade' ); ?></span>
				</a>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( function_exists( 'wpforms' ) ? 'admin.php?page=wpforms-overview' : 'edit.php?post_type=gt_inquiry' ) ); ?>">
					<span class="dashicons dashicons-feedback"></span>
					<span><?php esc_html_e( 'WPForms & Yard Inquiries', 'grantrade' ); ?></span>
				</a>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'media-new.php' ) ); ?>">
					<span class="dashicons dashicons-format-gallery"></span>
					<span><?php esc_html_e( 'Upload Slab & Page Pictures', 'grantrade' ); ?></span>
				</a>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'plugin-install.php' ) ); ?>">
					<span class="dashicons dashicons-admin-plugins"></span>
					<span><?php esc_html_e( 'Install / Add Plugins', 'grantrade' ); ?></span>
				</a>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'admin.php?page=grantrade-file-manager' ) ); ?>">
					<span class="dashicons dashicons-category"></span>
					<span><?php esc_html_e( 'File Manager & Core Code', 'grantrade' ); ?></span>
				</a>
				<a class="gt-quick-link" href="<?php echo esc_url( admin_url( 'admin.php?page=grantrade-settings' ) ); ?>">
					<span class="dashicons dashicons-admin-settings"></span>
					<span><?php esc_html_e( 'Warehouse & Catalog Mode', 'grantrade' ); ?></span>
				</a>
			</div>
		</div>

		<?php
		if ( ! function_exists( 'is_plugin_active' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		$installed_plugins = function_exists( 'get_plugins' ) ? get_plugins() : array();
		$companions = array(
			array( 'name' => 'Elementor', 'slug' => 'elementor', 'file' => 'elementor/elementor.php', 'admin' => $home_id ? admin_url( 'post.php?post=' . $home_id . '&action=elementor' ) : admin_url( 'admin.php?page=elementor' ), 'desc' => __( 'Visual Edit with Elementor page builder.', 'grantrade' ) ),
			array( 'name' => 'WPCode (Code Snippets)', 'slug' => 'insert-headers-and-footers', 'file' => 'insert-headers-and-footers/ihaf.php', 'admin' => admin_url( 'admin.php?page=wpcode' ), 'desc' => __( 'Header/footer scripts & custom code snippets.', 'grantrade' ) ),
			array( 'name' => 'WPForms', 'slug' => 'wpforms-lite', 'file' => 'wpforms-lite/wpforms.php', 'admin' => admin_url( 'admin.php?page=wpforms-overview' ), 'desc' => __( 'Drag-and-drop contact forms (routed to grantrade@gmail.com).', 'grantrade' ) ),
			array( 'name' => 'FileBird', 'slug' => 'filebird', 'file' => 'filebird/filebird.php', 'admin' => admin_url( 'upload.php' ), 'desc' => __( 'Organize Media Library slab & yard pictures into folders.', 'grantrade' ) ),
		);
		?>
		<div class="gt-card">
			<h2><?php esc_html_e( 'Essential Companion Plugins', 'grantrade' ); ?></h2>
			<table class="widefat striped" style="margin-top:8px;">
				<thead>
					<tr>
						<th><?php esc_html_e( 'Plugin', 'grantrade' ); ?></th>
						<th><?php esc_html_e( 'Purpose', 'grantrade' ); ?></th>
						<th><?php esc_html_e( 'Status', 'grantrade' ); ?></th>
						<th style="text-align:right;"><?php esc_html_e( 'Action', 'grantrade' ); ?></th>
					</tr>
				</thead>
				<tbody>
					<?php foreach ( $companions as $cp ) : ?>
						<?php
						$is_active    = is_plugin_active( $cp['file'] );
						$is_installed = isset( $installed_plugins[ $cp['file'] ] );
						$install_url  = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=' . $cp['slug'] ), 'install-plugin_' . $cp['slug'] );
						$activate_url = wp_nonce_url( admin_url( 'plugins.php?action=activate&plugin=' . rawurlencode( $cp['file'] ) ), 'activate-plugin_' . $cp['file'] );
						?>
						<tr>
							<td><strong><?php echo esc_html( $cp['name'] ); ?></strong></td>
							<td><?php echo esc_html( $cp['desc'] ); ?></td>
							<td>
								<?php if ( $is_active ) : ?>
									<span class="gt-badge gt-badge-ok"><?php esc_html_e( 'Active', 'grantrade' ); ?></span>
								<?php elseif ( $is_installed ) : ?>
									<span class="gt-badge gt-badge-role"><?php esc_html_e( 'Installed (Inactive)', 'grantrade' ); ?></span>
								<?php else : ?>
									<span class="gt-badge gt-badge-warn"><?php esc_html_e( 'Not Installed', 'grantrade' ); ?></span>
								<?php endif; ?>
							</td>
							<td style="text-align:right;">
								<?php if ( $is_active ) : ?>
									<a href="<?php echo esc_url( $cp['admin'] ); ?>" class="button button-small button-primary"><?php esc_html_e( 'Open', 'grantrade' ); ?></a>
								<?php elseif ( $is_installed ) : ?>
									<a href="<?php echo esc_url( $activate_url ); ?>" class="button button-small button-primary"><?php esc_html_e( 'Activate', 'grantrade' ); ?></a>
								<?php else : ?>
									<a href="<?php echo esc_url( $install_url ); ?>" class="button button-small"><?php esc_html_e( 'Install Now', 'grantrade' ); ?></a>
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>
		</div>

		<div class="gt-card-grid">
			<div class="gt-card">
				<h2><?php esc_html_e( 'Built-In 50-Stone Catalog Importer', 'grantrade' ); ?></h2>
				<p>
					<?php esc_html_e( 'Import the built-in 50 stone slabs (Quartz, Quartzite, Granite, Marble, Monuments, Soapstone, Semi Precious, Tiles) as real editable WordPress Stone Slabs with GT#, Lot#, Dimensions, Color Tags, and attached Pictures. Existing slugs are skipped safely.', 'grantrade' ); ?>
				</p>
				<p>
					<strong><?php esc_html_e( 'Current Catalog Mode:', 'grantrade' ); ?></strong>
					<code><?php echo esc_html( 'wp_only' === $mode ? 'WordPress Stone Slabs Only (wp_only)' : 'Built-in 50 Stones + WordPress Slabs (merge)' ); ?></code>
				</p>
				<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" id="gtImportBuiltinForm" style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
					<input type="hidden" name="action" value="grantrade_import_builtin_stones" />
					<?php wp_nonce_field( 'grantrade_import_builtin' ); ?>
					<input type="hidden" name="builtin_stones_json" id="gtBuiltinStonesJson" value="" />
					<button type="submit" class="button button-primary"><?php esc_html_e( 'Import Built-in 50 Stones into WordPress', 'grantrade' ); ?></button>
					<a href="<?php echo esc_url( $export_json_url ); ?>" class="button button-secondary"><?php esc_html_e( 'Download WP Slabs JSON', 'grantrade' ); ?></a>
				</form>
				<script>
					document.getElementById('gtImportBuiltinForm').addEventListener('submit', function () {
						var field = document.getElementById('gtBuiltinStonesJson');
						if (field && window.GRAN_TRADE_CATALOG && Array.isArray(window.GRAN_TRADE_CATALOG.all)) {
							field.value = JSON.stringify(window.GRAN_TRADE_CATALOG.all);
						}
					});
				</script>
			</div>

			<div class="gt-card">
				<h2><?php esc_html_e( 'Plugin & Core Customization Status', 'grantrade' ); ?></h2>
				<ul style="margin:0; padding-left:18px; line-height:1.8;">
					<li><?php esc_html_e( 'Theme Supports: Featured Images, Custom Logo, Navigation Menus, Block Editor (Gutenberg), Elementor Canvas/Full Width, WPForms & WPCode.', 'grantrade' ); ?></li>
					<li><?php esc_html_e( 'Filesystem Method:', 'grantrade' ); ?> <code><?php echo esc_html( defined( 'FS_METHOD' ) ? FS_METHOD : 'default' ); ?></code></li>
					<li><?php esc_html_e( 'Theme Folder:', 'grantrade' ); ?> <code><?php echo esc_html( get_stylesheet_directory() ); ?></code></li>
					<li><?php esc_html_e( 'Active Theme Version:', 'grantrade' ); ?> <code><?php echo esc_html( GRANTRADE_VERSION ); ?></code></li>
				</ul>
			</div>
		</div>

		<?php
		if ( function_exists( 'grantrade_render_security_status_card' ) ) {
			grantrade_render_security_status_card();
		}
		?>
	</div>
	<?php
}

/**
 * POST handler: Import Built-in 50 Stones into WP `gt_slab` posts.
 */
function grantrade_handle_import_builtin_stones() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_import_builtin' );

	$stones = array();
	if ( ! empty( $_POST['builtin_stones_json'] ) ) {
		$decoded = json_decode( wp_unslash( $_POST['builtin_stones_json'] ), true );
		if ( is_array( $decoded ) ) {
			$stones = $decoded;
		}
	}

	if ( empty( $stones ) ) {
		$fallback_json = trailingslashit( get_template_directory() ) . 'data/products.json';
		if ( file_exists( $fallback_json ) ) {
			$decoded = json_decode( (string) file_get_contents( $fallback_json ), true );
			if ( is_array( $decoded ) ) {
				$stones = $decoded;
			}
		}
	}

	$res = grantrade_import_stones_array( $stones );
	wp_safe_redirect(
		add_query_arg(
			array(
				'page'      => 'grantrade-admin',
				'gt_notice' => 'imported',
				'created'   => $res['created'],
				'skipped'   => $res['skipped'],
			),
			admin_url( 'admin.php' )
		)
	);
	exit;
}
add_action( 'admin_post_grantrade_import_builtin_stones', 'grantrade_handle_import_builtin_stones' );

/**
 * Page 2: Warehouse & Catalog Settings (synced 1:1 with Customizer theme mods).
 */
function grantrade_render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$notice = isset( $_GET['gt_notice'] ) ? sanitize_key( wp_unslash( $_GET['gt_notice'] ) ) : '';
	$fields = array(
		'gt_hero_tag'      => array( __( 'Hero Tagline Badge', 'grantrade' ), 'text', 'Wholesale Warehouse & Slab Display · Carlstadt, NJ' ),
		'gt_hero_title'    => array( __( 'Hero Main Headline', 'grantrade' ), 'text', 'The slab is the statement.' ),
		'gt_hero_lead'     => array( __( 'Hero Lead Paragraph', 'grantrade' ), 'textarea', 'A premier distributor of architectural stones. Gran Trade imports natural quartzite, fine marble, durable granite, and engineered quartz from trusted quarries worldwide, stocked and ready at our Carlstadt, New Jersey warehouse.' ),
		'gt_address_line1' => array( __( 'Warehouse Street Address', 'grantrade' ), 'text', '178 Commerce Road' ),
		'gt_address_line2' => array( __( 'Warehouse City, State, ZIP', 'grantrade' ), 'text', 'Carlstadt, NJ 07072' ),
		'gt_phone_display' => array( __( 'Main Yard Phone (Display)', 'grantrade' ), 'text', '(201) 438-1888' ),
		'gt_phone_raw'     => array( __( 'Main Yard Phone (Digits Only)', 'grantrade' ), 'text', '2014381888' ),
		'gt_sales_email'   => array( __( 'Sales Desk Display Email', 'grantrade' ), 'email', 'sales.grantrade@gmail.com' ),
		'gt_inquiry_email'    => array( __( 'Contact Us Form Recipient Email', 'grantrade' ), 'email', 'grantrade@gmail.com' ),
		'gt_hours_summary'    => array( __( 'Hours Summary Strip', 'grantrade' ), 'text', 'Monday–Friday: 8:00 AM – 6:00 PM · Saturday: 9:00 AM – 2:00 PM · Sunday: 10:00 AM – 2:00 PM' ),
		'gt_social_facebook'  => array( __( 'Facebook Page URL', 'grantrade' ), 'url', 'https://www.facebook.com/grantradeinc/' ),
		'gt_social_houzz'     => array( __( 'Houzz Profile URL', 'grantrade' ), 'url', 'https://www.houzz.com/hznb/professionals/building-supplies/gran-trade-inc-pfvwus-pf~1639963827' ),
		'gt_social_instagram' => array( __( 'Instagram Profile URL', 'grantrade' ), 'url', 'https://www.instagram.com/grantradeinc/?hl=en' ),
		'gt_social_yelp'      => array( __( 'Yelp Business URL', 'grantrade' ), 'url', 'https://www.yelp.com/biz/gran-trade-carlstadt-5?osq=Gran+Trade' ),
	);
	$catalog_mode = grantrade_get_option( 'gt_catalog_mode', 'wp_only' );
	?>
	<div class="wrap gt-admin-wrap">
		<?php grantrade_admin_render_notice( $notice ); ?>

		<div class="gt-admin-hero">
			<div>
				<h1><?php esc_html_e( 'Warehouse & Site Settings', 'grantrade' ); ?></h1>
				<p><?php esc_html_e( 'All fields stay synced with Appearance → Customize → Gran Trade — Warehouse & Hero.', 'grantrade' ); ?></p>
			</div>
			<div class="gt-hero-actions">
				<a href="<?php echo esc_url( admin_url( 'customize.php?autofocus[section]=grantrade_warehouse' ) ); ?>" class="button button-secondary"><?php esc_html_e( 'Open Live Customizer', 'grantrade' ); ?></a>
			</div>
		</div>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" class="gt-card">
			<input type="hidden" name="action" value="grantrade_save_settings" />
			<?php wp_nonce_field( 'grantrade_save_settings_nonce' ); ?>

			<table class="form-table" role="presentation">
				<tbody>
					<tr>
						<th scope="row"><label for="gt_catalog_mode"><?php esc_html_e( 'Stone Catalog Source', 'grantrade' ); ?></label></th>
						<td>
							<select id="gt_catalog_mode" name="gt_catalog_mode">
								<option value="merge" <?php selected( $catalog_mode, 'merge' ); ?>><?php esc_html_e( 'Built-in 50 Stones + WordPress Stone Slabs', 'grantrade' ); ?></option>
								<option value="wp_only" <?php selected( $catalog_mode, 'wp_only' ); ?>><?php esc_html_e( 'WordPress Stone Slabs CPT Only', 'grantrade' ); ?></option>
							</select>
							<p class="description"><?php esc_html_e( 'Choose "WordPress Stone Slabs CPT Only" after importing slabs if you want the public catalog controlled 100% by WordPress posts.', 'grantrade' ); ?></p>
						</td>
					</tr>
					<?php foreach ( $fields as $key => $meta ) : ?>
						<?php $val = grantrade_get_option( $key, $meta[2] ); ?>
						<tr>
							<th scope="row"><label for="<?php echo esc_attr( $key ); ?>"><?php echo esc_html( $meta[0] ); ?></label></th>
							<td>
								<?php if ( 'textarea' === $meta[1] ) : ?>
									<textarea id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" rows="3" class="large-text"><?php echo esc_textarea( $val ); ?></textarea>
								<?php else : ?>
									<input type="<?php echo esc_attr( $meta[1] ); ?>" id="<?php echo esc_attr( $key ); ?>" name="<?php echo esc_attr( $key ); ?>" value="<?php echo esc_attr( $val ); ?>" class="regular-text" />
								<?php endif; ?>
							</td>
						</tr>
					<?php endforeach; ?>
				</tbody>
			</table>

			<?php submit_button( __( 'Save Warehouse & Site Settings', 'grantrade' ) ); ?>
		</form>
	</div>
	<?php
}

function grantrade_handle_save_settings() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_save_settings_nonce' );

	$text_fields = array( 'gt_hero_tag', 'gt_hero_title', 'gt_address_line1', 'gt_address_line2', 'gt_phone_display', 'gt_phone_raw', 'gt_hours_summary' );
	foreach ( $text_fields as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			set_theme_mod( $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
	if ( isset( $_POST['gt_hero_lead'] ) ) {
		set_theme_mod( 'gt_hero_lead', sanitize_textarea_field( wp_unslash( $_POST['gt_hero_lead'] ) ) );
	}
	if ( isset( $_POST['gt_sales_email'] ) ) {
		set_theme_mod( 'gt_sales_email', sanitize_email( wp_unslash( $_POST['gt_sales_email'] ) ) );
	}
	if ( isset( $_POST['gt_inquiry_email'] ) ) {
		set_theme_mod( 'gt_inquiry_email', sanitize_email( wp_unslash( $_POST['gt_inquiry_email'] ) ) );
	}
	foreach ( array( 'gt_social_facebook', 'gt_social_houzz', 'gt_social_instagram', 'gt_social_yelp' ) as $url_key ) {
		if ( isset( $_POST[ $url_key ] ) ) {
			set_theme_mod( $url_key, esc_url_raw( trim( (string) wp_unslash( $_POST[ $url_key ] ) ) ) );
		}
	}
	if ( isset( $_POST['gt_catalog_mode'] ) ) {
		$mode = sanitize_key( wp_unslash( $_POST['gt_catalog_mode'] ) );
		set_theme_mod( 'gt_catalog_mode', in_array( $mode, array( 'merge', 'wp_only' ), true ) ? $mode : 'wp_only' );
	}

	wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-settings', 'gt_notice' => 'settings_ok' ), admin_url( 'admin.php' ) ) );
	exit;
}
add_action( 'admin_post_grantrade_save_settings', 'grantrade_handle_save_settings' );

/**
 * Page 3: Custom CSS & JS / Code Snippets Panel.
 */
function grantrade_render_custom_code_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$notice = isset( $_GET['gt_notice'] ) ? sanitize_key( wp_unslash( $_GET['gt_notice'] ) ) : '';
	$sn     = grantrade_get_custom_snippets();
	?>
	<div class="wrap gt-admin-wrap">
		<?php grantrade_admin_render_notice( $notice ); ?>

		<div class="gt-admin-hero">
			<div>
				<h1><?php esc_html_e( 'Custom CSS & JS / Code Snippets', 'grantrade' ); ?></h1>
				<p><?php esc_html_e( 'Inject custom stylesheet rules, analytics tags (<head>), or footer JavaScript cleanly across the website without needing external plugins.', 'grantrade' ); ?></p>
			</div>
		</div>

		<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
			<input type="hidden" name="action" value="grantrade_save_custom_code" />
			<?php wp_nonce_field( 'grantrade_save_custom_code_nonce' ); ?>

			<div class="gt-card gt-snippet-wrap">
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
					<h2 style="margin:0;"><?php esc_html_e( '1. Custom CSS (Frontend Stylesheet Override)', 'grantrade' ); ?></h2>
					<label><input type="checkbox" name="gt_css_enabled" value="1" <?php checked( $sn['css_enabled'] ); ?> /> <?php esc_html_e( 'Enabled', 'grantrade' ); ?></label>
				</div>
				<textarea id="gt_custom_css_box" name="gt_custom_css" rows="10" class="large-text code" data-gt-code-editor="css"><?php echo esc_textarea( $sn['css'] ); ?></textarea>
			</div>

			<div class="gt-card gt-snippet-wrap">
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
					<h2 style="margin:0;"><?php esc_html_e( '2. Header Scripts / Snippets (<head>)', 'grantrade' ); ?></h2>
					<label><input type="checkbox" name="gt_head_enabled" value="1" <?php checked( $sn['head_enabled'] ); ?> /> <?php esc_html_e( 'Enabled', 'grantrade' ); ?></label>
				</div>
				<textarea id="gt_custom_head_box" name="gt_custom_head" rows="8" class="large-text code" data-gt-code-editor="html"><?php echo esc_textarea( $sn['head'] ); ?></textarea>
			</div>

			<div class="gt-card gt-snippet-wrap">
				<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
					<h2 style="margin:0;"><?php esc_html_e( '3. Custom JavaScript (Footer before </body>)', 'grantrade' ); ?></h2>
					<label><input type="checkbox" name="gt_js_enabled" value="1" <?php checked( $sn['js_enabled'] ); ?> /> <?php esc_html_e( 'Enabled', 'grantrade' ); ?></label>
				</div>
				<textarea id="gt_custom_js_box" name="gt_custom_js" rows="10" class="large-text code" data-gt-code-editor="js"><?php echo esc_textarea( $sn['js'] ); ?></textarea>
			</div>

			<?php submit_button( __( 'Save All Custom CSS & JS Snippets', 'grantrade' ) ); ?>
		</form>
	</div>
	<?php
}

function grantrade_handle_save_custom_code() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_save_custom_code_nonce' );

	update_option( 'grantrade_custom_css_enabled', isset( $_POST['gt_css_enabled'] ) ? '1' : '0' );
	update_option( 'grantrade_custom_head_enabled', isset( $_POST['gt_head_enabled'] ) ? '1' : '0' );
	update_option( 'grantrade_custom_js_enabled', isset( $_POST['gt_js_enabled'] ) ? '1' : '0' );

	update_option( 'grantrade_custom_css', isset( $_POST['gt_custom_css'] ) ? (string) wp_unslash( $_POST['gt_custom_css'] ) : '' );
	update_option( 'grantrade_custom_head', isset( $_POST['gt_custom_head'] ) ? (string) wp_unslash( $_POST['gt_custom_head'] ) : '' );
	update_option( 'grantrade_custom_js', isset( $_POST['gt_custom_js'] ) ? (string) wp_unslash( $_POST['gt_custom_js'] ) : '' );

	wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-custom-code', 'gt_notice' => 'code_ok' ), admin_url( 'admin.php' ) ) );
	exit;
}
add_action( 'admin_post_grantrade_save_custom_code', 'grantrade_handle_save_custom_code' );

/**
 * File Manager Roots & Strict Path Sandbox Resolver.
 */
function grantrade_fm_get_roots() {
	$upload = wp_upload_dir();
	return array(
		'theme'   => array(
			'label' => __( 'Active Theme Files', 'grantrade' ),
			'path'  => realpath( get_stylesheet_directory() ) ?: get_stylesheet_directory(),
			'url'   => get_stylesheet_directory_uri(),
		),
		'uploads' => array(
			'label' => __( 'WP Uploads Folder', 'grantrade' ),
			'path'  => realpath( $upload['basedir'] ) ?: $upload['basedir'],
			'url'   => $upload['baseurl'],
		),
	);
}

/**
 * Resolve and validate a relative path strictly inside the chosen root (`theme` or `uploads`).
 */
function grantrade_fm_resolve_path( $root_key, $rel_path, $must_exist = true ) {
	$roots = grantrade_fm_get_roots();
	if ( ! isset( $roots[ $root_key ] ) ) {
		return false;
	}
	$base = rtrim( str_replace( '\\', '/', $roots[ $root_key ]['path'] ), '/' );
	$clean_rel = trim( str_replace( array( '\\', "\0" ), array( '/', '' ), (string) $rel_path ), '/' );
	if ( '' !== $clean_rel ) {
		foreach ( explode( '/', $clean_rel ) as $seg ) {
			if ( '..' === $seg || '.' === $seg || '' === $seg || 0 === strpos( $seg, '.' ) ) {
				return false;
			}
		}
	}

	$candidate = '' === $clean_rel ? $base : $base . '/' . $clean_rel;
	if ( $must_exist ) {
		$real = realpath( $candidate );
		if ( false === $real ) {
			return false;
		}
		$real_norm = rtrim( str_replace( '\\', '/', $real ), '/' );
		if ( $real_norm !== $base && 0 !== strpos( $real_norm, $base . '/' ) ) {
			return false;
		}
		return array(
			'root' => $root_key,
			'base' => $base,
			'rel'  => $clean_rel,
			'abs'  => $real_norm,
			'url'  => '' === $clean_rel ? $roots[ $root_key ]['url'] : rtrim( $roots[ $root_key ]['url'], '/' ) . '/' . $clean_rel,
		);
	}

	$parent = realpath( dirname( $candidate ) );
	if ( false === $parent ) {
		return false;
	}
	$parent_norm = rtrim( str_replace( '\\', '/', $parent ), '/' );
	if ( $parent_norm !== $base && 0 !== strpos( $parent_norm, $base . '/' ) ) {
		return false;
	}
	return array(
		'root' => $root_key,
		'base' => $base,
		'rel'  => $clean_rel,
		'abs'  => $parent_norm . '/' . basename( $candidate ),
		'url'  => rtrim( $roots[ $root_key ]['url'], '/' ) . '/' . $clean_rel,
	);
}

/**
 * Determine CodeMirror mode + whether file is editable text vs previewable image.
 */
function grantrade_fm_classify_file( $filename ) {
	$ext       = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
	$img_exts  = array( 'jpg', 'jpeg', 'png', 'gif', 'webp', 'svg' );
	$code_map  = array(
		'php'  => 'php',
		'css'  => 'css',
		'js'   => 'js',
		'json' => 'js',
		'html' => 'html',
		'htm'  => 'html',
		'svg'  => 'html',
		'xml'  => 'html',
		'md'   => 'default',
		'txt'  => 'default',
	);
	return array(
		'ext'      => $ext,
		'is_image' => in_array( $ext, $img_exts, true ),
		'is_text'  => isset( $code_map[ $ext ] ),
		'mode'     => isset( $code_map[ $ext ] ) ? $code_map[ $ext ] : 'default',
	);
}

/**
 * Page 4: Built-in WordPress File Manager & Core Theme Code Editor.
 */
function grantrade_render_file_manager_page() {
	if ( ! current_user_can( 'edit_themes' ) ) {
		return;
	}

	$roots      = grantrade_fm_get_roots();
	$root_key   = isset( $_GET['root'] ) ? sanitize_key( wp_unslash( $_GET['root'] ) ) : 'theme';
	if ( ! isset( $roots[ $root_key ] ) ) {
		$root_key = 'theme';
	}
	$rel_dir    = isset( $_GET['dir'] ) ? sanitize_text_field( wp_unslash( $_GET['dir'] ) ) : '';
	$dir_info   = grantrade_fm_resolve_path( $root_key, $rel_dir, true );
	if ( ! $dir_info || ! is_dir( $dir_info['abs'] ) ) {
		$dir_info = grantrade_fm_resolve_path( $root_key, '', true );
	}

	$edit_rel   = isset( $_GET['edit'] ) ? sanitize_text_field( wp_unslash( $_GET['edit'] ) ) : '';
	$edit_info  = $edit_rel ? grantrade_fm_resolve_path( $root_key, $edit_rel, true ) : false;
	if ( $edit_info && ! is_file( $edit_info['abs'] ) ) {
		$edit_info = false;
	}

	$notice     = isset( $_GET['gt_notice'] ) ? sanitize_key( wp_unslash( $_GET['gt_notice'] ) ) : '';
	$entries    = is_dir( $dir_info['abs'] ) ? scandir( $dir_info['abs'] ) : array();
	$dirs       = array();
	$files      = array();
	foreach ( (array) $entries as $entry ) {
		if ( '.' === $entry || '..' === $entry || '.DS_Store' === $entry ) {
			continue;
		}
		$full = $dir_info['abs'] . '/' . $entry;
		$item = array(
			'name'  => $entry,
			'rel'   => '' === $dir_info['rel'] ? $entry : $dir_info['rel'] . '/' . $entry,
			'mtime' => @filemtime( $full ) ?: 0,
			'size'  => is_file( $full ) ? (int) @filesize( $full ) : 0,
		);
		if ( is_dir( $full ) ) {
			$dirs[] = $item;
		} else {
			$files[] = $item;
		}
	}
	?>
	<div class="wrap gt-admin-wrap">
		<?php grantrade_admin_render_notice( $notice ); ?>

		<div class="gt-admin-hero">
			<div>
				<h1><?php esc_html_e( 'File Manager & Core Theme Code Editor', 'grantrade' ); ?></h1>
				<p><?php esc_html_e( 'Browse folders, upload new slab/banner pictures directly into WordPress, and make core theme/CSS/JS changes with syntax checking.', 'grantrade' ); ?></p>
			</div>
			<div class="gt-hero-actions">
				<?php foreach ( $roots as $r_key => $r_meta ) : ?>
					<?php
					$switch_url = add_query_arg(
						array(
							'page' => 'grantrade-file-manager',
							'root' => $r_key,
						),
						admin_url( 'admin.php' )
					);
					?>
					<a href="<?php echo esc_url( $switch_url ); ?>" class="button <?php echo $root_key === $r_key ? 'button-primary' : 'button-secondary'; ?>">
						<?php echo esc_html( $r_meta['label'] ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		</div>

		<div class="gt-card">
			<div class="gt-fm-toolbar">
				<div class="gt-fm-breadcrumbs">
					<span><?php esc_html_e( 'Location:', 'grantrade' ); ?></span>
					<a href="<?php echo esc_url( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root_key ), admin_url( 'admin.php' ) ) ); ?>">
						/<?php echo esc_html( $root_key ); ?>
					</a>
					<?php
					if ( '' !== $dir_info['rel'] ) {
						$acc = '';
						foreach ( explode( '/', $dir_info['rel'] ) as $part ) {
							$acc = '' === $acc ? $part : $acc . '/' . $part;
							$u   = add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root_key, 'dir' => $acc ), admin_url( 'admin.php' ) );
							echo ' / <a href="' . esc_url( $u ) . '">' . esc_html( $part ) . '</a>';
						}
					}
					?>
				</div>

				<div style="display:flex; gap:12px; flex-wrap:wrap; align-items:center;">
					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" enctype="multipart/form-data" style="display:flex; gap:6px; align-items:center;">
						<input type="hidden" name="action" value="grantrade_fm_upload" />
						<input type="hidden" name="root" value="<?php echo esc_attr( $root_key ); ?>" />
						<input type="hidden" name="dir" value="<?php echo esc_attr( $dir_info['rel'] ); ?>" />
						<?php wp_nonce_field( 'grantrade_fm_action' ); ?>
						<input type="file" name="gt_fm_file" required style="max-width:220px;" />
						<button type="submit" class="button button-primary"><?php esc_html_e( 'Upload Here', 'grantrade' ); ?></button>
					</form>

					<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>" style="display:flex; gap:6px; align-items:center;">
						<input type="hidden" name="action" value="grantrade_fm_mkdir" />
						<input type="hidden" name="root" value="<?php echo esc_attr( $root_key ); ?>" />
						<input type="hidden" name="dir" value="<?php echo esc_attr( $dir_info['rel'] ); ?>" />
						<?php wp_nonce_field( 'grantrade_fm_action' ); ?>
						<input type="text" name="folder_name" placeholder="new-folder" required style="width:130px;" />
						<button type="submit" class="button button-secondary"><?php esc_html_e( '+ New Folder', 'grantrade' ); ?></button>
					</form>
				</div>
			</div>

			<div class="gt-fm-grid">
				<div>
					<table class="widefat striped gt-fm-list-table">
						<thead>
							<tr>
								<th><?php esc_html_e( 'Name', 'grantrade' ); ?></th>
								<th><?php esc_html_e( 'Size', 'grantrade' ); ?></th>
								<th style="text-align:right;"><?php esc_html_e( 'Actions', 'grantrade' ); ?></th>
							</tr>
						</thead>
						<tbody>
							<?php if ( '' !== $dir_info['rel'] ) : ?>
								<?php
								$parent_rel = dirname( $dir_info['rel'] );
								$parent_rel = '.' === $parent_rel ? '' : $parent_rel;
								$up_url     = add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root_key, 'dir' => $parent_rel ), admin_url( 'admin.php' ) );
								?>
								<tr>
									<td colspan="3"><a href="<?php echo esc_url( $up_url ); ?>"><strong>.. (<?php esc_html_e( 'Parent Folder', 'grantrade' ); ?>)</strong></a></td>
								</tr>
							<?php endif; ?>

							<?php foreach ( $dirs as $d ) : ?>
								<?php $open_url = add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root_key, 'dir' => $d['rel'] ), admin_url( 'admin.php' ) ); ?>
								<tr>
									<td>
										<span class="dashicons dashicons-category" style="color:#8c6d46; vertical-align:middle;"></span>
										<a href="<?php echo esc_url( $open_url ); ?>"><strong><?php echo esc_html( $d['name'] ); ?>/</strong></a>
									</td>
									<td>—</td>
									<td style="text-align:right;"><a href="<?php echo esc_url( $open_url ); ?>" class="button button-small"><?php esc_html_e( 'Open', 'grantrade' ); ?></a></td>
								</tr>
							<?php endforeach; ?>

							<?php foreach ( $files as $f ) : ?>
								<?php
								$info      = grantrade_fm_classify_file( $f['name'] );
								$inspect_u = add_query_arg(
									array(
										'page' => 'grantrade-file-manager',
										'root' => $root_key,
										'dir'  => $dir_info['rel'],
										'edit' => $f['rel'],
									),
									admin_url( 'admin.php' )
								);
								$dl_u      = wp_nonce_url(
									add_query_arg(
										array(
											'action' => 'grantrade_fm_download',
											'root'   => $root_key,
											'file'   => $f['rel'],
										),
										admin_url( 'admin-post.php' )
									),
									'grantrade_fm_action'
								);
								?>
								<tr>
									<td>
										<span class="dashicons <?php echo $info['is_image'] ? 'dashicons-format-image' : 'dashicons-media-code'; ?>" style="color:#646970; vertical-align:middle;"></span>
										<a href="<?php echo esc_url( $inspect_u ); ?>"><?php echo esc_html( $f['name'] ); ?></a>
									</td>
									<td><?php echo esc_html( size_format( $f['size'] ) ); ?></td>
									<td style="text-align:right; white-space:nowrap;">
										<?php if ( $info['is_text'] || $info['is_image'] ) : ?>
											<a href="<?php echo esc_url( $inspect_u ); ?>" class="button button-small"><?php echo $info['is_text'] ? esc_html__( 'Edit', 'grantrade' ) : esc_html__( 'Preview', 'grantrade' ); ?></a>
										<?php endif; ?>
										<a href="<?php echo esc_url( $dl_u ); ?>" class="button button-small"><?php esc_html_e( 'Download', 'grantrade' ); ?></a>
									</td>
								</tr>
							<?php endforeach; ?>

							<?php if ( empty( $dirs ) && empty( $files ) ) : ?>
								<tr><td colspan="3"><?php esc_html_e( 'This folder is empty.', 'grantrade' ); ?></td></tr>
							<?php endif; ?>
						</tbody>
					</table>
				</div>

				<div class="gt-fm-code-wrap">
					<?php if ( $edit_info ) : ?>
						<?php $finfo = grantrade_fm_classify_file( $edit_info['abs'] ); ?>
						<h3 style="margin-top:0;"><?php echo esc_html( basename( $edit_info['abs'] ) ); ?> <small style="color:#646970; font-weight:400;">(<?php echo esc_html( $edit_info['rel'] ); ?>)</small></h3>

						<?php if ( $finfo['is_image'] ) : ?>
							<img src="<?php echo esc_url( $edit_info['url'] ); ?>" alt="" class="gt-fm-img-preview" />
							<p><strong><?php esc_html_e( 'Public URL:', 'grantrade' ); ?></strong> <code><?php echo esc_html( $edit_info['url'] ); ?></code></p>
						<?php endif; ?>

						<?php if ( $finfo['is_text'] ) : ?>
							<?php $contents = (string) file_get_contents( $edit_info['abs'] ); ?>
							<form method="post" action="<?php echo esc_url( admin_url( 'admin-post.php' ) ); ?>">
								<input type="hidden" name="action" value="grantrade_fm_save" />
								<input type="hidden" name="root" value="<?php echo esc_attr( $root_key ); ?>" />
								<input type="hidden" name="dir" value="<?php echo esc_attr( $dir_info['rel'] ); ?>" />
								<input type="hidden" name="file" value="<?php echo esc_attr( $edit_info['rel'] ); ?>" />
								<?php wp_nonce_field( 'grantrade_fm_action' ); ?>

								<textarea
									id="gtFmCodeEditor"
									name="file_content"
									rows="22"
									class="large-text code"
									data-gt-code-editor="<?php echo esc_attr( $finfo['mode'] ); ?>"
								><?php echo esc_textarea( $contents ); ?></textarea>

								<p style="margin-top:12px; display:flex; align-items:center; gap:12px;">
									<button type="submit" class="button button-primary"><?php esc_html_e( 'Save Core File Changes', 'grantrade' ); ?></button>
									<span class="description"><?php esc_html_e( 'PHP files run a syntax check before overwriting.', 'grantrade' ); ?></span>
								</p>
							</form>
						<?php endif; ?>
					<?php else : ?>
						<div style="border:1px dashed #c3c4c7; border-radius:4px; padding:32px; text-align:center; color:#646970;">
							<p style="margin:0;"><?php esc_html_e( 'Select any theme file on the left to edit PHP/CSS/JS/JSON code or preview images.', 'grantrade' ); ?></p>
						</div>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
	<?php
}

function grantrade_handle_fm_save() {
	if ( ! current_user_can( 'edit_themes' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_fm_action' );

	$root = isset( $_POST['root'] ) ? sanitize_key( wp_unslash( $_POST['root'] ) ) : 'theme';
	$dir  = isset( $_POST['dir'] ) ? sanitize_text_field( wp_unslash( $_POST['dir'] ) ) : '';
	$file = isset( $_POST['file'] ) ? sanitize_text_field( wp_unslash( $_POST['file'] ) ) : '';
	$info = grantrade_fm_resolve_path( $root, $file, true );

	if ( ! $info || ! is_file( $info['abs'] ) ) {
		wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'gt_notice' => 'invalid_path' ), admin_url( 'admin.php' ) ) );
		exit;
	}

	$finfo   = grantrade_fm_classify_file( $info['abs'] );
	$content = isset( $_POST['file_content'] ) ? (string) wp_unslash( $_POST['file_content'] ) : '';

	if ( 'php' === $finfo['ext'] && function_exists( 'exec' ) ) {
		$tmp = wp_tempnam( 'gt-lint.php' );
		if ( $tmp ) {
			file_put_contents( $tmp, $content );
			$out  = array();
			$code = 0;
			@exec( 'php -l ' . escapeshellarg( $tmp ) . ' 2>&1', $out, $code );
			@unlink( $tmp );
			if ( 0 !== $code ) {
				wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'edit' => $file, 'gt_notice' => 'php_syntax' ), admin_url( 'admin.php' ) ) );
				exit;
			}
		}
	}

	file_put_contents( $info['abs'], $content );
	wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'edit' => $file, 'gt_notice' => 'file_saved' ), admin_url( 'admin.php' ) ) );
	exit;
}
add_action( 'admin_post_grantrade_fm_save', 'grantrade_handle_fm_save' );

function grantrade_handle_fm_upload() {
	if ( ! current_user_can( 'edit_themes' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_fm_action' );

	$root = isset( $_POST['root'] ) ? sanitize_key( wp_unslash( $_POST['root'] ) ) : 'theme';
	$dir  = isset( $_POST['dir'] ) ? sanitize_text_field( wp_unslash( $_POST['dir'] ) ) : '';
	if ( empty( $_FILES['gt_fm_file']['tmp_name'] ) || ! is_uploaded_file( $_FILES['gt_fm_file']['tmp_name'] ) ) {
		wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'gt_notice' => 'upload_err' ), admin_url( 'admin.php' ) ) );
		exit;
	}

	$filename = sanitize_file_name( wp_unslash( $_FILES['gt_fm_file']['name'] ) );
	$ext      = strtolower( pathinfo( $filename, PATHINFO_EXTENSION ) );
	$allowed  = array( 'jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'css', 'js', 'json', 'txt', 'md', 'pdf', 'woff', 'woff2', 'ttf' );
	$is_safe  = in_array( $ext, $allowed, true )
		&& 0 !== strpos( $filename, '.' )
		&& ! preg_match( '/\.(?:php\d*|phtml|phar|pl|py|cgi|sh|exe|bat|cmd)(?:\.|$)/i', $filename );
	if ( ! $is_safe ) {
		wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'gt_notice' => 'upload_err' ), admin_url( 'admin.php' ) ) );
		exit;
	}

	$rel_dest = '' === trim( $dir, '/' ) ? $filename : trim( $dir, '/' ) . '/' . $filename;
	$dest     = grantrade_fm_resolve_path( $root, $rel_dest, false );
	if ( ! $dest || ! @move_uploaded_file( $_FILES['gt_fm_file']['tmp_name'], $dest['abs'] ) ) {
		wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'gt_notice' => 'upload_err' ), admin_url( 'admin.php' ) ) );
		exit;
	}

	wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'edit' => $dest['rel'], 'gt_notice' => 'file_uploaded' ), admin_url( 'admin.php' ) ) );
	exit;
}
add_action( 'admin_post_grantrade_fm_upload', 'grantrade_handle_fm_upload' );

function grantrade_handle_fm_mkdir() {
	if ( ! current_user_can( 'edit_themes' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_fm_action' );

	$root   = isset( $_POST['root'] ) ? sanitize_key( wp_unslash( $_POST['root'] ) ) : 'theme';
	$dir    = isset( $_POST['dir'] ) ? sanitize_text_field( wp_unslash( $_POST['dir'] ) ) : '';
	$folder = isset( $_POST['folder_name'] ) ? sanitize_file_name( wp_unslash( $_POST['folder_name'] ) ) : '';
	$rel    = '' === trim( $dir, '/' ) ? $folder : trim( $dir, '/' ) . '/' . $folder;
	$dest   = $folder ? grantrade_fm_resolve_path( $root, $rel, false ) : false;

	if ( ! $dest || ! wp_mkdir_p( $dest['abs'] ) ) {
		wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dir, 'gt_notice' => 'invalid_path' ), admin_url( 'admin.php' ) ) );
		exit;
	}

	wp_safe_redirect( add_query_arg( array( 'page' => 'grantrade-file-manager', 'root' => $root, 'dir' => $dest['rel'], 'gt_notice' => 'dir_created' ), admin_url( 'admin.php' ) ) );
	exit;
}
add_action( 'admin_post_grantrade_fm_mkdir', 'grantrade_handle_fm_mkdir' );

function grantrade_handle_fm_download() {
	if ( ! current_user_can( 'edit_themes' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_fm_action' );

	$root = isset( $_GET['root'] ) ? sanitize_key( wp_unslash( $_GET['root'] ) ) : 'theme';
	$file = isset( $_GET['file'] ) ? sanitize_text_field( wp_unslash( $_GET['file'] ) ) : '';
	$info = grantrade_fm_resolve_path( $root, $file, true );
	if ( ! $info || ! is_file( $info['abs'] ) ) {
		wp_die( esc_html__( 'File not found.', 'grantrade' ), 404 );
	}

	header( 'Content-Type: application/octet-stream' );
	header( 'Content-Disposition: attachment; filename="' . basename( $info['abs'] ) . '"' );
	header( 'Content-Length: ' . filesize( $info['abs'] ) );
	readfile( $info['abs'] ); // phpcs:ignore WordPress.WP.AlternativeFunctions.file_system_operations_readfile
	exit;
}
add_action( 'admin_post_grantrade_fm_download', 'grantrade_handle_fm_download' );

