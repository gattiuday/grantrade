<?php
/**
 * Archive & Stone Family Taxonomy Template
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>
  <main id="mainContent" class="section">
    <div class="container">
      <header class="section-head">
        <span class="eyebrow"><?php esc_html_e( 'Archive', 'grantrade' ); ?></span>
        <h1><?php the_archive_title(); ?></h1>
        <?php the_archive_description( '<p class="lead">', '</p>' ); ?>
      </header>

      <?php if ( have_posts() ) : ?>
        <div class="slab-grid">
          <?php
          while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'slab-card' ); ?>>
              <?php if ( has_post_thumbnail() ) : ?>
                <div class="sc-media">
                  <a href="<?php the_permalink(); ?>" style="display:block; width:100%; height:100%;">
                    <?php the_post_thumbnail( 'medium_large' ); ?>
                  </a>
                </div>
              <?php endif; ?>
              <div class="sc-body">
                <h3 class="sc-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
                <div class="sc-meta"><?php echo esc_html( get_the_date() ); ?></div>
                <p class="sc-desc"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 24 ) ); ?></p>
                <div class="sc-actions">
                  <a href="<?php the_permalink(); ?>" class="btn btn-sm btn-primary sc-action-inspect"><?php esc_html_e( 'View Details →', 'grantrade' ); ?></a>
                </div>
              </div>
            </article>
            <?php
          endwhile;
          ?>
        </div>
        <div style="margin-top:2.5rem;"><?php the_posts_pagination(); ?></div>
      <?php else : ?>
        <div class="empty-box">
          <h3><?php esc_html_e( 'Nothing found here yet', 'grantrade' ); ?></h3>
          <p><?php esc_html_e( 'Explore our 50+ curated stone slabs in the main catalog.', 'grantrade' ); ?></p>
          <a href="<?php echo esc_url( grantrade_get_page_url( 'collections' ) ); ?>" class="btn btn-primary"><?php esc_html_e( 'Browse Collections', 'grantrade' ); ?></a>
        </div>
      <?php endif; ?>
    </div>
  </main>
<?php get_footer(); ?>

