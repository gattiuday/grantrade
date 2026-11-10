<?php
/**
 * Template Name: About Us
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
$phone_display = grantrade_get_option( 'gt_phone_display', '(201) 438-1888' );
$about_eye     = grantrade_get_page_field( $gt_page_id, '_gt_page_eyebrow', 'Our Heritage' );
$about_head    = grantrade_get_page_field( $gt_page_id, '_gt_page_heading', 'Premier surfaces, since 2003' );
$about_lead    = grantrade_get_page_field( $gt_page_id, '_gt_page_lead', 'Two decades of deep quarry relationships, direct container imports, and dedicated wholesale distribution across the Northeast tri-state corridor.' );
$m1_val        = grantrade_get_page_field( $gt_page_id, '_gt_metric1_val', '2003' );
$m1_lbl        = grantrade_get_page_field( $gt_page_id, '_gt_metric1_lbl', 'Year Established' );
$m2_val        = grantrade_get_page_field( $gt_page_id, '_gt_metric2_val', '20+' );
$m2_lbl        = grantrade_get_page_field( $gt_page_id, '_gt_metric2_lbl', 'Years in Business' );
$m3_val        = grantrade_get_page_field( $gt_page_id, '_gt_metric3_val', '1,000+' );
$m3_lbl        = grantrade_get_page_field( $gt_page_id, '_gt_metric3_lbl', 'Fabricators & Partners' );
$sec2_eye      = grantrade_get_page_field( $gt_page_id, '_gt_sec2_eyebrow', 'The Gran Trade Story' );
$sec2_head     = grantrade_get_page_field( $gt_page_id, '_gt_sec2_heading', 'Two decades of stone expertise in Carlstadt, New Jersey' );
$about_img     = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image1', 'assets/images/aquamarine-slab-1.jpg' );
get_header();
?>

  <main id="mainContent">
    <div class="container about-hero">
      <span class="eyebrow"><?php echo esc_html( $about_eye ); ?></span>
      <h1><?php echo esc_html( $about_head ); ?></h1>
      <p class="lead">
        <?php echo esc_html( $about_lead ); ?>
      </p>
    </div>

    <div class="container">
      <div class="specs-bar">
        <div class="spec-item">
          <div class="val"><?php echo esc_html( $m1_val ); ?></div>
          <div class="lbl"><?php echo esc_html( $m1_lbl ); ?></div>
        </div>
        <div class="spec-item">
          <div class="val"><?php echo esc_html( $m2_val ); ?></div>
          <div class="lbl"><?php echo esc_html( $m2_lbl ); ?></div>
        </div>
        <div class="spec-item">
          <div class="val"><?php echo esc_html( $m3_val ); ?></div>
          <div class="lbl"><?php echo esc_html( $m3_lbl ); ?></div>
        </div>
      </div>
    </div>

    <section class="section-tight">
      <div class="container">
        <div class="about-story-grid">
          <div>
            <span class="eyebrow"><?php echo esc_html( $sec2_eye ); ?></span>
            <h2><?php echo esc_html( $sec2_head ); ?></h2>
            <p style="margin-bottom:1.25rem;">
              Founded in <strong>2003</strong> and based in <strong>Carlstadt, New Jersey</strong>, Gran Trade Inc. has grown into one of the region’s most trusted wholesale distributors of natural and engineered stone.
            </p>
            <p style="margin-bottom:1.25rem;">
              The team brings more than two decades of hands-on experience and works side-by-side with fabricators to meet what architects, designers, and homeowners ask for. Strong, longstanding supplier relationships across Italy, Brazil, India, Spain, and domestic US quarries allow us to import fine material at the lowest possible cost — and an efficient supply chain keeps our partners stocked day after day.
            </p>
            <p>
              We do not treat stone as an abstract commodity. Every container arriving at our Carlstadt facility is unbanded, crane-lifted, and inspected slab by slab to ensure resin consistency, thickness calibration, and structural integrity.
            </p>
          </div>

          <div class="about-media">
            <img src="<?php echo esc_url( $about_img ); ?>" alt="<?php echo esc_attr( $sec2_head ); ?>" loading="lazy" onerror="this.onerror=null; this.src='<?php echo esc_url( $theme_uri . '/assets/images/stone-types/granite.jpg' ); ?>';" />
          </div>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">How We Operate</span>
          <h2>A wholesale model built around the fabricator</h2>
          <p>We supply raw stone slabs and monuments to the trades. Here is how our distribution network powers projects from concept to completion.</p>
        </div>

        <div class="why-grid">
          <div class="why-card">
            <div class="why-num">01</div>
            <h3>Direct Quarry Sourcing</h3>
            <p>We bypass middlemen and contract directly with primary quarries in Carrara, Bahia, Rajasthan, and Alicante. This eliminates markup and gives us first pick of sequential blocks.</p>
          </div>

          <div class="why-card">
            <div class="why-num">02</div>
            <h3>Deep Consecutive Bundles</h3>
            <p>We stock full bundles cut sequentially from the same mountain block. Fabricators can bookmatch veins for expansive islands and multi-slab installations without color shifts.</p>
          </div>

          <div class="why-card">
            <div class="why-num">03</div>
            <h3>Indoor Yard Staging</h3>
            <p>Our Carlstadt warehouse is equipped with heavy overhead gantry cranes. We pull slabs safely into staging bays so designers and homeowners can examine full bundles under proper lighting.</p>
          </div>

          <div class="why-card">
            <div class="why-num">04</div>
            <h3>Rapid Tri-State Delivery</h3>
            <p>With an active A-frame fleet and convenient access to the NJ Turnpike, Route 3, and Route 17, we deliver bundles directly to fabricator shops with minimal lead times.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div style="background-color: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: clamp(2rem, 4vw, 3.5rem);">
          <span class="eyebrow">Operational Standards</span>
          <h2 style="margin-bottom:1rem;">Our wholesale trade commitment</h2>
          <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr)); gap:2rem; margin-top:1.5rem;">
            <div>
              <h4 style="margin-bottom:0.5rem; color:var(--ink);">Strictly Wholesale</h4>
              <p style="font-size:0.92rem; color:var(--ink-2);">Gran Trade Inc. is a slab importer and distributor. We do not fabricate or install counters. We protect our fabricator partners by never quoting installation prices directly to homeowners.</p>
            </div>
            <div>
              <h4 style="margin-bottom:0.5rem; color:var(--ink);">Homeowners Welcome</h4>
              <p style="font-size:0.92rem; color:var(--ink-2);">Homeowners are invited to walk our yard, inspect full bundles, and tag their favorite slabs. Once tagged, we coordinate bundle holds directly with your fabricator of choice.</p>
            </div>
            <div>
              <h4 style="margin-bottom:0.5rem; color:var(--ink);">Direct Phone Access</h4>
              <p style="font-size:0.92rem; color:var(--ink-2);">You never get an automated call center. Call <?php echo esc_html( $phone_display ); ?> and speak directly with warehouse specialists who know exactly what is on the racks today.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <?php grantrade_render_page_extra_content(); ?>
  </main>

<?php get_footer(); ?>

