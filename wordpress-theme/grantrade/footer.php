<?php
/**
 * Site Footer & Favorites Slide-Out Drawer Template
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$theme_uri     = get_template_directory_uri();
$contact_url   = grantrade_get_page_url( 'contact' );
$colls_url     = grantrade_get_page_url( 'collections' );
$addr1         = grantrade_get_option( 'gt_address_line1', '178 Commerce Road' );
$addr2         = grantrade_get_option( 'gt_address_line2', 'Carlstadt, NJ 07072' );
$phone_display = grantrade_get_option( 'gt_phone_display', '(201) 438-1888' );
$phone_raw     = grantrade_get_option( 'gt_phone_raw', '2014381888' );
$inquiry_email = grantrade_get_option( 'gt_inquiry_email', 'grantrade@gmail.com' );
$sales_email   = grantrade_get_option( 'gt_sales_email', 'sales.grantrade@gmail.com' );
?>

  <!-- ================= FAVORITES DRAWER ================= -->
  <div id="scrim" class="scrim" aria-hidden="true"></div>
  <aside id="favDrawer" class="fav-drawer" aria-label="<?php esc_attr_e( 'Saved slabs drawer', 'grantrade' ); ?>" hidden>
    <div class="drawer-header">
      <h3><?php esc_html_e( 'Saved Slabs', 'grantrade' ); ?></h3>
      <button id="favClose" class="drawer-close" type="button" aria-label="<?php esc_attr_e( 'Close saved slabs drawer', 'grantrade' ); ?>">&times;</button>
    </div>
    <div id="favBody" class="drawer-body"></div>
    <div class="drawer-footer">
      <a href="<?php echo esc_url( $contact_url ); ?>" class="btn btn-primary btn-block"><?php esc_html_e( 'Inquire About Saved Slabs', 'grantrade' ); ?></a>
      <p style="font-size:0.75rem; color:var(--muted); text-align:center;">
        <?php esc_html_e( 'Bring this saved list when visiting Carlstadt or share with your stone fabricator.', 'grantrade' ); ?>
      </p>
    </div>
  </aside>

  <!-- ================= SITE FOOTER ================= -->
  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <picture>
          <source srcset="<?php echo esc_url( $theme_uri . '/assets/images/logo-white.png' ); ?>" media="(prefers-color-scheme: dark)" />
          <img src="<?php echo esc_url( $theme_uri . '/assets/images/logo.png' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" style="height:38px; width:auto; margin-bottom:1.25rem; display:block;" />
        </picture>
        <p><?php esc_html_e( 'Wholesale natural and engineered stone slabs, tile, and monuments imported directly from premier quarries and stocked in Carlstadt, New Jersey.', 'grantrade' ); ?></p>
        <?php if ( function_exists( 'grantrade_render_social_links' ) ) { echo grantrade_render_social_links(); } ?>
      </div>

      <div class="footer-col">
        <h4><?php esc_html_e( 'Explore', 'grantrade' ); ?></h4>
        <?php
        if ( has_nav_menu( 'footer_explore' ) ) {
          wp_nav_menu(
            array(
              'theme_location' => 'footer_explore',
              'container'      => false,
              'menu_class'     => 'footer-links',
              'depth'          => 1,
            )
          );
        } else {
          ?>
          <ul class="footer-links">
            <li><a href="<?php echo esc_url( grantrade_get_page_url( 'home' ) ); ?>"><?php esc_html_e( 'Home', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( grantrade_get_page_url( 'about' ) ); ?>"><?php esc_html_e( 'About Us', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( $colls_url ); ?>"><?php esc_html_e( 'Collections', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( grantrade_get_page_url( 'showroom' ) ); ?>"><?php esc_html_e( 'Showroom & Yard', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( $contact_url ); ?>"><?php esc_html_e( 'Contact Us', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( admin_url() ); ?>" style="opacity:0.75;"><?php esc_html_e( 'WP Admin', 'grantrade' ); ?> &rarr;</a></li>
          </ul>
          <?php
        }
        ?>
      </div>

      <div class="footer-col">
        <h4><?php esc_html_e( 'Stone Families', 'grantrade' ); ?></h4>
        <?php
        if ( has_nav_menu( 'footer_families' ) ) {
          wp_nav_menu(
            array(
              'theme_location' => 'footer_families',
              'container'      => false,
              'menu_class'     => 'footer-links',
              'depth'          => 1,
            )
          );
        } else {
          ?>
          <ul class="footer-links">
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'quartzite', $colls_url ) ); ?>"><?php esc_html_e( 'Quartzite', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'quartz', $colls_url ) ); ?>"><?php esc_html_e( 'Quartz', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'granite', $colls_url ) ); ?>"><?php esc_html_e( 'Granite', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'marble', $colls_url ) ); ?>"><?php esc_html_e( 'Marble', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'monuments', $colls_url ) ); ?>"><?php esc_html_e( 'Monuments', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'soapstone', $colls_url ) ); ?>"><?php esc_html_e( 'Soapstone', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'semi', $colls_url ) ); ?>"><?php esc_html_e( 'Semi Precious', 'grantrade' ); ?></a></li>
            <li><a href="<?php echo esc_url( add_query_arg( 'category', 'tile', $colls_url ) ); ?>"><?php esc_html_e( 'Tiles', 'grantrade' ); ?></a></li>
          </ul>
          <?php
        }
        ?>
      </div>

      <div class="footer-col">
        <h4><?php esc_html_e( 'Visit Warehouse', 'grantrade' ); ?></h4>
        <div class="footer-contact-item">
          <span><?php echo esc_html( $addr1 ); ?><br/><?php echo esc_html( $addr2 ); ?></span>
        </div>
        <div class="footer-contact-item">
          <a href="tel:<?php echo esc_attr( preg_replace( '/\D+/', '', $phone_raw ) ); ?>"><?php echo esc_html( $phone_display ); ?></a>
        </div>
        <div class="footer-contact-item">
          <a href="mailto:<?php echo esc_attr( $inquiry_email ); ?>"><?php echo esc_html( $inquiry_email ); ?></a>
        </div>
        <?php if ( strtolower( trim( $sales_email ) ) !== strtolower( trim( $inquiry_email ) ) ) : ?>
        <div class="footer-contact-item">
          <a href="mailto:<?php echo esc_attr( $sales_email ); ?>"><?php echo esc_html( $sales_email ); ?></a>
        </div>
        <?php endif; ?>
        <div style="margin-top:0.75rem;">
          <div class="open-indicator">
            <span class="open-dot"></span>
            <span class="open-text"><?php esc_html_e( 'Yard open today', 'grantrade' ); ?></span>
          </div>
        </div>
      </div>
    </div>

    <div class="container footer-bottom">
      <div>&copy; <?php echo esc_html( gmdate( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?> All rights reserved.</div>
      <div><?php esc_html_e( 'Wholesale Stone Distributor · Bergen County, New Jersey', 'grantrade' ); ?></div>
    </div>
  </footer>

  <?php wp_footer(); ?>
</body>
</html>

