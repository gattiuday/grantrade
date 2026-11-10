<?php
/**
 * 404 Not Found Template
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
      <div class="empty-box" style="max-width:600px;">
        <span class="eyebrow">404</span>
        <h1><?php esc_html_e( 'Page Not Found', 'grantrade' ); ?></h1>
        <p><?php esc_html_e( 'The requested slab or page could not be located. Browse our wholesale catalog or return to the homepage.', 'grantrade' ); ?></p>
        <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
          <a href="<?php echo esc_url( grantrade_get_page_url( 'home' ) ); ?>" class="btn btn-primary"><?php esc_html_e( 'Back to Home', 'grantrade' ); ?></a>
          <a href="<?php echo esc_url( grantrade_get_page_url( 'collections' ) ); ?>" class="btn btn-secondary"><?php esc_html_e( 'Browse Collections', 'grantrade' ); ?></a>
        </div>
      </div>
    </div>
  </main>
<?php get_footer(); ?>

