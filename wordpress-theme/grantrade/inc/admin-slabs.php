<?php
/**
 * WordPress Admin Enhancements for Stone Slabs (`gt_slab`) & Yard Inquiries (`gt_inquiry`)
 *
 * - Custom admin columns, color swatch pills, and category filters
 * - Built-in catalog importer & JSON exporter
 * - Yard inquiry status management & CSV export
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared color tag swatches used across admin columns and preset buttons.
 */
function grantrade_get_color_swatches() {
	$defaults = array(
		'white'    => array( 'label' => 'White', 'hex' => '#f8f9fa' ),
		'grey'     => array( 'label' => 'Grey', 'hex' => '#8e969e' ),
		'black'    => array( 'label' => 'Black', 'hex' => '#1e2022' ),
		'blue'     => array( 'label' => 'Blue', 'hex' => '#2b5e82' ),
		'green'    => array( 'label' => 'Green', 'hex' => '#2d6a4f' ),
		'gold'     => array( 'label' => 'Gold', 'hex' => '#b08946' ),
		'cream'    => array( 'label' => 'Cream', 'hex' => '#ece2cf' ),
		'brown'    => array( 'label' => 'Brown', 'hex' => '#6f4e37' ),
		'red'      => array( 'label' => 'Red', 'hex' => '#8c2d2d' ),
		'emerald'  => array( 'label' => 'Emerald', 'hex' => '#1b7f5a' ),
		'teal'     => array( 'label' => 'Teal', 'hex' => '#2a7b88' ),
		'metallic' => array( 'label' => 'Metallic', 'hex' => '#7a8086' ),
	);

	$custom = get_option( 'gt_custom_color_swatches', array() );
	if ( is_array( $custom ) ) {
		foreach ( $custom as $token => $info ) {
			$clean_token = strtolower( trim( (string) $token ) );
			if ( '' === $clean_token || isset( $defaults[ $clean_token ] ) ) {
				continue;
			}
			$hex = ( is_array( $info ) && ! empty( $info['hex'] ) ) ? sanitize_hex_color( $info['hex'] ) : '';
			$defaults[ $clean_token ] = array(
				'label' => ucwords( $clean_token ),
				'hex'   => $hex ? $hex : '#8b929a',
			);
		}
	}

	return $defaults;
}

/**
 * Save a user-defined custom color tag so it appears as a reusable preset chip on future slabs.
 */
function grantrade_register_custom_color_swatch( $raw_token, $raw_hex = '' ) {
	$token = strtolower( trim( preg_replace( '/\s+/', ' ', sanitize_text_field( (string) $raw_token ) ) ) );
	if ( '' === $token ) {
		return;
	}
	$builtins = array( 'white', 'grey', 'black', 'blue', 'green', 'gold', 'cream', 'brown', 'red', 'emerald', 'teal', 'metallic' );
	if ( in_array( $token, $builtins, true ) ) {
		return;
	}
	$custom = get_option( 'gt_custom_color_swatches', array() );
	$custom = is_array( $custom ) ? $custom : array();
	$hex    = sanitize_hex_color( (string) $raw_hex );
	if ( ! $hex ) {
		$hex = isset( $custom[ $token ]['hex'] ) ? $custom[ $token ]['hex'] : '#8b929a';
	}
	if ( ! isset( $custom[ $token ] ) || $custom[ $token ]['hex'] !== $hex ) {
		$custom[ $token ] = array(
			'label' => ucwords( $token ),
			'hex'   => $hex,
		);
		update_option( 'gt_custom_color_swatches', $custom, false );
	}
}

/**
 * Render color pills HTML from a comma-separated color meta string.
 */
function grantrade_render_color_pills_html( $raw_colors ) {
	$tokens = array_values( array_filter( array_map( 'trim', preg_split( '/[,;|\/]+/', strtolower( (string) $raw_colors ) ) ) ) );
	if ( empty( $tokens ) ) {
		return '<span style="color:#8c8f94;">—</span>';
	}
	$swatches = grantrade_get_color_swatches();
	$out      = '<div class="gt-color-pills">';
	foreach ( $tokens as $token ) {
		$label = isset( $swatches[ $token ] ) ? $swatches[ $token ]['label'] : ucwords( $token );
		$hex   = isset( $swatches[ $token ] ) ? $swatches[ $token ]['hex'] : '#8b929a';
		$out  .= '<span class="gt-badge"><span class="gt-color-dot" style="background:' . esc_attr( $hex ) . ';"></span>' . esc_html( $label ) . '</span>';
	}
	$out .= '</div>';
	return $out;
}

/**
 * Custom admin list columns for `gt_slab`.
 */
function grantrade_slab_admin_columns( $columns ) {
	return array(
		'cb'                 => isset( $columns['cb'] ) ? $columns['cb'] : '<input type="checkbox" />',
		'gt_thumb'           => __( 'Slab Photo', 'grantrade' ),
		'title'              => __( 'Stone Name', 'grantrade' ),
		'taxonomy-gt_family' => __( 'Stone Family', 'grantrade' ),
		'gt_number'          => __( 'GT Number', 'grantrade' ),
		'gt_lot'             => __( 'Lot Number', 'grantrade' ),
		'gt_thickness'       => __( 'Thickness', 'grantrade' ),
		'gt_colors'          => __( 'Color Tags', 'grantrade' ),
		'date'               => __( 'Date', 'grantrade' ),
	);
}
add_filter( 'manage_gt_slab_posts_columns', 'grantrade_slab_admin_columns' );

function grantrade_render_slab_admin_column( $column, $post_id ) {
	switch ( $column ) {
		case 'gt_thumb':
			$img = get_the_post_thumbnail_url( $post_id, 'thumbnail' );
			if ( ! $img ) {
				$img = trim( (string) get_post_meta( $post_id, '_gt_image1', true ) );
			}
			if ( ! $img ) {
				$terms = get_the_terms( $post_id, 'gt_family' );
				$slug  = ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? $terms[0]->slug : 'quartzite';
				$img   = get_template_directory_uri() . '/assets/images/stone-types/' . sanitize_file_name( $slug ) . '.jpg';
			}
			echo '<img src="' . esc_url( $img ) . '" alt="" class="gt-thumb-img" />';
			break;

		case 'gt_number':
			$terms  = get_the_terms( $post_id, 'gt_family' );
			$slug   = ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? $terms[0]->slug : '';
			$gt_num = get_post_meta( $post_id, '_gt_number', true );
			if ( in_array( $slug, array( 'granite', 'quartzite', 'marble' ), true ) ) {
				echo '<span style="color:#8c8f94;">—</span>';
			} else {
				echo '<strong>' . esc_html( $gt_num ? $gt_num : '—' ) . '</strong>';
			}
			break;

		case 'gt_lot':
			$lot = get_post_meta( $post_id, '_gt_lot_number', true );
			echo $lot ? '<code>' . esc_html( $lot ) . '</code>' : '<span style="color:#8c8f94;">—</span>';
			break;

		case 'gt_thickness':
			$thick = get_post_meta( $post_id, '_gt_thickness', true );
			echo $thick ? esc_html( $thick ) : '<span style="color:#8c8f94;">—</span>';
			break;

		case 'gt_colors':
			echo grantrade_render_color_pills_html( get_post_meta( $post_id, '_gt_colors', true ) );
			break;
	}
}
add_action( 'manage_gt_slab_posts_custom_column', 'grantrade_render_slab_admin_column', 10, 2 );

/**
 * Filter Stone Slabs list table by Stone Family (`gt_family`).
 */
function grantrade_slab_family_filter_dropdown( $post_type ) {
	if ( 'gt_slab' !== $post_type ) {
		return;
	}
	$selected = isset( $_GET['gt_family'] ) ? sanitize_text_field( wp_unslash( $_GET['gt_family'] ) ) : '';
	wp_dropdown_categories(
		array(
			'show_option_all' => __( 'All Stone Families', 'grantrade' ),
			'taxonomy'        => 'gt_family',
			'name'            => 'gt_family',
			'value_field'     => 'slug',
			'selected'        => $selected,
			'hierarchical'    => true,
			'hide_empty'      => false,
		)
	);
}
add_action( 'restrict_manage_posts', 'grantrade_slab_family_filter_dropdown' );

/**
 * Make FileBird's folder exclusion query SQLite-compatible when running under WP_SQLite_DB.
 */
function grantrade_fix_filebird_sqlite_clauses( $clauses ) {
	if ( ( class_exists( 'WP_SQLite_DB' ) || ( defined( 'DB_ENGINE' ) && 'sqlite' === DB_ENGINE ) ) && ! empty( $clauses['where'] ) ) {
		if ( false !== stripos( $clauses['where'], 'FIND_IN_SET' ) ) {
			$clauses['where'] = preg_replace(
				'/HAVING\s+FIND_IN_SET\s*\(\s*([0-9]+)\s*,\s*GROUP_CONCAT\s*\(\s*([^)]+)\s*\)\s*\)/i',
				"HAVING (',' || COALESCE(GROUP_CONCAT($2), '') || ',') LIKE '%,$1,%'",
				$clauses['where']
			);
		}
	}
	return $clauses;
}
add_filter( 'posts_clauses', 'grantrade_fix_filebird_sqlite_clauses', 25, 1 );

/**
 * Inquiry status map shared across Yard Inquiries admin screen and CSV export.
 */
function grantrade_get_inquiry_statuses() {
	return array(
		'new'       => __( 'New Lead', 'grantrade' ),
		'contacted' => __( 'Contacted', 'grantrade' ),
		'held'      => __( 'Bundle Held', 'grantrade' ),
		'archived'  => __( 'Archived', 'grantrade' ),
	);
}

/**
 * Custom admin columns for `gt_inquiry`.
 */
function grantrade_inquiry_admin_columns( $columns ) {
	return array(
		'cb'             => isset( $columns['cb'] ) ? $columns['cb'] : '<input type="checkbox" />',
		'title'          => __( 'Inquiry Summary', 'grantrade' ),
		'gt_inq_contact' => __( 'Customer / Company', 'grantrade' ),
		'gt_inq_reach'   => __( 'Email & Phone', 'grantrade' ),
		'gt_inq_stones'  => __( 'Requested Slabs / Lot', 'grantrade' ),
		'gt_inq_status'  => __( 'Status', 'grantrade' ),
		'date'           => __( 'Submitted', 'grantrade' ),
	);
}
add_filter( 'manage_gt_inquiry_posts_columns', 'grantrade_inquiry_admin_columns' );

function grantrade_render_inquiry_admin_column( $column, $post_id ) {
	$statuses = grantrade_get_inquiry_statuses();
	switch ( $column ) {
		case 'gt_inq_contact':
			$name    = get_post_meta( $post_id, '_gt_inq_name', true );
			$company = get_post_meta( $post_id, '_gt_inq_company', true );
			if ( $name ) {
				echo '<strong>' . esc_html( $name ) . '</strong><br/>';
			}
			echo '<span style="color:#646970;">' . esc_html( $company ? $company : __( 'Individual / Trade', 'grantrade' ) ) . '</span>';
			break;

		case 'gt_inq_reach':
			$email = get_post_meta( $post_id, '_gt_inq_email', true );
			$phone = get_post_meta( $post_id, '_gt_inq_phone', true );
			if ( $email ) {
				echo '<a href="mailto:' . esc_attr( $email ) . '">' . esc_html( $email ) . '</a>';
			}
			if ( $phone ) {
				echo '<br/><span>' . esc_html( $phone ) . '</span>';
			}
			break;

		case 'gt_inq_stones':
			$stones = get_post_meta( $post_id, '_gt_inq_stones', true );
			echo esc_html( $stones ? $stones : '—' );
			break;

		case 'gt_inq_status':
			$status = get_post_meta( $post_id, '_gt_inq_status', true ) ?: 'new';
			$label  = isset( $statuses[ $status ] ) ? $statuses[ $status ] : $statuses['new'];
			$cls    = 'held' === $status ? 'gt-badge-ok' : ( 'new' === $status ? 'gt-badge-role' : '' );
			echo '<span class="gt-badge ' . esc_attr( $cls ) . '">' . esc_html( $label ) . '</span>';
			break;
	}
}
add_action( 'manage_gt_inquiry_posts_custom_column', 'grantrade_render_inquiry_admin_column', 10, 2 );

/**
 * Add CSV export button directly on `edit.php?post_type=gt_inquiry`.
 */
function grantrade_inquiry_export_button( $which ) {
	if ( 'top' !== $which ) {
		return;
	}
	$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
	if ( ! $screen || 'gt_inquiry' !== $screen->post_type ) {
		return;
	}
	$export_url = wp_nonce_url( admin_url( 'admin-post.php?action=grantrade_export_inquiries_csv' ), 'grantrade_export_inquiries' );
	echo '<a href="' . esc_url( $export_url ) . '" class="button button-secondary" style="margin-left:6px;">' . esc_html__( 'Export Inquiries CSV', 'grantrade' ) . '</a>';
}
add_action( 'manage_posts_extra_tablenav', 'grantrade_inquiry_export_button' );

/**
 * Inquiry Status & Contact Details Meta Box when viewing an Inquiry record.
 */
function grantrade_add_inquiry_meta_box() {
	add_meta_box(
		'grantrade_inquiry_status_box',
		__( 'Lead Status & Contact Summary', 'grantrade' ),
		'grantrade_render_inquiry_meta_box',
		'gt_inquiry',
		'side',
		'high'
	);
}
add_action( 'add_meta_boxes', 'grantrade_add_inquiry_meta_box' );

function grantrade_render_inquiry_meta_box( $post ) {
	wp_nonce_field( 'grantrade_save_inquiry_meta', 'grantrade_inquiry_meta_nonce' );
	$status   = get_post_meta( $post->ID, '_gt_inq_status', true ) ?: 'new';
	$statuses = grantrade_get_inquiry_statuses();
	$email    = get_post_meta( $post->ID, '_gt_inq_email', true );
	$phone    = get_post_meta( $post->ID, '_gt_inq_phone', true );
	$company  = get_post_meta( $post->ID, '_gt_inq_company', true );
	$stones   = get_post_meta( $post->ID, '_gt_inq_stones', true );
	?>
	<p>
		<label for="gt_inq_status" style="font-weight:600; display:block; margin-bottom:4px;"><?php esc_html_e( 'Lead Status', 'grantrade' ); ?></label>
		<select id="gt_inq_status" name="_gt_inq_status" style="width:100%;">
			<?php foreach ( $statuses as $key => $label ) : ?>
				<option value="<?php echo esc_attr( $key ); ?>" <?php selected( $status, $key ); ?>><?php echo esc_html( $label ); ?></option>
			<?php endforeach; ?>
		</select>
	</p>
	<p><strong><?php esc_html_e( 'Company:', 'grantrade' ); ?></strong> <?php echo esc_html( $company ?: '—' ); ?></p>
	<p><strong><?php esc_html_e( 'Email:', 'grantrade' ); ?></strong> <?php echo esc_html( $email ?: '—' ); ?></p>
	<p><strong><?php esc_html_e( 'Phone:', 'grantrade' ); ?></strong> <?php echo esc_html( $phone ?: '—' ); ?></p>
	<p><strong><?php esc_html_e( 'Stones:', 'grantrade' ); ?></strong> <?php echo esc_html( $stones ?: '—' ); ?></p>
	<?php
}

function grantrade_save_inquiry_meta( $post_id ) {
	if ( ! isset( $_POST['grantrade_inquiry_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['grantrade_inquiry_meta_nonce'] ) ), 'grantrade_save_inquiry_meta' ) ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}
	if ( isset( $_POST['_gt_inq_status'] ) ) {
		$allowed = array_keys( grantrade_get_inquiry_statuses() );
		$status  = sanitize_key( wp_unslash( $_POST['_gt_inq_status'] ) );
		if ( in_array( $status, $allowed, true ) ) {
			update_post_meta( $post_id, '_gt_inq_status', $status );
		}
	}
}
add_action( 'save_post_gt_inquiry', 'grantrade_save_inquiry_meta' );

/**
 * Attach a local theme image file into the WP Media Library once cleanly without duplicating assets.
 */
function grantrade_attach_theme_image( $rel_path, $post_id = 0 ) {
	$clean_rel = ltrim( str_replace( array( '../', '..\\' ), '', (string) $rel_path ), '/' );
	$abs_path  = trailingslashit( get_template_directory() ) . $clean_rel;
	if ( ! $clean_rel || ! file_exists( $abs_path ) || ! is_file( $abs_path ) ) {
		return 0;
	}

	$existing = get_posts(
		array(
			'post_type'      => 'attachment',
			'post_status'    => 'inherit',
			'meta_key'       => '_gt_source_asset',
			'meta_value'     => $clean_rel,
			'posts_per_page' => 1,
			'fields'         => 'ids',
		)
	);
	if ( ! empty( $existing ) ) {
		return (int) $existing[0];
	}

	if ( ! function_exists( 'wp_generate_attachment_metadata' ) ) {
		require_once ABSPATH . 'wp-admin/includes/image.php';
	}

	$upload = wp_upload_bits( basename( $abs_path ), null, file_get_contents( $abs_path ) );
	if ( ! empty( $upload['error'] ) || empty( $upload['file'] ) ) {
		return 0;
	}

	$filetype = wp_check_filetype( basename( $upload['file'] ) );
	$att_id   = wp_insert_attachment(
		array(
			'guid'           => $upload['url'],
			'post_mime_type' => $filetype['type'] ?: 'image/jpeg',
			'post_title'     => sanitize_text_field( pathinfo( $abs_path, PATHINFO_FILENAME ) ),
			'post_status'    => 'inherit',
		),
		$upload['file'],
		$post_id
	);

	if ( $att_id && ! is_wp_error( $att_id ) ) {
		$meta = wp_generate_attachment_metadata( $att_id, $upload['file'] );
		if ( ! is_wp_error( $meta ) ) {
			wp_update_attachment_metadata( $att_id, $meta );
		}
		update_post_meta( $att_id, '_gt_source_asset', $clean_rel );
		return (int) $att_id;
	}

	return 0;
}

/**
 * Import an array of catalog stone definitions into WordPress `gt_slab` posts (idempotent by slug).
 *
 * @param array $stones Catalog stone definitions.
 * @return array Summary counts (`created`, `skipped`).
 */
function grantrade_import_stones_array( $stones ) {
	$created = 0;
	$skipped = 0;
	$families = grantrade_get_canonical_family_labels();

	foreach ( $stones as $stone ) {
		if ( ! is_array( $stone ) || empty( $stone['name'] ) ) {
			continue;
		}
		$slug = ! empty( $stone['id'] ) ? sanitize_title( $stone['id'] ) : sanitize_title( $stone['name'] );
		if ( get_page_by_path( $slug, OBJECT, 'gt_slab' ) ) {
			$skipped++;
			continue;
		}

		$desc = ! empty( $stone['description'] ) ? sanitize_textarea_field( $stone['description'] ) : '';
		$post_id = wp_insert_post(
			array(
				'post_type'    => 'gt_slab',
				'post_status'  => 'publish',
				'post_title'   => sanitize_text_field( $stone['name'] ),
				'post_name'    => $slug,
				'post_excerpt' => $desc,
				'post_content' => $desc,
			)
		);
		if ( ! $post_id || is_wp_error( $post_id ) ) {
			continue;
		}

		$cat_slug = ! empty( $stone['category'] ) ? sanitize_key( $stone['category'] ) : 'quartzite';
		if ( isset( $families[ $cat_slug ] ) ) {
			wp_set_object_terms( $post_id, $cat_slug, 'gt_family' );
		}

		$colors_arr = array();
		if ( ! empty( $stone['colors'] ) && is_array( $stone['colors'] ) ) {
			$colors_arr = array_values( array_filter( array_map( 'sanitize_text_field', $stone['colors'] ) ) );
		}
		if ( ! empty( $colors_arr ) ) {
			wp_set_object_terms( $post_id, $colors_arr, 'post_tag' );
		}

		$gt_num = in_array( $cat_slug, array( 'granite', 'quartzite', 'marble' ), true )
			? ''
			: sanitize_text_field( $stone['gtNumber'] ?? '' );

		update_post_meta( $post_id, '_gt_number', $gt_num );
		update_post_meta( $post_id, '_gt_lot_number', sanitize_text_field( $stone['lotNumber'] ?? 'LOT #' . $post_id ) );
		update_post_meta( $post_id, '_gt_thickness', sanitize_text_field( $stone['thickness'] ?? '3 cm' ) );
		update_post_meta( $post_id, '_gt_size', sanitize_text_field( $stone['size'] ?? '128" × 76" · 67.5 sq. ft.' ) );
		update_post_meta( $post_id, '_gt_finish', sanitize_text_field( $stone['finish'] ?? 'Polished' ) );
		update_post_meta( $post_id, '_gt_origin', sanitize_text_field( $stone['origin'] ?? 'Carlstadt Stock' ) );
		update_post_meta( $post_id, '_gt_type', 'engineered' === ( $stone['type'] ?? '' ) ? 'engineered' : 'natural' );
		update_post_meta( $post_id, '_gt_colors', strtolower( implode( ', ', $colors_arr ) ) );
		update_post_meta( $post_id, '_gt_application', sanitize_text_field( $stone['application'] ?? 'Kitchen Islands · Feature Walls' ) );
		update_post_meta( $post_id, '_gt_in_stock', ( isset( $stone['inStock'] ) && false === $stone['inStock'] ) ? '0' : '1' );

		$img1_rel = $stone['image1'] ?? $stone['image'] ?? ( 'assets/images/stone-types/' . $cat_slug . '.jpg' );
		if ( ! file_exists( trailingslashit( get_template_directory() ) . ltrim( (string) $img1_rel, '/' ) ) ) {
			$img1_rel = 'assets/images/stone-types/' . $cat_slug . '.jpg';
		}
		$att_id = grantrade_attach_theme_image( $img1_rel, $post_id );
		if ( $att_id ) {
			set_post_thumbnail( $post_id, $att_id );
			$att_url = wp_get_attachment_url( $att_id );
			if ( $att_url ) {
				update_post_meta( $post_id, '_gt_image2', esc_url_raw( $att_url ) );
			}
		} else {
			update_post_meta( $post_id, '_gt_image2', esc_url_raw( get_template_directory_uri() . '/' . ltrim( $img1_rel, '/' ) ) );
		}

		$created++;
	}

	return array(
		'created' => $created,
		'skipped' => $skipped,
	);
}

/**
 * Download WordPress slabs catalog JSON.
 */
function grantrade_handle_export_catalog_json() {
	if ( ! current_user_can( 'manage_options' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_export_catalog' );

	$stones = grantrade_get_wp_stones();
	header( 'Content-Type: application/json; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="grantrade-wp-slabs-' . gmdate( 'Y-m-d' ) . '.json"' );
	echo wp_json_encode( $stones, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES );
	exit;
}
add_action( 'admin_post_grantrade_export_catalog_json', 'grantrade_handle_export_catalog_json' );

/**
 * Export Yard Inquiries as CSV.
 */
function grantrade_handle_export_inquiries_csv() {
	if ( ! current_user_can( 'edit_posts' ) ) {
		wp_die( esc_html__( 'Unauthorized', 'grantrade' ), 403 );
	}
	check_admin_referer( 'grantrade_export_inquiries' );

	$posts = get_posts(
		array(
			'post_type'      => 'gt_inquiry',
			'post_status'    => array( 'private', 'publish' ),
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	header( 'Content-Type: text/csv; charset=utf-8' );
	header( 'Content-Disposition: attachment; filename="grantrade-inquiries-' . gmdate( 'Y-m-d' ) . '.csv"' );

	$out = fopen( 'php://output', 'w' );
	fputcsv( $out, array( 'ID', 'Date', 'Status', 'Name', 'Company', 'Email', 'Phone', 'Inquiry Type', 'Stones / Lot', 'Message' ) );
	foreach ( $posts as $post ) {
		fputcsv(
			$out,
			array(
				$post->ID,
				$post->post_date,
				get_post_meta( $post->ID, '_gt_inq_status', true ) ?: 'new',
				get_post_meta( $post->ID, '_gt_inq_name', true ) ?: $post->post_title,
				get_post_meta( $post->ID, '_gt_inq_company', true ),
				get_post_meta( $post->ID, '_gt_inq_email', true ),
				get_post_meta( $post->ID, '_gt_inq_phone', true ),
				get_post_meta( $post->ID, '_gt_inq_type', true ),
				get_post_meta( $post->ID, '_gt_inq_stones', true ),
				wp_strip_all_tags( $post->post_content ),
			)
		);
	}
	fclose( $out );
	exit;
}
add_action( 'admin_post_grantrade_export_inquiries_csv', 'grantrade_handle_export_inquiries_csv' );

