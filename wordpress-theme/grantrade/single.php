<?php
/**
 * Single Blog Post Template
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
  <main id="mainContent" class="section">
    <div class="container" style="max-width: 860px;">
      <?php
      while ( have_posts() ) :
        the_post();
        ?>
        <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
          <header class="section-head">
            <span class="eyebrow"><?php echo esc_html( get_the_date() ); ?></span>
            <h1><?php the_title(); ?></h1>
          </header>
          <?php if ( has_post_thumbnail() ) : ?>
            <div style="border-radius:var(--radius-lg); overflow:hidden; margin-bottom:2rem;">
              <?php the_post_thumbnail( 'large' ); ?>
            </div>
          <?php endif; ?>
          <div class="wp-content">
            <?php the_content(); ?>
          </div>
        </article>
        <?php
      endwhile;
      ?>
    </div>
  </main>
<?php get_footer(); ?>

