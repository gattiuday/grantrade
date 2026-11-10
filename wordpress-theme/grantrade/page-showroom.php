<?php
/**
 * Template Name: Showroom & Yard
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( function_exists( 'grantrade_maybe_render_elementor_only' ) && grantrade_maybe_render_elementor_only() ) {
	return;
}
$theme_uri     = get_template_directory_uri();
$gt_page_id    = (int) get_queried_object_id();
$contact_url   = grantrade_get_page_url( 'contact' );
$addr1         = grantrade_get_option( 'gt_address_line1', '178 Commerce Road' );
$addr2         = grantrade_get_option( 'gt_address_line2', 'Carlstadt, NJ 07072' );
$hours_summary = grantrade_get_option( 'gt_hours_summary', 'Monday–Friday: 8:00 AM – 6:00 PM · Saturday: 9:00 AM – 2:00 PM · Sunday: 10:00 AM – 2:00 PM' );
$phone_display = grantrade_get_option( 'gt_phone_display', '(201) 438-1888' );
$phone_raw     = grantrade_get_option( 'gt_phone_raw', '2014381888' );
$show_eyebrow  = grantrade_get_page_field( $gt_page_id, '_gt_page_eyebrow', 'Warehouse & Slab Yard' );
$show_heading  = grantrade_get_page_field( $gt_page_id, '_gt_page_heading', 'Come walk the yard' );
$show_lead     = grantrade_get_page_field( $gt_page_id, '_gt_page_lead', 'Photos sell stone short. Visit Carlstadt to see full slabs in person — trade customers and homeowners alike, no appointment needed during open hours.' );
$show_img1     = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image1', 'assets/images/stone-types/granite.jpg' );
$show_img2     = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image2', 'assets/images/aquamarine-slab-1.jpg' );
$show_img3     = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image3', 'assets/images/stone-types/marble.jpg' );
$show_img4     = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image4', 'assets/images/aquamarine-slab-2.jpg' );
$show_img5     = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image5', 'assets/images/stone-types/quartzite.jpg' );
get_header();
?>

  <main id="mainContent">
    <div class="container section-tight showroom-intro">
      <span class="eyebrow"><?php echo esc_html( $show_eyebrow ); ?></span>
      <h1><?php echo esc_html( $show_heading ); ?></h1>
      <p class="lead">
        <?php echo esc_html( $show_lead ); ?>
      </p>
    </div>

    <div class="container">
      <div class="showroom-gallery">
        <div class="gallery-tall">
          <img src="<?php echo esc_url( $show_img1 ); ?>" alt="Overhead crane and upright stone slab racks inside Carlstadt warehouse" loading="eager" onerror="this.onerror=null; this.src='<?php echo esc_url( $theme_uri . '/assets/images/aquamarine-slab-1.jpg' ); ?>';" />
        </div>

        <div class="gallery-stack">
          <div class="gallery-item">
            <img src="<?php echo esc_url( $show_img2 ); ?>" alt="Exotic Aquamarine quartzite feature slab" loading="lazy" onerror="this.onerror=null; this.src='<?php echo esc_url( $theme_uri . '/assets/images/stone-types/quartzite.jpg' ); ?>';" />
          </div>
          <div class="gallery-item">
            <img src="<?php echo esc_url( $show_img3 ); ?>" alt="Fine Italian marble slabs lined up in display row" loading="lazy" />
          </div>
          <div class="gallery-item">
            <img src="<?php echo esc_url( $show_img4 ); ?>" alt="Finished architectural installation with bookmatched natural stone" loading="lazy" onerror="this.onerror=null; this.src='<?php echo esc_url( $theme_uri . '/assets/images/stone-types/granite.jpg' ); ?>';" />
          </div>
          <div class="gallery-item">
            <img src="<?php echo esc_url( $show_img5 ); ?>" alt="Exotic quartzite bundles lined up for inspection" loading="lazy" />
          </div>
        </div>
      </div>
    </div>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Planning Your Visit</span>
          <h2>What to expect at the Carlstadt yard</h2>
          <p>We keep our facility clean, accessible, and organized so you can inspect material safely and efficiently.</p>
        </div>

        <div class="yard-guide-grid">
          <div class="yard-guide-card">
            <h3>01. Walk-in Welcomed</h3>
            <p>Trade professionals and homeowners are welcome without an appointment Monday through Saturday. Bring cabinet samples, paint swatches, or tile chips to compare directly against natural slabs.</p>
          </div>

          <div class="yard-guide-card">
            <h3>02. Crane-Assisted Staging</h3>
            <p>Want to see a specific slab tucked behind others in a bundle? Our warehouse crew uses overhead gantry cranes to safely pull slabs forward into dedicated staging areas under direct daylight lamps.</p>
          </div>

          <div class="yard-guide-card">
            <h3>03. Tagging &amp; Bundle Holds</h3>
            <p>Found the exact slab for your project? We apply physical hold tags with your project name. We coordinate directly with your certified fabricator to arrange delivery.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section" style="background-color: var(--surface); border-top: 1px solid var(--line);">
      <div class="container yard-cta-bar">
        <div>
          <span class="eyebrow">Warehouse Location</span>
          <h2 style="margin-bottom:0.35rem;"><?php echo esc_html( $addr1 . ', ' . $addr2 ); ?></h2>
          <p><?php echo esc_html( $hours_summary ); ?></p>
        </div>
        <div class="yard-cta-actions">
          <a href="<?php echo esc_url( $contact_url ); ?>" class="btn btn-dark">View Map &amp; Driving Directions</a>
          <a href="tel:<?php echo esc_attr( preg_replace( '/\D+/', '', $phone_raw ) ); ?>" class="btn btn-secondary">Call Yard: <?php echo esc_html( $phone_display ); ?></a>
        </div>
      </div>
    </section>

    <?php grantrade_render_page_extra_content(); ?>
  </main>

<?php get_footer(); ?>

