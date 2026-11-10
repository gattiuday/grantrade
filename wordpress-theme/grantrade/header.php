<?php
/**
 * Site Header Template
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$theme_uri = get_template_directory_uri();
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <meta name="color-scheme" content="light dark" />
  <script>if ("scrollRestoration" in history) history.scrollRestoration = "manual";</script>
  <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

  <!-- ================= SITE HEADER ================= -->
  <header class="site-header">
    <div class="container-wide header-inner">
      <?php if ( has_custom_logo() ) : ?>
        <div class="wordmark">
          <?php the_custom_logo(); ?>
        </div>
      <?php else : ?>
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="wordmark" aria-label="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?> Home">
          <picture>
            <source srcset="<?php echo esc_url( $theme_uri . '/assets/images/logo-white.png' ); ?>" media="(prefers-color-scheme: dark)" />
            <img src="<?php echo esc_url( $theme_uri . '/assets/images/logo.png' ); ?>" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>" class="wordmark-logo" style="height:38px; width:auto; display:block;" />
          </picture>
        </a>
      <?php endif; ?>

      <!-- Primary Navigation -->
      <nav id="mainNav" class="main-nav" aria-label="<?php esc_attr_e( 'Main Navigation', 'grantrade' ); ?>">
        <?php
        wp_nav_menu(
          array(
            'theme_location' => 'primary',
            'container'      => false,
            'menu_class'     => 'nav-links',
            'depth'          => 1,
            'fallback_cb'    => 'grantrade_fallback_menu',
          )
        );
        ?>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <div class="yard-status-header">
          <span class="open-dot"></span>
          <span id="headerYardStatus"><?php esc_html_e( 'Checking yard hours...', 'grantrade' ); ?></span>
        </div>

        <button id="favOpen" class="fav-trigger" type="button" aria-label="<?php esc_attr_e( 'Open saved favorite slabs drawer', 'grantrade' ); ?>">
          <svg style="width:16px; height:16px; color:var(--accent);" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
          <span><?php esc_html_e( 'Saved', 'grantrade' ); ?></span>
          <span id="favCount" class="fav-badge" style="display:none;">0</span>
        </button>

        <button id="menuBtn" class="menu-toggle" type="button" aria-label="<?php esc_attr_e( 'Toggle navigation menu', 'grantrade' ); ?>" aria-expanded="false">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </div>
  </header>

