<?php
/**
 * Single Stone Slab Post Template (`gt_slab` CPT)
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
if ( have_posts() ) :
	the_post();
	?>
	<script>
		window.GRAN_TRADE_CURRENT_SLAB_ID = <?php echo wp_json_encode( get_post_field( 'post_name', get_the_ID() ) ); ?>;
	</script>
	<?php
endif;
get_template_part( 'template-parts/slab-detail' );
$slab_raw_content = trim( (string) get_post_field( 'post_content', get_the_ID() ) );
if ( ( function_exists( 'grantrade_is_elementor_mode' ) && grantrade_is_elementor_mode( get_the_ID() ) ) || '' !== $slab_raw_content ) {
	echo '<section class="gt-elementor-content">';
	the_content();
	echo '</section>';
}
get_footer();

