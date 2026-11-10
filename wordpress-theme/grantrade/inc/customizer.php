<?php
/**
 * WordPress Customizer Settings for Gran Trade Inc.
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function grantrade_get_option( $key, $default = '' ) {
	return get_theme_mod( $key, $default );
}

function grantrade_customize_register( $wp_customize ) {
	$wp_customize->add_section(
		'grantrade_warehouse',
		array(
			'title'       => __( 'Gran Trade — Warehouse & Hero', 'grantrade' ),
			'priority'    => 30,
			'description' => __( 'Configure Carlstadt warehouse contact info, yard hours, hero messaging, and catalog source.', 'grantrade' ),
		)
	);

	$settings = array(
		'gt_hero_tag'      => array(
			'label'   => __( 'Hero Tagline Badge', 'grantrade' ),
			'default' => 'Wholesale Warehouse & Slab Display · Carlstadt, NJ',
			'type'    => 'text',
		),
		'gt_hero_title'    => array(
			'label'   => __( 'Hero Main Headline', 'grantrade' ),
			'default' => 'The slab is the statement.',
			'type'    => 'text',
		),
		'gt_hero_lead'     => array(
			'label'   => __( 'Hero Lead Paragraph', 'grantrade' ),
			'default' => 'A premier distributor of architectural stones. Gran Trade imports natural quartzite, fine marble, durable granite, and engineered quartz from trusted quarries worldwide, stocked and ready at our Carlstadt, New Jersey warehouse.',
			'type'    => 'textarea',
		),
		'gt_address_line1' => array(
			'label'   => __( 'Warehouse Street Address', 'grantrade' ),
			'default' => '178 Commerce Road',
			'type'    => 'text',
		),
		'gt_address_line2' => array(
			'label'   => __( 'Warehouse City, State, ZIP', 'grantrade' ),
			'default' => 'Carlstadt, NJ 07072',
			'type'    => 'text',
		),
		'gt_phone_display' => array(
			'label'   => __( 'Main Yard Phone (Display)', 'grantrade' ),
			'default' => '(201) 438-1888',
			'type'    => 'text',
		),
		'gt_phone_raw'     => array(
			'label'   => __( 'Main Yard Phone (Digits Only)', 'grantrade' ),
			'default' => '2014381888',
			'type'    => 'text',
		),
		'gt_sales_email'   => array(
			'label'   => __( 'Sales Desk Display Email', 'grantrade' ),
			'default' => 'sales.grantrade@gmail.com',
			'type'    => 'email',
		),
		'gt_inquiry_email' => array(
			'label'   => __( 'Contact Us Form Recipient Email', 'grantrade' ),
			'default' => 'grantrade@gmail.com',
			'type'    => 'email',
		),
		'gt_hours_summary'    => array(
			'label'   => __( 'Hours Summary Strip', 'grantrade' ),
			'default' => 'Monday–Friday: 8:00 AM – 6:00 PM · Saturday: 9:00 AM – 2:00 PM · Sunday: 10:00 AM – 2:00 PM',
			'type'    => 'text',
		),
		'gt_social_facebook'  => array(
			'label'   => __( 'Facebook Page URL', 'grantrade' ),
			'default' => 'https://www.facebook.com/grantradeinc/',
			'type'    => 'url',
		),
		'gt_social_houzz'     => array(
			'label'   => __( 'Houzz Profile URL', 'grantrade' ),
			'default' => 'https://www.houzz.com/hznb/professionals/building-supplies/gran-trade-inc-pfvwus-pf~1639963827',
			'type'    => 'url',
		),
		'gt_social_instagram' => array(
			'label'   => __( 'Instagram Profile URL', 'grantrade' ),
			'default' => 'https://www.instagram.com/grantradeinc/?hl=en',
			'type'    => 'url',
		),
		'gt_social_yelp'      => array(
			'label'   => __( 'Yelp Business URL', 'grantrade' ),
			'default' => 'https://www.yelp.com/biz/gran-trade-carlstadt-5?osq=Gran+Trade',
			'type'    => 'url',
		),
	);

	foreach ( $settings as $id => $cfg ) {
		$sanitize = 'textarea' === $cfg['type'] ? 'sanitize_textarea_field' : ( 'email' === $cfg['type'] ? 'sanitize_email' : ( 'url' === $cfg['type'] ? 'esc_url_raw' : 'sanitize_text_field' ) );
		$wp_customize->add_setting(
			$id,
			array(
				'default'           => $cfg['default'],
				'sanitize_callback' => $sanitize,
			)
		);
		$wp_customize->add_control(
			$id,
			array(
				'label'   => $cfg['label'],
				'section' => 'grantrade_warehouse',
				'type'    => $cfg['type'],
			)
		);
	}

	$wp_customize->add_setting(
		'gt_catalog_mode',
		array(
			'default'           => 'wp_only',
			'sanitize_callback' => 'sanitize_key',
		)
	);
	$wp_customize->add_control(
		'gt_catalog_mode',
		array(
			'label'   => __( 'Stone Catalog Source', 'grantrade' ),
			'section' => 'grantrade_warehouse',
			'type'    => 'select',
			'choices' => array(
				'merge'   => __( 'Built-in 50 Stones + WordPress Stone Slabs', 'grantrade' ),
				'wp_only' => __( 'WordPress Stone Slabs CPT Only', 'grantrade' ),
			),
		)
	);
}
add_action( 'customize_register', 'grantrade_customize_register' );

/**
 * Render social profile pill links (Facebook, Houzz, Instagram, Yelp).
 */
function grantrade_render_social_links() {
	$networks = array(
		'facebook'  => array(
			'label' => 'Facebook',
			'url'   => grantrade_get_option( 'gt_social_facebook', 'https://www.facebook.com/grantradeinc/' ),
			'svg'   => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.6V4.9c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1V11H7.7v3h2.6v8h3.2z"/></svg>',
		),
		'houzz'     => array(
			'label' => 'Houzz',
			'url'   => grantrade_get_option( 'gt_social_houzz', 'https://www.houzz.com/hznb/professionals/building-supplies/gran-trade-inc-pfvwus-pf~1639963827' ),
			'svg'   => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.3 3L5 7.2V21h5.2v-5.7h3.6V21H19v-8.8L12.3 3z"/></svg>',
		),
		'instagram' => array(
			'label' => 'Instagram',
			'url'   => grantrade_get_option( 'gt_social_instagram', 'https://www.instagram.com/grantradeinc/?hl=en' ),
			'svg'   => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
		),
		'yelp'      => array(
			'label' => 'Yelp',
			'url'   => grantrade_get_option( 'gt_social_yelp', 'https://www.yelp.com/biz/gran-trade-carlstadt-5?osq=Gran+Trade' ),
			'svg'   => '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M11.1 2.2c-.5 0-.9.4-.9.9v6.2c0 .6.6 1 1.1.8l1.6-.6c.5-.2.7-.8.5-1.3l-1.5-5.3c-.1-.4-.4-.7-.8-.7zm-1.9 9.7l-5.3-1.4c-.5-.1-1 .3-.9.9l.4 2c.1.4.4.7.8.8l4.9 1.1c.6.1 1.1-.4 1-1l-.2-1.6c-.1-.4-.4-.7-.7-.8zm4.2.5c-.5.2-.7.8-.4 1.3l2.6 4.4c.3.4.8.5 1.2.2l1.6-1.2c.3-.3.4-.8.2-1.2l-3-4.1c-.3-.4-.9-.5-1.3-.3l-.9.9zm-3.6 3.2l-3.7 3.7c-.4.4-.3 1 .1 1.3l1.7 1c.4.2.9.1 1.2-.2l2.9-3.9c.3-.5.1-1.1-.4-1.4l-1.1-.6c-.3-.1-.5-.1-.7.1zm5-3.8c.5 0 1 .4 1 .9l-.2 2.1c0 .4-.4.8-.8.8l-5.3.2c-.6 0-1-.6-.8-1.1l.6-1.4c.1-.4.5-.6.9-.7l4.6-.8z"/></svg>',
		),
	);
	$out = '<div class="social-links-row" aria-label="' . esc_attr__( 'Social profiles', 'grantrade' ) . '">';
	foreach ( $networks as $item ) {
		$url = trim( (string) $item['url'] );
		if ( '' === $url ) {
			continue;
		}
		$out .= '<a href="' . esc_url( $url ) . '" target="_blank" rel="noopener noreferrer" class="social-link-pill">' . $item['svg'] . '<span>' . esc_html( $item['label'] ) . '</span></a>';
	}
	$out .= '</div>';
	return $out;
}

