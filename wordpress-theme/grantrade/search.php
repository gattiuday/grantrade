<?php
/**
 * Search Results Template
 *
 * WordPress doesn't have a native site search for this showroom theme.
 * Redirect visitors to the Collections catalog with any search term
 * pre-filled, or display a friendly "search not supported" message.
 *
 * @package GranTrade
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// Redirect to collections with the query so the client-side filter can handle it.
$search_query = get_search_query();
if ( ! empty( $search_query ) ) {
	$redirect_url = add_query_arg(
		array( 'q' => urlencode( $search_query ) ),
		grantrade_get_page_url( 'collections' )
	);
	wp_safe_redirect( esc_url_raw( $redirect_url ), 302 );
	exit;
}

get_header();
?>
  <main id="mainContent" class="section">
    <div class="container" style="padding-top:4rem; padding-bottom:4rem; text-align:center;">
      <div class="empty-box">
        <span class="eyebrow"><?php esc_html_e( 'Search', 'grantrade' ); ?></span>
        <h1><?php esc_html_e( 'Browse Our Stone Catalog', 'grantrade' ); ?></h1>
        <p><?php esc_html_e( 'Use our Collections page to filter by stone type, color, and finish.', 'grantrade' ); ?></p>
        <a href="<?php echo esc_url( grantrade_get_page_url( 'collections' ) ); ?>" class="btn btn-primary">
          <?php esc_html_e( 'Browse Collections →', 'grantrade' ); ?>
        </a>
      </div>
    </div>
  </main>
<?php get_footer(); ?>
