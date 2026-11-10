<?php
/**
 * Template Name: Slab Detail
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
get_template_part( 'template-parts/slab-detail' );
if ( function_exists( 'grantrade_render_page_extra_content' ) ) {
	grantrade_render_page_extra_content();
}
get_footer();

