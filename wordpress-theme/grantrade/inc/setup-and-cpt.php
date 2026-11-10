<?php
/**
 * Theme Setup, Page Provisioning, Stone Slabs CPT & Yard Inquiries CPT
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Resolve page URL by page template or slug, with clean fallback.
 */
function grantrade_get_page_url( $slug, $query_args = array() ) {
	if ( 'home' === $slug ) {
		$url = home_url( '/' );
		return ! empty( $query_args ) ? add_query_arg( $query_args, $url ) : $url;
	}

	$template_file = 'page-' . sanitize_key( $slug ) . '.php';
	$pages         = get_pages(
		array(
			'meta_key'   => '_wp_page_template',
			'meta_value' => $template_file,
			'number'     => 1,
		)
	);

	if ( ! empty( $pages ) ) {
		$url = get_permalink( $pages[0]->ID );
	} else {
		$by_path = get_page_by_path( $slug );
		$url     = $by_path ? get_permalink( $by_path->ID ) : home_url( '/' . trim( $slug, '/' ) . '/' );
	}

	return ! empty( $query_args ) ? add_query_arg( $query_args, $url ) : $url;
}

/**
 * Core WordPress theme supports and navigation menus.
 */
function grantrade_setup() {
	load_theme_textdomain( 'grantrade', get_template_directory() . '/languages' );

	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support(
		'html5',
		array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
			'style',
			'script',
			'navigation-widgets',
		)
	);
	add_theme_support(
		'custom-logo',
		array(
			'height'      => 76,
			'width'       => 320,
			'flex-height' => true,
			'flex-width'  => true,
		)
	);
	add_theme_support( 'align-wide' );
	add_theme_support( 'wp-block-styles' );
	add_theme_support( 'responsive-embeds' );

	register_nav_menus(
		array(
			'primary'         => __( 'Primary Navigation', 'grantrade' ),
			'footer_explore'  => __( 'Footer Explore Menu', 'grantrade' ),
			'footer_families' => __( 'Footer Stone Families Menu', 'grantrade' ),
		)
	);
}
add_action( 'after_setup_theme', 'grantrade_setup' );

/**
 * Register Stone Slabs CPT (`gt_slab`), Stone Families Taxonomy (`gt_family`),
 * and Yard Inquiries CPT (`gt_inquiry`).
 */
function grantrade_register_post_types() {
	register_taxonomy(
		'gt_family',
		array( 'gt_slab' ),
		array(
			'labels'            => array(
				'name'          => __( 'Stone Families', 'grantrade' ),
				'singular_name' => __( 'Stone Family', 'grantrade' ),
				'add_new_item'  => __( 'Add New Stone Family', 'grantrade' ),
			),
			'public'            => true,
			'hierarchical'      => true,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => 'stone-family' ),
		)
	);

	register_post_type(
		'gt_slab',
		array(
			'labels'        => array(
				'name'          => __( 'Stone Slabs', 'grantrade' ),
				'singular_name' => __( 'Stone Slab', 'grantrade' ),
				'add_new_item'  => __( 'Add New Stone Slab', 'grantrade' ),
				'edit_item'     => __( 'Edit Stone Slab', 'grantrade' ),
				'menu_name'     => __( 'Stone Slabs', 'grantrade' ),
			),
			'public'        => true,
			'has_archive'   => false,
			'menu_icon'     => 'dashicons-grid-view',
			'show_in_rest'  => true,
			'supports'      => array( 'title', 'editor', 'thumbnail', 'excerpt' ),
			'taxonomies'    => array( 'gt_family', 'post_tag' ),
			'rewrite'       => array( 'slug' => 'stone' ),
		)
	);

	register_post_type(
		'gt_inquiry',
		array(
			'labels'       => array(
				'name'          => __( 'Yard Inquiries', 'grantrade' ),
				'singular_name' => __( 'Yard Inquiry', 'grantrade' ),
				'menu_name'     => __( 'Yard Inquiries', 'grantrade' ),
			),
			'public'       => false,
			'show_ui'      => true,
			'menu_icon'    => 'dashicons-email-alt',
			'supports'     => array( 'title', 'editor' ),
			'capabilities' => array(
				'create_posts' => 'do_not_allow',
			),
			'map_meta_cap' => true,
		)
	);
}
add_action( 'init', 'grantrade_register_post_types' );

/**
 * Add Slab Specification Meta Box in WP Admin.
 */
function grantrade_add_slab_meta_boxes() {
	add_meta_box(
		'grantrade_slab_specs',
		__( 'Gran Trade Slab Specifications', 'grantrade' ),
		'grantrade_render_slab_meta_box',
		'gt_slab',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'grantrade_add_slab_meta_boxes' );

/**
 * Use the single-click Classic WordPress editor for Stone Slabs (`gt_slab`) so Publish
 * is always active without requiring focus inside Gutenberg's title iframe first.
 * (Pages and Posts still keep full Block Editor + Elementor support.)
 */
function grantrade_use_classic_editor_for_slabs( $use_block_editor, $post_type ) {
	if ( 'gt_slab' === $post_type ) {
		return false;
	}
	return $use_block_editor;
}
add_filter( 'use_block_editor_for_post_type', 'grantrade_use_classic_editor_for_slabs', 100, 2 );

function grantrade_slab_empty_title_placeholder( $placeholder, $post ) {
	if ( $post && 'gt_slab' === $post->post_type ) {
		return '';
	}
	return $placeholder;
}
add_filter( 'enter_title_here', 'grantrade_slab_empty_title_placeholder', 10, 2 );

function grantrade_slab_title_heading( $post ) {
	if ( $post && 'gt_slab' === $post->post_type ) {
		echo '<label for="title" style="display:block; font-weight:600; font-size:13px; margin:12px 0 4px; color:#1d2327;">' . esc_html__( 'Stone Name *', 'grantrade' ) . '</label>';
	}
}
add_action( 'edit_form_top', 'grantrade_slab_title_heading' );

function grantrade_render_slab_meta_box( $post ) {
	wp_nonce_field( 'grantrade_save_slab_meta', 'grantrade_slab_meta_nonce' );
	$thumb_id   = (int) get_post_thumbnail_id( $post->ID );
	$thumb_url  = $thumb_id ? (string) wp_get_attachment_image_url( $thumb_id, 'full' ) : '';
	$img1_meta  = trim( (string) get_post_meta( $post->ID, '_gt_image1', true ) );
	$fields     = array(
		'_gt_number'      => get_post_meta( $post->ID, '_gt_number', true ),
		'_gt_lot_number'  => get_post_meta( $post->ID, '_gt_lot_number', true ),
		'_gt_thickness'   => get_post_meta( $post->ID, '_gt_thickness', true ),
		'_gt_size'        => get_post_meta( $post->ID, '_gt_size', true ),
		'_gt_finish'      => get_post_meta( $post->ID, '_gt_finish', true ),
		'_gt_origin'      => get_post_meta( $post->ID, '_gt_origin', true ),
		'_gt_type'        => get_post_meta( $post->ID, '_gt_type', true ) ?: 'natural',
		'_gt_colors'      => get_post_meta( $post->ID, '_gt_colors', true ),
		'_gt_application' => get_post_meta( $post->ID, '_gt_application', true ),
		'_gt_image1'      => $thumb_url ? $thumb_url : $img1_meta,
		'_gt_image2'      => get_post_meta( $post->ID, '_gt_image2', true ),
	);
	$swatches = function_exists( 'grantrade_get_color_swatches' ) ? grantrade_get_color_swatches() : array();
	?>
	<div class="gt-meta-grid">
		<div class="gt-meta-field">
			<label for="gt_number"><?php esc_html_e( 'GT Inventory Number (Not used for Granite, Quartzite & Marble)', 'grantrade' ); ?></label>
			<input type="text" id="gt_number" name="_gt_number" value="<?php echo esc_attr( $fields['_gt_number'] ); ?>" />
		</div>
		<div class="gt-meta-field">
			<label for="gt_lot_number"><?php esc_html_e( 'Lot Number', 'grantrade' ); ?></label>
			<input type="text" id="gt_lot_number" name="_gt_lot_number" value="<?php echo esc_attr( $fields['_gt_lot_number'] ); ?>" />
		</div>
		<div class="gt-meta-field">
			<label for="gt_thickness"><?php esc_html_e( 'Thickness', 'grantrade' ); ?></label>
			<input type="text" id="gt_thickness" name="_gt_thickness" value="<?php echo esc_attr( $fields['_gt_thickness'] ); ?>" />
		</div>
		<div class="gt-meta-field">
			<label for="gt_size"><?php esc_html_e( 'Net Slab Dimensions', 'grantrade' ); ?></label>
			<input type="text" id="gt_size" name="_gt_size" value="<?php echo esc_attr( $fields['_gt_size'] ); ?>" />
		</div>
		<div class="gt-meta-field">
			<label for="gt_finish"><?php esc_html_e( 'Surface Finish', 'grantrade' ); ?></label>
			<input type="text" id="gt_finish" name="_gt_finish" value="<?php echo esc_attr( $fields['_gt_finish'] ); ?>" />
		</div>
		<div class="gt-meta-field">
			<label for="gt_origin"><?php esc_html_e( 'Quarry Origin', 'grantrade' ); ?></label>
			<input type="text" id="gt_origin" name="_gt_origin" value="<?php echo esc_attr( $fields['_gt_origin'] ); ?>" />
		</div>
		<div class="gt-meta-field">
			<label for="gt_type"><?php esc_html_e( 'Material Type', 'grantrade' ); ?></label>
			<select id="gt_type" name="_gt_type">
				<option value="natural" <?php selected( $fields['_gt_type'], 'natural' ); ?>><?php esc_html_e( 'Natural Stone', 'grantrade' ); ?></option>
				<option value="engineered" <?php selected( $fields['_gt_type'], 'engineered' ); ?>><?php esc_html_e( 'Engineered Quartz', 'grantrade' ); ?></option>
			</select>
		</div>
		<div class="gt-meta-field">
			<label for="gt_application"><?php esc_html_e( 'Ideal Applications (dot-separated)', 'grantrade' ); ?></label>
			<input type="text" id="gt_application" name="_gt_application" value="<?php echo esc_attr( $fields['_gt_application'] ); ?>" />
		</div>
		<div class="gt-meta-field gt-meta-full">
			<label for="gt_colors"><?php esc_html_e( 'Color Tags (comma-separated, click any chip below, or add your own custom color)', 'grantrade' ); ?></label>
			<input type="text" id="gt_colors" name="_gt_colors" value="<?php echo esc_attr( $fields['_gt_colors'] ); ?>" />
			<div style="display:flex; gap:8px; align-items:center; flex-wrap:wrap; margin-top:8px;">
				<input type="text" id="gtCustomColorName" aria-label="<?php esc_attr_e( 'Custom color tag name', 'grantrade' ); ?>" style="flex:1; min-width:220px; max-width:320px;" />
				<input type="color" id="gtCustomColorHex" value="#8b929a" title="<?php esc_attr_e( 'Pick badge dot color', 'grantrade' ); ?>" style="width:38px; height:32px; padding:2px; border:1px solid #8c8f94; border-radius:4px; cursor:pointer;" />
				<button type="button" class="button button-secondary" id="gtAddCustomColorBtn"><?php esc_html_e( '+ Add Color Tag', 'grantrade' ); ?></button>
			</div>
			<input type="hidden" id="gtCustomColorMap" name="_gt_custom_color_map" value="" />
			<?php if ( ! empty( $swatches ) ) : ?>
				<div class="gt-preset-chips" data-gt-color-chips>
					<?php foreach ( $swatches as $token => $info ) : ?>
						<button type="button" class="gt-preset-chip" data-gt-color-preset="<?php echo esc_attr( $token ); ?>">
							<span class="gt-color-dot" style="background:<?php echo esc_attr( $info['hex'] ); ?>;"></span>
							<span><?php echo esc_html( $info['label'] ); ?></span>
						</button>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<div>
			<?php
			grantrade_render_media_picker_field(
				array(
					'id'          => 'gt_image1',
					'name'        => '_gt_image1',
					'id_name'     => '_gt_image1_id',
					'att_id'      => $thumb_id ? (string) $thumb_id : '',
					'label'       => __( 'Picture 1 — Full Slab Upright Photo', 'grantrade' ),
					'value'       => $fields['_gt_image1'],
					'placeholder' => '',
					'hint'        => __( 'Automatically syncs as the main Featured Image on Collections & Slab Detail.', 'grantrade' ),
				)
			);
			?>
		</div>
		<div>
			<?php
			grantrade_render_media_picker_field(
				array(
					'id'          => 'gt_image2',
					'name'        => '_gt_image2',
					'label'       => __( 'Picture 2 — Close-Up Vein & Surface Detail', 'grantrade' ),
					'value'       => $fields['_gt_image2'],
					'placeholder' => '',
					'hint'        => __( 'Optional second photo shown in the interactive Zoom & Picture 2 switcher.', 'grantrade' ),
				)
			);
			?>
		</div>
	</div>
	<?php
}

function grantrade_save_slab_meta( $post_id ) {
	if ( ! isset( $_POST['grantrade_slab_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['grantrade_slab_meta_nonce'] ) ), 'grantrade_save_slab_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_post', $post_id ) ) {
		return;
	}

	$text_keys = array( '_gt_number', '_gt_lot_number', '_gt_thickness', '_gt_size', '_gt_finish', '_gt_origin', '_gt_type', '_gt_colors', '_gt_application' );
	foreach ( $text_keys as $key ) {
		if ( isset( $_POST[ $key ] ) ) {
			update_post_meta( $post_id, $key, sanitize_text_field( wp_unslash( $_POST[ $key ] ) ) );
		}
	}
	if ( isset( $_POST['_gt_image1'] ) ) {
		$img1_url = esc_url_raw( trim( (string) wp_unslash( $_POST['_gt_image1'] ) ) );
		$img1_id  = isset( $_POST['_gt_image1_id'] ) ? absint( $_POST['_gt_image1_id'] ) : 0;
		update_post_meta( $post_id, '_gt_image1', $img1_url );
		if ( ! $img1_id && $img1_url ) {
			$img1_id = (int) attachment_url_to_postid( $img1_url );
		}
		if ( $img1_id > 0 ) {
			set_post_thumbnail( $post_id, $img1_id );
		} elseif ( '' === $img1_url && ( ! isset( $_POST['_thumbnail_id'] ) || '-1' === (string) $_POST['_thumbnail_id'] || '' === (string) $_POST['_thumbnail_id'] ) ) {
			delete_post_thumbnail( $post_id );
		}
	}
	if ( isset( $_POST['_gt_image2'] ) ) {
		update_post_meta( $post_id, '_gt_image2', esc_url_raw( wp_unslash( $_POST['_gt_image2'] ) ) );
	}
	if ( function_exists( 'grantrade_register_custom_color_swatch' ) ) {
		$color_map_raw = isset( $_POST['_gt_custom_color_map'] ) ? wp_unslash( $_POST['_gt_custom_color_map'] ) : ''; // phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
		$color_map     = json_decode( (string) $color_map_raw, true );
		$color_map     = is_array( $color_map ) ? $color_map : array();
		if ( ! empty( $_POST['_gt_colors'] ) ) {
			$tokens = array_values( array_filter( array_map( 'trim', preg_split( '/[,;|\/]+/', strtolower( sanitize_text_field( wp_unslash( $_POST['_gt_colors'] ) ) ) ) ) ) );
			foreach ( $tokens as $tok ) {
				grantrade_register_custom_color_swatch( $tok, $color_map[ $tok ] ?? '' );
			}
		}
	}
	update_post_meta( $post_id, '_gt_in_stock', '1' );
}
add_action( 'save_post_gt_slab', 'grantrade_save_slab_meta' );

/**
 * Convert published gt_slab WordPress posts into catalog JSON objects.
 */
function grantrade_get_wp_stones() {
	$posts = get_posts(
		array(
			'post_type'      => 'gt_slab',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'date',
			'order'          => 'DESC',
		)
	);

	if ( empty( $posts ) ) {
		return array();
	}

	$family_labels = array(
		'quartzite' => 'Quartzite',
		'quartz'    => 'Quartz',
		'granite'   => 'Granite',
		'marble'    => 'Marble',
		'monuments' => 'Monuments',
		'soapstone' => 'Soapstone',
		'semi'      => 'Semi Precious',
		'tile'      => 'Tiles',
	);

	$stones = array();
	foreach ( $posts as $post ) {
		$terms      = get_the_terms( $post->ID, 'gt_family' );
		$cat_slug   = ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? $terms[0]->slug : 'quartzite';
		$cat_label  = $family_labels[ $cat_slug ] ?? ( ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? $terms[0]->name : 'Natural Stone' );
		$type_val   = get_post_meta( $post->ID, '_gt_type', true ) ?: ( 'quartz' === $cat_slug ? 'engineered' : 'natural' );
		$colors_raw = get_post_meta( $post->ID, '_gt_colors', true );
		$colors     = '' !== trim( (string) $colors_raw )
			? array_values( array_filter( array_map( 'trim', preg_split( '/[,;|\/]+/', strtolower( $colors_raw ) ) ) ) )
			: array();

		$tag_terms  = get_the_terms( $post->ID, 'post_tag' );
		$tag_names  = array();
		if ( ! empty( $tag_terms ) && ! is_wp_error( $tag_terms ) ) {
			foreach ( $tag_terms as $tt ) {
				$tag_names[] = $tt->name;
			}
		}

		$img1       = get_the_post_thumbnail_url( $post->ID, 'large' );
		if ( ! $img1 ) {
			$img1 = trim( (string) get_post_meta( $post->ID, '_gt_image1', true ) );
		}
		if ( ! $img1 ) {
			$img1 = get_template_directory_uri() . '/assets/images/stone-types/' . sanitize_file_name( $cat_slug ) . '.jpg';
		}
		$img2 = get_post_meta( $post->ID, '_gt_image2', true ) ?: $img1;

		$gt_number = in_array( $cat_slug, array( 'granite', 'quartzite', 'marble' ), true )
			? ''
			: (string) get_post_meta( $post->ID, '_gt_number', true );

		$raw_excerpt = wp_strip_all_tags( (string) $post->post_excerpt );
		$raw_content = wp_strip_all_tags( strip_shortcodes( (string) $post->post_content ) );
		$combined_desc = trim( preg_replace( '/\s+/', ' ', $raw_excerpt ? $raw_excerpt : $raw_content ) );

		$stones[] = array(
			'id'            => $post->post_name,
			'name'          => get_the_title( $post->ID ),
			'gtNumber'      => $gt_number,
			'lotNumber'     => trim( (string) get_post_meta( $post->ID, '_gt_lot_number', true ) ),
			'thickness'     => trim( (string) get_post_meta( $post->ID, '_gt_thickness', true ) ),
			'size'          => trim( (string) get_post_meta( $post->ID, '_gt_size', true ) ),
			'category'      => $cat_slug,
			'categoryLabel' => $cat_label,
			'type'          => $type_val,
			'typeLabel'     => 'engineered' === $type_val ? 'Engineered Quartz' : 'Natural Stone',
			'finish'        => trim( (string) get_post_meta( $post->ID, '_gt_finish', true ) ),
			'origin'        => trim( (string) get_post_meta( $post->ID, '_gt_origin', true ) ),
			'colors'        => $colors,
			'tags'          => $tag_names,
			'application'   => trim( (string) get_post_meta( $post->ID, '_gt_application', true ) ),
			'description'   => $combined_desc,
			'excerpt'       => trim( preg_replace( '/\s+/', ' ', $raw_excerpt ) ),
			'content'       => trim( preg_replace( '/\s+/', ' ', $raw_content ) ),
			'image1'        => $img1,
			'image2'        => $img2,
			'inStock'       => true,
			'permalink'     => get_permalink( $post->ID ),
		);
	}

	return $stones;
}

/**
 * Live JSON endpoint returning WordPress-uploaded gt_slab catalog items for search & filter refresh.
 */
function grantrade_ajax_get_catalog() {
	$catalog_mode = grantrade_get_option( 'gt_catalog_mode', 'wp_only' );
	wp_send_json_success(
		array(
			'replaceBuiltinCatalog' => ( 'wp_only' === $catalog_mode ),
			'wpStones'              => grantrade_get_wp_stones(),
		)
	);
}
add_action( 'wp_ajax_grantrade_get_catalog', 'grantrade_ajax_get_catalog' );
add_action( 'wp_ajax_nopriv_grantrade_get_catalog', 'grantrade_ajax_get_catalog' );

/**
 * Canonical stone family term labels used across WordPress taxonomies and JSON output.
 */
function grantrade_get_canonical_family_labels() {
	return array(
		'quartzite' => 'Quartzite',
		'quartz'    => 'Quartz',
		'granite'   => 'Granite',
		'marble'    => 'Marble',
		'monuments' => 'Monuments',
		'soapstone' => 'Soapstone',
		'semi'      => 'Semi Precious',
		'tile'      => 'Tiles',
	);
}

/**
 * Ensure existing `gt_family` terms carry the canonical display names after theme updates.
 */
function grantrade_sync_family_term_labels() {
	$target_ver = '1.0.6';
	if ( get_option( 'grantrade_family_labels_version' ) === $target_ver ) {
		return;
	}
	if ( ! taxonomy_exists( 'gt_family' ) ) {
		return;
	}

	foreach ( grantrade_get_canonical_family_labels() as $slug => $label ) {
		$term = get_term_by( 'slug', $slug, 'gt_family' );
		if ( $term && ! is_wp_error( $term ) ) {
			if ( $term->name !== $label ) {
				wp_update_term( (int) $term->term_id, 'gt_family', array( 'name' => $label ) );
			}
		} else {
			wp_insert_term( $label, 'gt_family', array( 'slug' => $slug ) );
		}
	}

	update_option( 'grantrade_family_labels_version', $target_ver );
}
add_action( 'init', 'grantrade_sync_family_term_labels', 25 );

/**
 * Provision core Gran Trade pages, front page, and primary menu on theme activation.
 */
function grantrade_on_activate() {
	$default_families = grantrade_get_canonical_family_labels();
	foreach ( $default_families as $slug => $label ) {
		$existing = get_term_by( 'slug', $slug, 'gt_family' );
		if ( $existing && ! is_wp_error( $existing ) ) {
			if ( $existing->name !== $label ) {
				wp_update_term( (int) $existing->term_id, 'gt_family', array( 'name' => $label ) );
			}
		} else {
			wp_insert_term( $label, 'gt_family', array( 'slug' => $slug ) );
		}
	}
	update_option( 'grantrade_family_labels_version', '1.0.6' );

	$pages_to_ensure = array(
		'home'        => array(
			'title'    => 'Home',
			'template' => 'default',
		),
		'about'       => array(
			'title'    => 'About Us',
			'template' => 'page-about.php',
		),
		'collections' => array(
			'title'    => 'Collections',
			'template' => 'page-collections.php',
		),
		'showroom'    => array(
			'title'    => 'Showroom & Yard',
			'template' => 'page-showroom.php',
		),
		'contact'     => array(
			'title'    => 'Contact Us',
			'template' => 'page-contact.php',
		),
		'slab'        => array(
			'title'    => 'Slab Inspection',
			'template' => 'page-slab.php',
		),
	);

	$created_ids = array();
	foreach ( $pages_to_ensure as $slug => $info ) {
		$existing = get_page_by_path( $slug );
		if ( ! $existing && 'default' !== $info['template'] ) {
			$by_tpl = get_pages(
				array(
					'meta_key'   => '_wp_page_template',
					'meta_value' => $info['template'],
					'number'     => 1,
				)
			);
			if ( ! empty( $by_tpl ) ) {
				$existing = $by_tpl[0];
			}
		}

		if ( $existing ) {
			$created_ids[ $slug ] = $existing->ID;
		} else {
			$page_id = wp_insert_post(
				array(
					'post_title'  => $info['title'],
					'post_name'   => $slug,
					'post_status' => 'publish',
					'post_type'   => 'page',
				)
			);
			if ( $page_id && ! is_wp_error( $page_id ) ) {
				if ( 'default' !== $info['template'] ) {
					update_post_meta( $page_id, '_wp_page_template', $info['template'] );
				}
				$created_ids[ $slug ] = $page_id;
			}
		}
	}

	if ( ! empty( $created_ids['home'] ) && 'page' !== get_option( 'show_on_front' ) ) {
		update_option( 'show_on_front', 'page' );
		update_option( 'page_on_front', (int) $created_ids['home'] );
	}

	// Create primary navigation menu if none is assigned yet.
	$locations = get_nav_menu_locations();
	if ( empty( $locations['primary'] ) ) {
		$menu_name = 'Gran Trade Primary';
		$menu_obj  = wp_get_nav_menu_object( $menu_name );
		$menu_id   = $menu_obj ? $menu_obj->term_id : wp_create_nav_menu( $menu_name );
		if ( ! is_wp_error( $menu_id ) ) {
			$items = wp_get_nav_menu_items( $menu_id );
			if ( empty( $items ) ) {
				foreach ( array( 'home', 'about', 'collections', 'showroom', 'contact' ) as $slug ) {
					if ( ! empty( $created_ids[ $slug ] ) ) {
						wp_update_nav_menu_item(
							$menu_id,
							0,
							array(
								'menu-item-object-id' => $created_ids[ $slug ],
								'menu-item-object'    => 'page',
								'menu-item-type'      => 'post_type',
								'menu-item-status'    => 'publish',
							)
						);
					}
				}
			}
			$locations            = is_array( $locations ) ? $locations : array();
			$locations['primary'] = (int) $menu_id;
			set_theme_mod( 'nav_menu_locations', $locations );
		}
	}

	flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'grantrade_on_activate' );

