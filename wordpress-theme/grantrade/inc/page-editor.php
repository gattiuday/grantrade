<?php
/**
 * WordPress Page Editor Meta Boxes, Media Pickers & Template Helpers
 *
 * Allows editing page copy, headlines, metrics, CTAs, and pictures directly
 * from `Pages` (`wp-admin/edit.php?post_type=page`) while preserving the
 * custom Gran Trade layout and rendering Gutenberg / Elementor block content.
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Shared media picker field renderer (WordPress Media Library + URL input + preview).
 *
 * @param array $args Field configuration.
 */
function grantrade_render_media_picker_field( $args ) {
	$id          = isset( $args['id'] ) ? (string) $args['id'] : 'gt_media_field';
	$name        = isset( $args['name'] ) ? (string) $args['name'] : $id;
	$id_name     = isset( $args['id_name'] ) ? (string) $args['id_name'] : '';
	$att_id      = isset( $args['att_id'] ) ? (string) $args['att_id'] : '';
	$label       = isset( $args['label'] ) ? (string) $args['label'] : __( 'Picture', 'grantrade' );
	$value       = isset( $args['value'] ) ? (string) $args['value'] : '';
	$placeholder = isset( $args['placeholder'] ) ? (string) $args['placeholder'] : 'https://... or upload picture';
	$hint        = isset( $args['hint'] ) ? (string) $args['hint'] : '';
	$preview_src = $value;
	if ( $preview_src && 0 !== strpos( $preview_src, 'http' ) && 0 !== strpos( $preview_src, '/' ) ) {
		$preview_src = get_template_directory_uri() . '/' . ltrim( $preview_src, '/' );
	}
	?>
	<div class="gt-meta-field" data-gt-media-field>
		<label for="<?php echo esc_attr( $id ); ?>"><?php echo esc_html( $label ); ?></label>
		<?php if ( $id_name ) : ?>
			<input type="hidden" name="<?php echo esc_attr( $id_name ); ?>" value="<?php echo esc_attr( $att_id ); ?>" data-gt-media-id />
		<?php endif; ?>
		<div class="gt-media-row">
			<input
				type="text"
				id="<?php echo esc_attr( $id ); ?>"
				name="<?php echo esc_attr( $name ); ?>"
				value="<?php echo esc_attr( $value ); ?>"
				placeholder="<?php echo esc_attr( $placeholder ); ?>"
				data-gt-media-input
			/>
			<button
				type="button"
				class="button button-secondary"
				data-gt-media-upload
				data-title="<?php echo esc_attr( $label ); ?>"
				data-button="<?php esc_attr_e( 'Use Selected Picture', 'grantrade' ); ?>"
			>
				<?php esc_html_e( 'Upload / Choose Picture', 'grantrade' ); ?>
			</button>
			<button type="button" class="button-link delete" data-gt-media-clear>
				<?php esc_html_e( 'Clear', 'grantrade' ); ?>
			</button>
		</div>
		<div class="gt-media-preview <?php echo empty( $preview_src ) ? 'is-empty' : ''; ?>">
			<img src="<?php echo esc_url( $preview_src ); ?>" alt="" />
			<?php if ( $hint ) : ?>
				<span class="gt-meta-hint"><?php echo esc_html( $hint ); ?></span>
			<?php endif; ?>
		</div>
	</div>
	<?php
}

/**
 * Retrieve a trimmed page meta value or fall back cleanly to default text.
 */
function grantrade_get_page_field( $post_id, $meta_key, $default = '' ) {
	if ( ! $post_id ) {
		return $default;
	}
	$val = get_post_meta( (int) $post_id, $meta_key, true );
	if ( is_string( $val ) && '' !== trim( $val ) ) {
		return $val;
	}
	return $default;
}

/**
 * Resolve a page image meta field (attachment ID, full URL, or theme asset path) with fallback.
 */
function grantrade_get_page_image_url( $post_id, $meta_key, $fallback_rel_asset ) {
	$fallback = get_template_directory_uri() . '/' . ltrim( $fallback_rel_asset, '/' );
	if ( ! $post_id ) {
		return $fallback;
	}

	$raw = trim( (string) get_post_meta( (int) $post_id, $meta_key, true ) );
	if ( '' === $raw ) {
		return $fallback;
	}

	if ( ctype_digit( $raw ) ) {
		$att_url = wp_get_attachment_image_url( (int) $raw, 'full' );
		return $att_url ? $att_url : $fallback;
	}

	if ( 0 === strpos( $raw, 'http://' ) || 0 === strpos( $raw, 'https://' ) || 0 === strpos( $raw, '/' ) ) {
		return $raw;
	}

	return get_template_directory_uri() . '/' . ltrim( $raw, '/' );
}

/**
 * Detect whether Elementor editor/preview is active or this post uses Elementor.
 */
function grantrade_is_elementor_mode( $post_id = 0 ) {
	if ( isset( $_GET['elementor-preview'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return true;
	}
	if ( class_exists( '\Elementor\Plugin' ) ) {
		$plugin = \Elementor\Plugin::$instance;
		if ( isset( $plugin->preview ) && $plugin->preview->is_preview_mode() ) {
			return true;
		}
		if ( isset( $plugin->editor ) && $plugin->editor->is_edit_mode() ) {
			return true;
		}
		if ( $post_id && isset( $plugin->documents ) ) {
			$doc = $plugin->documents->get( (int) $post_id );
			if ( $doc && method_exists( $doc, 'is_built_with_elementor' ) && $doc->is_built_with_elementor() ) {
				return true;
			}
		}
	}
	return false;
}

/**
 * Render an Elementor-only or Block-Editor-only page when replace-layout / Elementor Canvas is enabled.
 *
 * @return bool True if handled and caller template should return immediately.
 */
function grantrade_maybe_render_elementor_only() {
	$post_id = (int) get_queried_object_id();
	if ( ! $post_id ) {
		return false;
	}
	$tpl          = get_page_template_slug( $post_id );
	$replace_flag = '1' === get_post_meta( $post_id, '_gt_page_replace_layout', true );
	$elementor_tpl = in_array( $tpl, array( 'elementor_canvas', 'elementor_header_footer' ), true );

	if ( ! $replace_flag && ! $elementor_tpl ) {
		return false;
	}

	if ( 'elementor_canvas' !== $tpl ) {
		get_header();
	} else {
		?><!DOCTYPE html>
		<html <?php language_attributes(); ?>>
		<head>
			<meta charset="<?php bloginfo( 'charset' ); ?>" />
			<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
			<?php wp_head(); ?>
		</head>
		<body <?php body_class(); ?>>
		<?php wp_body_open(); ?>
		<?php
	}

	echo '<main id="mainContent" class="gt-elementor-content">';
	while ( have_posts() ) {
		the_post();
		the_content();
	}
	echo '</main>';

	if ( 'elementor_canvas' !== $tpl ) {
		get_footer();
	} else {
		wp_footer();
		echo '</body></html>';
	}
	return true;
}

/**
 * Render WordPress Block Editor / Elementor page content if non-empty or Elementor active.
 */
function grantrade_render_page_extra_content() {
	while ( have_posts() ) {
		the_post();
		$post_id     = get_the_ID();
		$raw         = trim( (string) get_post_field( 'post_content', $post_id ) );
		$is_el       = grantrade_is_elementor_mode( $post_id );
		if ( '' !== $raw || $is_el ) {
			if ( $is_el ) {
				echo '<section class="gt-elementor-content">';
				the_content();
				echo '</section>';
			} else {
				?>
				<section class="section-tight gt-page-editor-blocks">
					<div class="container wp-content">
						<?php the_content(); ?>
					</div>
				</section>
				<?php
			}
		}
	}
}

/**
 * Detect logical Gran Trade page role (`home`, `about`, `collections`, `showroom`, `contact`, `slab`, or `standard`).
 */
function grantrade_get_page_role( $post_id ) {
	$post_id = (int) $post_id;
	if ( $post_id > 0 && (int) get_option( 'page_on_front' ) === $post_id ) {
		return 'home';
	}

	$template = get_page_template_slug( $post_id );
	$map      = array(
		'page-about.php'       => 'about',
		'page-collections.php' => 'collections',
		'page-showroom.php'    => 'showroom',
		'page-contact.php'     => 'contact',
		'page-slab.php'        => 'slab',
	);
	if ( isset( $map[ $template ] ) ) {
		return $map[ $template ];
	}

	$slug = get_post_field( 'post_name', $post_id );
	if ( in_array( $slug, array( 'home', 'about', 'collections', 'showroom', 'contact', 'slab' ), true ) ) {
		return $slug;
	}

	return 'standard';
}

/**
 * Show a Gran Trade Template / Role column on `wp-admin/edit.php?post_type=page`.
 */
function grantrade_page_admin_columns( $columns ) {
	$updated = array();
	foreach ( $columns as $key => $label ) {
		$updated[ $key ] = $label;
		if ( 'title' === $key ) {
			$updated['gt_page_role'] = __( 'Gran Trade Template', 'grantrade' );
		}
	}
	return $updated;
}
add_filter( 'manage_page_posts_columns', 'grantrade_page_admin_columns' );

function grantrade_render_page_admin_column( $column, $post_id ) {
	if ( 'gt_page_role' !== $column ) {
		return;
	}
	$labels = array(
		'home'        => __( 'Front Page (Home)', 'grantrade' ),
		'about'       => __( 'About Us Layout', 'grantrade' ),
		'collections' => __( 'Collections Catalog', 'grantrade' ),
		'showroom'    => __( 'Showroom & Yard Gallery', 'grantrade' ),
		'contact'     => __( 'Contact & Hours + Inquiry Form', 'grantrade' ),
		'slab'        => __( 'Slab Inspector Detail', 'grantrade' ),
		'standard'    => __( 'Block Editor Page', 'grantrade' ),
	);
	$role   = grantrade_get_page_role( $post_id );
	$label  = isset( $labels[ $role ] ) ? $labels[ $role ] : $labels['standard'];
	echo '<span class="gt-badge gt-badge-role">' . esc_html( $label ) . '</span>';
}
add_action( 'manage_page_posts_custom_column', 'grantrade_render_page_admin_column', 10, 2 );

/**
 * Schema of editable fields shown inside the Page Editor meta box by page role.
 */
function grantrade_get_page_fields_schema( $role ) {
	$common = array(
		'_gt_page_eyebrow' => array(
			'label'   => __( 'Top Eyebrow / Badge Text', 'grantrade' ),
			'type'    => 'text',
			'default' => '',
		),
		'_gt_page_heading' => array(
			'label'   => __( 'Main Page Headline (H1 Override)', 'grantrade' ),
			'type'    => 'text',
			'default' => '',
		),
		'_gt_page_lead'    => array(
			'label'   => __( 'Intro / Lead Paragraph', 'grantrade' ),
			'type'    => 'textarea',
			'default' => '',
		),
	);

	if ( 'home' === $role ) {
		return array_merge(
			$common,
			array(
				'_gt_page_image1'         => array(
					'label' => __( 'Hero Background Picture', 'grantrade' ),
					'type'  => 'media',
					'hint'  => __( 'Leave blank to use default warehouse granite slab background.', 'grantrade' ),
				),
				'_gt_page_cta_label'      => array( 'label' => __( 'Primary Button Text', 'grantrade' ), 'type' => 'text', 'default' => 'Browse the Collections' ),
				'_gt_page_cta_url'        => array( 'label' => __( 'Primary Button Link (optional URL)', 'grantrade' ), 'type' => 'url', 'default' => '' ),
				'_gt_page_cta2_label'     => array( 'label' => __( 'Secondary Button Text', 'grantrade' ), 'type' => 'text', 'default' => 'Plan a Warehouse Visit' ),
				'_gt_page_cta2_url'       => array( 'label' => __( 'Secondary Button Link (optional URL)', 'grantrade' ), 'type' => 'url', 'default' => '' ),
				'_gt_metric1_val'         => array( 'label' => __( 'Hero Metric 1 Value', 'grantrade' ), 'type' => 'text', 'default' => '20+' ),
				'_gt_metric1_lbl'         => array( 'label' => __( 'Hero Metric 1 Label', 'grantrade' ), 'type' => 'text', 'default' => 'Years importing stone' ),
				'_gt_metric2_val'         => array( 'label' => __( 'Hero Metric 2 Value', 'grantrade' ), 'type' => 'text', 'default' => '1,000+' ),
				'_gt_metric2_lbl'         => array( 'label' => __( 'Hero Metric 2 Label', 'grantrade' ), 'type' => 'text', 'default' => 'Trade customers served' ),
				'_gt_tax_eyebrow'         => array( 'label' => __( 'Catalog Section Eyebrow', 'grantrade' ), 'type' => 'text', 'default' => 'Wholesale Material Taxonomy' ),
				'_gt_tax_heading'         => array( 'label' => __( 'Catalog Section Heading', 'grantrade' ), 'type' => 'text', 'default' => 'The Types of Stone We Carry' ),
				'_gt_tax_lead'            => array( 'label' => __( 'Catalog Section Intro', 'grantrade' ), 'type' => 'textarea', 'default' => '' ),
				'_gt_page_image2'         => array( 'label' => __( 'Fabrication Feature Picture ("Where our stone ends up")', 'grantrade' ), 'type' => 'media', 'hint' => __( 'Defaults to Aquamarine Slab installation photo.', 'grantrade' ) ),
				'_gt_applied_eyebrow'     => array( 'label' => __( 'Applied Section Eyebrow', 'grantrade' ), 'type' => 'text', 'default' => 'From Slab to Space' ),
				'_gt_applied_heading'     => array( 'label' => __( 'Applied Section Heading', 'grantrade' ), 'type' => 'text', 'default' => 'Where our stone ends up' ),
				'_gt_applied_lead'        => array( 'label' => __( 'Applied Section Copy', 'grantrade' ), 'type' => 'textarea', 'default' => '' ),
				'_gt_banner_eyebrow'      => array( 'label' => __( 'Bottom Yard Banner Eyebrow', 'grantrade' ), 'type' => 'text', 'default' => 'Visit Carlstadt, NJ' ),
				'_gt_banner_heading'      => array( 'label' => __( 'Bottom Yard Banner Heading', 'grantrade' ), 'type' => 'text', 'default' => 'Come walk the slab yard' ),
				'_gt_banner_text'         => array( 'label' => __( 'Bottom Yard Banner Text', 'grantrade' ), 'type' => 'textarea', 'default' => '' ),
			)
		);
	}

	if ( 'about' === $role ) {
		return array_merge(
			$common,
			array(
				'_gt_metric1_val'     => array( 'label' => __( 'Stat 1 Value', 'grantrade' ), 'type' => 'text', 'default' => '2003' ),
				'_gt_metric1_lbl'     => array( 'label' => __( 'Stat 1 Label', 'grantrade' ), 'type' => 'text', 'default' => 'Year Established' ),
				'_gt_metric2_val'     => array( 'label' => __( 'Stat 2 Value', 'grantrade' ), 'type' => 'text', 'default' => '20+' ),
				'_gt_metric2_lbl'     => array( 'label' => __( 'Stat 2 Label', 'grantrade' ), 'type' => 'text', 'default' => 'Years in Business' ),
				'_gt_metric3_val'     => array( 'label' => __( 'Stat 3 Value', 'grantrade' ), 'type' => 'text', 'default' => '1,000+' ),
				'_gt_metric3_lbl'     => array( 'label' => __( 'Stat 3 Label', 'grantrade' ), 'type' => 'text', 'default' => 'Fabricators & Partners' ),
				'_gt_sec2_eyebrow'    => array( 'label' => __( 'Story Eyebrow', 'grantrade' ), 'type' => 'text', 'default' => 'The Gran Trade Story' ),
				'_gt_sec2_heading'    => array( 'label' => __( 'Story Section Heading', 'grantrade' ), 'type' => 'text', 'default' => 'Two decades of stone expertise in Carlstadt, New Jersey' ),
				'_gt_page_image1'     => array( 'label' => __( 'About Facility Inspection Picture', 'grantrade' ), 'type' => 'media', 'hint' => __( 'Shown next to the Gran Trade Story section.', 'grantrade' ) ),
			)
		);
	}

	if ( 'showroom' === $role ) {
		return array_merge(
			$common,
			array(
				'_gt_page_image1' => array( 'label' => __( 'Showroom Main Tall Picture (Left)', 'grantrade' ), 'type' => 'media' ),
				'_gt_page_image2' => array( 'label' => __( 'Gallery Grid Picture 2', 'grantrade' ), 'type' => 'media' ),
				'_gt_page_image3' => array( 'label' => __( 'Gallery Grid Picture 3', 'grantrade' ), 'type' => 'media' ),
				'_gt_page_image4' => array( 'label' => __( 'Gallery Grid Picture 4', 'grantrade' ), 'type' => 'media' ),
				'_gt_page_image5' => array( 'label' => __( 'Gallery Grid Picture 5', 'grantrade' ), 'type' => 'media' ),
			)
		);
	}

	if ( 'collections' === $role ) {
		return array(
			'_gt_page_eyebrow'   => array( 'label' => __( 'Optional Catalog Eyebrow Above Search', 'grantrade' ), 'type' => 'text', 'default' => '' ),
			'_gt_page_heading'   => array( 'label' => __( 'Optional Visible Catalog Heading', 'grantrade' ), 'type' => 'text', 'default' => '' ),
			'_gt_page_lead'      => array( 'label' => __( 'Optional Intro Copy Above Search', 'grantrade' ), 'type' => 'textarea', 'default' => '' ),
			'_gt_page_search_ph' => array( 'label' => __( 'Search Box Placeholder Text', 'grantrade' ), 'type' => 'text', 'default' => 'Filter by stone variety, GT reference, lot code, quarry origin, 3 cm, or custom color tag...' ),
		);
	}

	if ( 'contact' === $role ) {
		return array_merge(
			$common,
			array(
				'_gt_form_heading'      => array( 'label' => __( 'Inquiry Form Heading', 'grantrade' ), 'type' => 'text', 'default' => 'Send a warehouse inquiry' ),
				'_gt_form_lead'         => array( 'label' => __( 'Inquiry Form Intro Copy', 'grantrade' ), 'type' => 'textarea', 'default' => 'Need to confirm slab lot numbers, place a trade bundle hold, or arrange crane staging for your client walkthrough? Reach our warehouse team directly.' ),
				'_gt_page_maps_url'     => array( 'label' => __( 'Google Maps Directions Link', 'grantrade' ), 'type' => 'url', 'default' => 'https://maps.google.com/?q=178+Commerce+Road+Carlstadt+NJ+07072' ),
				'_gt_wpforms_id'        => array( 'label' => __( 'WPForms Form ID (optional — leaves built-in form active when blank)', 'grantrade' ), 'type' => 'text', 'default' => '' ),
			)
		);
	}

	return $common;
}

/**
 * Register Page Editor Meta Box on WordPress Pages.
 */
function grantrade_add_page_meta_box() {
	add_meta_box(
		'grantrade_page_editor',
		__( 'Gran Trade Page Sections & Pictures', 'grantrade' ),
		'grantrade_render_page_meta_box',
		'page',
		'normal',
		'high'
	);
}
add_action( 'add_meta_boxes', 'grantrade_add_page_meta_box' );

function grantrade_render_page_meta_box( $post ) {
	wp_nonce_field( 'grantrade_save_page_meta', 'grantrade_page_meta_nonce' );
	$role           = grantrade_get_page_role( $post->ID );
	$schema         = grantrade_get_page_fields_schema( $role );
	$replace_layout = '1' === get_post_meta( $post->ID, '_gt_page_replace_layout', true );
	$elementor_url  = admin_url( 'post.php?post=' . (int) $post->ID . '&action=elementor' );
	?>
	<div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; margin-bottom:14px;">
		<p class="description" style="margin:0; flex:1 1 360px;">
			<?php
			printf(
				/* translators: %s: template role slug */
				esc_html__( 'Edit the sections and pictures for this page (%s). Leave any field blank to keep the built-in default text/image. You can also add blocks in the editor above or edit visually with Elementor.', 'grantrade' ),
				'<strong>' . esc_html( strtoupper( $role ) ) . '</strong>'
			);
			?>
		</p>
		<?php if ( defined( 'ELEMENTOR_VERSION' ) ) : ?>
			<a href="<?php echo esc_url( $elementor_url ); ?>" class="button button-primary">
				<?php esc_html_e( 'Edit with Elementor', 'grantrade' ); ?>
			</a>
		<?php endif; ?>
	</div>
	<p style="margin:0 0 14px; padding:10px 12px; background:#f6f7f7; border:1px solid #dcdcde; border-radius:4px;">
		<label>
			<input type="checkbox" name="_gt_page_replace_layout" value="1" <?php checked( $replace_layout ); ?> />
			<strong><?php esc_html_e( 'Use Elementor / Block Editor Layout Only', 'grantrade' ); ?></strong>
			— <span class="description"><?php esc_html_e( 'Check this if you designed the full page in Elementor and want to hide the built-in PHP layout for this page.', 'grantrade' ); ?></span>
		</label>
	</p>
	<div class="gt-meta-grid">
		<?php
		foreach ( $schema as $meta_key => $cfg ) {
			$val         = get_post_meta( $post->ID, $meta_key, true );
			$field_id    = sanitize_key( 'gt_pf_' . $meta_key );
			$placeholder = isset( $cfg['default'] ) ? $cfg['default'] : '';

			if ( 'media' === $cfg['type'] ) {
				echo '<div class="gt-meta-full">';
				grantrade_render_media_picker_field(
					array(
						'id'          => $field_id,
						'name'        => $meta_key,
						'label'       => $cfg['label'],
						'value'       => (string) $val,
						'hint'        => isset( $cfg['hint'] ) ? $cfg['hint'] : '',
						'placeholder' => 'https://... or choose from Media Library',
					)
				);
				echo '</div>';
				continue;
			}

			$full_cls = ( 'textarea' === $cfg['type'] ) ? ' gt-meta-full' : '';
			?>
			<div class="gt-meta-field<?php echo esc_attr( $full_cls ); ?>">
				<label for="<?php echo esc_attr( $field_id ); ?>"><?php echo esc_html( $cfg['label'] ); ?></label>
				<?php if ( 'textarea' === $cfg['type'] ) : ?>
					<textarea
						id="<?php echo esc_attr( $field_id ); ?>"
						name="<?php echo esc_attr( $meta_key ); ?>"
						rows="3"
						placeholder="<?php echo esc_attr( $placeholder ); ?>"
					><?php echo esc_textarea( (string) $val ); ?></textarea>
				<?php else : ?>
					<input
						type="<?php echo 'url' === $cfg['type'] ? 'url' : 'text'; ?>"
						id="<?php echo esc_attr( $field_id ); ?>"
						name="<?php echo esc_attr( $meta_key ); ?>"
						value="<?php echo esc_attr( (string) $val ); ?>"
						placeholder="<?php echo esc_attr( $placeholder ); ?>"
					/>
				<?php endif; ?>
			</div>
			<?php
		}
		?>
	</div>
	<?php
}

function grantrade_save_page_meta( $post_id ) {
	if ( ! isset( $_POST['grantrade_page_meta_nonce'] ) || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['grantrade_page_meta_nonce'] ) ), 'grantrade_save_page_meta' ) ) {
		return;
	}
	if ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) {
		return;
	}
	if ( ! current_user_can( 'edit_page', $post_id ) ) {
		return;
	}

	$role   = grantrade_get_page_role( $post_id );
	$schema = grantrade_get_page_fields_schema( $role );

	foreach ( $schema as $meta_key => $cfg ) {
		if ( ! isset( $_POST[ $meta_key ] ) ) {
			continue;
		}
		$raw = wp_unslash( $_POST[ $meta_key ] );
		if ( 'textarea' === $cfg['type'] ) {
			$clean = sanitize_textarea_field( $raw );
		} elseif ( 'url' === $cfg['type'] || 'media' === $cfg['type'] ) {
			$clean = '' === trim( $raw ) ? '' : esc_url_raw( trim( $raw ) );
		} else {
			$clean = sanitize_text_field( $raw );
		}

		if ( '' === $clean ) {
			delete_post_meta( $post_id, $meta_key );
		} else {
			update_post_meta( $post_id, $meta_key, $clean );
		}
	}

	if ( isset( $_POST['_gt_page_replace_layout'] ) ) {
		update_post_meta( $post_id, '_gt_page_replace_layout', '1' );
	} else {
		delete_post_meta( $post_id, '_gt_page_replace_layout' );
	}
}
add_action( 'save_post_page', 'grantrade_save_page_meta' );

