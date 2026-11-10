<?php
/**
 * Default WordPress Page Template (Block Editor / Gutenberg Compatible)
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
if ( function_exists( 'grantrade_is_elementor_mode' ) && grantrade_is_elementor_mode( get_queried_object_id() ) ) :
	?>
	<main id="mainContent" class="gt-elementor-content">
		<?php
		while ( have_posts() ) :
			the_post();
			the_content();
		endwhile;
		?>
	</main>
	<?php
else :
	?>
	<main id="mainContent" class="section">
		<div class="container">
			<?php
			while ( have_posts() ) :
				the_post();
				?>
				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
					<header class="section-head">
						<h1><?php the_title(); ?></h1>
					</header>
					<div class="wp-content">
						<?php the_content(); ?>
					</div>
				</article>
				<?php
			endwhile;
			?>
		</div>
	</main>
	<?php
endif;
get_footer();

