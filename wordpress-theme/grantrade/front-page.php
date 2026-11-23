<?php
/**
 * Front Page Template (Gran Trade Home)
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
if ( ! $gt_page_id ) {
	$gt_page_id = (int) get_option( 'page_on_front' );
}
$colls_url     = grantrade_get_page_url( 'collections' );
$showroom_url  = grantrade_get_page_url( 'showroom' );
$contact_url   = grantrade_get_page_url( 'contact' );
$slab_url      = grantrade_get_page_url( 'slab' );
$hero_tag      = grantrade_get_page_field( $gt_page_id, '_gt_page_eyebrow', grantrade_get_option( 'gt_hero_tag', 'Wholesale Warehouse & Slab Display · Carlstadt, NJ' ) );
$hero_title    = grantrade_get_page_field( $gt_page_id, '_gt_page_heading', grantrade_get_option( 'gt_hero_title', 'The slab is the statement.' ) );
$hero_lead     = grantrade_get_page_field( $gt_page_id, '_gt_page_lead', grantrade_get_option( 'gt_hero_lead', 'A premier distributor of architectural stones. Gran Trade imports natural quartzite, fine marble, durable granite, and engineered quartz from trusted quarries worldwide, stocked and ready at our Carlstadt, New Jersey warehouse.' ) );
$hero_bg       = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image1', 'assets/images/stone-types/granite.jpg' );
$cta1_label    = grantrade_get_page_field( $gt_page_id, '_gt_page_cta_label', 'Browse the Collections' );
$cta1_url      = grantrade_get_page_field( $gt_page_id, '_gt_page_cta_url', $colls_url );
$cta2_label    = grantrade_get_page_field( $gt_page_id, '_gt_page_cta2_label', 'Plan a Warehouse Visit' );
$cta2_url      = grantrade_get_page_field( $gt_page_id, '_gt_page_cta2_url', $showroom_url );
$m1_val        = grantrade_get_page_field( $gt_page_id, '_gt_metric1_val', '20+' );
$m1_lbl        = grantrade_get_page_field( $gt_page_id, '_gt_metric1_lbl', 'Years importing stone' );
$m2_val        = grantrade_get_page_field( $gt_page_id, '_gt_metric2_val', '1,000+' );
$m2_lbl        = grantrade_get_page_field( $gt_page_id, '_gt_metric2_lbl', 'Trade customers served' );
$tax_eyebrow   = grantrade_get_page_field( $gt_page_id, '_gt_tax_eyebrow', 'OUR PREMIUM STONE COLLECTION' );
$tax_heading   = grantrade_get_page_field( $gt_page_id, '_gt_tax_heading', 'Explore Our Stone Collections' );
$tax_lead      = grantrade_get_page_field( $gt_page_id, '_gt_tax_lead', 'Sourced from renowned quarries across Brazil, Italy, India, and the United States, our carefully curated collection brings exceptional natural and engineered stone to our Carlstadt, New Jersey warehouse. Discover distinctive colors, elegant veining, and premium surfaces selected for residential, commercial, and architectural projects.' );
$applied_img   = grantrade_get_page_image_url( $gt_page_id, '_gt_page_image2', 'assets/images/aquamarine-slab-2.jpg' );
$applied_eye   = grantrade_get_page_field( $gt_page_id, '_gt_applied_eyebrow', 'From Slab to Space' );
$applied_head  = grantrade_get_page_field( $gt_page_id, '_gt_applied_heading', 'Where our stone ends up' );
$applied_lead  = grantrade_get_page_field( $gt_page_id, '_gt_applied_lead', 'Most of what leaves our Carlstadt facility is fabricated within the tri-state area — kitchens, master baths, hotel lobbies, restaurant bars, and monumental memorials.' );
$banner_eye    = grantrade_get_page_field( $gt_page_id, '_gt_banner_eyebrow', 'Visit Carlstadt, NJ' );
$banner_head   = grantrade_get_page_field( $gt_page_id, '_gt_banner_heading', 'Come walk the slab yard' );
$banner_text   = grantrade_get_page_field( $gt_page_id, '_gt_banner_text', 'Photos sell stone short. Visit our 178 Commerce Road warehouse to see full slabs under natural and overhead staging light. No appointment needed during open hours.' );
$phone_display = grantrade_get_option( 'gt_phone_display', '(201) 438-1888' );
$phone_raw     = grantrade_get_option( 'gt_phone_raw', '2014381888' );
get_header();
?>

  <main id="mainContent">
    <!-- ================= HERO SECTION WITH 3D LIVE SLAB VISUALIZER ================= -->
    <section class="hero">
      <img src="<?php echo esc_url( $hero_bg ); ?>" alt="<?php echo esc_attr( $hero_title ); ?>" class="hero-bg" />
      <div class="hero-shade"></div>
      <div class="container hero-content">
        <div class="hero-grid">
          <div class="hero-left">
            <div class="hero-tag">
              <span><?php echo esc_html( $hero_tag ); ?></span>
            </div>
            <h1><?php echo esc_html( $hero_title ); ?></h1>
            <p class="lead"><?php echo esc_html( $hero_lead ); ?></p>
            <div class="hero-actions">
              <a href="<?php echo esc_url( $cta1_url ); ?>" class="btn btn-primary"><?php echo esc_html( $cta1_label ); ?></a>
              <a href="<?php echo esc_url( $cta2_url ); ?>" class="btn btn-secondary"><?php echo esc_html( $cta2_label ); ?></a>
            </div>

            <div class="hero-metrics">
              <div class="metric-item">
                <div class="metric-val"><?php echo esc_html( $m1_val ); ?></div>
                <div class="metric-lbl"><?php echo esc_html( $m1_lbl ); ?></div>
              </div>
              <div class="metric-item">
                <div class="metric-val"><?php echo esc_html( $m2_val ); ?></div>
                <div class="metric-lbl"><?php echo esc_html( $m2_lbl ); ?></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= LIQUID FLOW STONE CATALOG & SCROLL POPUP SYSTEM ================= -->
    <section id="liquidFlowSection" class="liquid-flow-section" aria-label="Liquid Flow Stone Catalog">
      <div class="liquid-ambient" aria-hidden="true">
        <div class="liquid-orb liquid-orb-1"></div>
        <div class="liquid-orb liquid-orb-2"></div>
        <div class="liquid-orb liquid-orb-3"></div>
      </div>

      <div class="container" style="position:relative; z-index:2;">
        <div class="liquid-head-wrap">
          <div class="section-head center" style="margin-bottom:0;">
            <span class="eyebrow"><?php echo esc_html( $tax_eyebrow ); ?></span>
            <h2><?php echo esc_html( $tax_heading ); ?></h2>
            <p class="lead" style="margin: 0 auto; max-width: 760px;">
              <?php echo esc_html( $tax_lead ); ?>
            </p>
          </div>
        </div>

        <div class="liquid-vertical-flow">
          <?php
          $families = array(
            array(
              'family'    => 'quartzite',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Brazil (Bahia & Espirito Santo)',
              'img'       => 'assets/images/stone-types/quartzite.jpg',
              'alt'       => 'Authentic Brazilian quartzite slab on warehouse A-frame',
              'geology'   => 'THE ART OF NATURAL QUARTZITE',
              'title'     => 'Quartzite',
              'desc'      => 'Natural beauty with remarkable strength. Quartzite features distinctive veining, rich mineral patterns, and a refined appearance, making it an exceptional choice for kitchen islands, countertops, backsplashes, and statement walls.',
              'formats'   => '3 cm Bookmatched Consecutive Bundles',
              'textures'  => 'Polished Mirror · Leathered Satin · Honed Velvet',
              'apps'      => 'Waterfall Kitchen Islands · Backlit Feature Walls · Luxury Vanities',
              'cta'       => 'Explore Quartzite →',
            ),
            array(
              'family'    => 'marble',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Italy (Carrara) & Greece',
              'img'       => 'assets/images/stone-types/marble.jpg',
              'alt'       => 'Italian Arabescato Carrara marble slab with brecciated veining',
              'geology'   => 'TIMELESS MARBLE ELEGANCE',
              'title'     => 'Marble',
              'desc'      => 'A timeless expression of luxury and sophistication. Our marble collection features elegant veining, distinctive patterns, and classic finishes that bring character to kitchens, bathrooms, fireplaces, and architectural interiors.',
              'formats'   => '3 cm Full Slabs',
              'textures'  => 'Polished High Gloss · Honed Matte · Satin Silk',
              'apps'      => 'Showcase Kitchen Islands · Master En-Suites · Fireplace Surrounds',
              'cta'       => 'Explore Marble →',
            ),
            array(
              'family'    => 'granite',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Brazil, India & Norway',
              'img'       => 'assets/images/stone-types/granite.jpg',
              'alt'       => 'Black Forest granite architectural installation',
              'geology'   => 'STRENGTH IN NATURAL STONE',
              'title'     => 'Granite',
              'desc'      => 'Known for its strength, durability, and natural character, granite is an excellent choice for residential and commercial applications. Explore a variety of colors, textures, and patterns suitable for indoor and outdoor spaces.',
              'formats'   => '3 cm Heavy-Duty Slabs',
              'textures'  => 'Polished · Leathered Tactile · Flamed · Honed',
              'apps'      => 'Chef\'s Working Kitchens · Outdoor BBQ Islands · Commercial Bars',
              'cta'       => 'Explore Granite →',
            ),
            array(
              'family'    => 'quartz',
              'type'      => 'engineered',
              'badge_cls' => 'engineered',
              'badge'     => 'Engineered Surfacing',
              'origin'    => 'USA & Global Surfacing',
              'img'       => 'assets/images/stone-types/quartz.jpg',
              'alt'       => 'Calacatta quartz countertop with mitered waterfall edge',
              'geology'   => 'REFINED ENGINEERED SURFACES',
              'title'     => 'Engineered Quartz',
              'desc'      => 'Contemporary design meets everyday practicality. Engineered quartz offers consistent patterns, a wide range of colors, and a nonporous surface that does not require routine sealing.',
              'formats'   => 'Jumbo Slabs (63" x 128") · 3 cm',
              'textures'  => 'High Polish Brilliant · Soft Touch Matte (Honed)',
              'apps'      => 'Modern Family Kitchens · Multi-Unit Developments · Hospitality Suites',
              'cta'       => 'Explore Quartz →',
            ),
            array(
              'family'    => 'soapstone',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Brazil & Virginia, USA',
              'img'       => 'assets/images/stone-types/soapstone.jpg',
              'alt'       => 'Soapstone matte artisanal kitchen surface with organic veining',
              'geology'   => 'NATURAL BEAUTY, DISTINCTIVE CHARACTER',
              'title'     => 'Soapstone',
              'desc'      => 'Distinctive, understated, and naturally elegant. Soapstone is admired for its smooth feel, rich tones, and organic veining. Its unique appearance makes it a beautiful choice for kitchens, fireplaces, and custom interiors.',
              'formats'   => '3 cm Heavy Architectural Slabs',
              'textures'  => 'Honed Silky Matte',
              'apps'      => 'Artisanal & Farmhouse Kitchens · Fireplace Hearths · Chemistry Benches',
              'cta'       => 'Explore Soapstone →',
            ),
            array(
              'family'    => 'semi',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Gemstone Slab',
              'origin'    => 'Brazil & Madagascar',
              'img'       => 'assets/images/stone-types/semi-precious.jpg',
              'alt'       => 'Illuminated blue agate semi precious stone architectural feature',
              'geology'   => 'THE RARE BEAUTY OF GEMSTONE',
              'title'     => 'Semi-Precious Stone',
              'desc'      => 'Make a statement with the extraordinary beauty of natural gemstones. Featuring agate, crystal, and other distinctive materials, these specialty surfaces create striking visual features, especially in backlit installations.',
              'formats'   => '2 cm Solid & Reinforced Composite Slabs',
              'textures'  => 'Mirror Polished Gemstone Surface',
              'apps'      => 'Backlit Luxury Cocktail Bars · Powder Room Statement Walls · VIP Foyers',
              'cta'       => 'Explore Semi-Precious →',
            ),
            array(
              'family'    => 'monuments',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Structural Granite',
              'origin'    => 'North America & India',
              'img'       => 'assets/images/stone-types/monuments.jpg',
              'alt'       => 'Wholesale structural granite blocks and monument blanks in distribution yard',
              'geology'   => 'CRAFTED FOR GENERATIONS',
              'title'     => 'Monuments',
              'desc'      => 'Quality granite products crafted for lasting memorials and outdoor applications. Our monument selection includes granite blanks, bases, dies, and slants in a variety of styles and finishes.',
              'formats'   => 'Custom Architectural Blanks · Bases · Dies · Slants',
              'textures'  => 'Polished Face · Rock Pitch · Thermal Stipple',
              'apps'      => 'Civic Memorials · Public Plazas · Architectural Historic Markers',
              'cta'       => 'Explore Monuments →',
            ),
            array(
              'family'    => 'tile',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Formats',
              'origin'    => 'Italy & Turkey',
              'img'       => 'assets/images/stone-types/tile.jpg',
              'alt'       => 'Seamless luxury Mediterranean villa French-pattern travertine stone tile flooring',
              'geology'   => 'TIMELESS NATURAL FORMATS',
              'title'     => 'Natural Stone Tiles',
              'desc'      => 'Bring timeless elegance to floors, bathrooms, and outdoor living spaces with our natural stone tile collection. Available in a selection of patterns, sizes, and finishes to suit traditional and contemporary designs.',
              'formats'   => 'French Pattern Sets · 12"x24" · 24"x24" · 1.2 cm',
              'textures'  => 'Tumbled · Brushed · Honed · Pillowed Edge',
              'apps'      => 'Master Shower Enclosures · Foyer Flooring · Covered Loggias & Patios',
              'cta'       => 'Explore Tiles →',
            ),
          );

          foreach ( $families as $item ) :
            $cat_url  = add_query_arg( 'category', $item['family'], $colls_url );
            $card_img = grantrade_get_page_image_url( $gt_page_id, '_gt_img_family_' . $item['family'], $item['img'] );
            ?>
            <article class="liquid-stone-row" data-stone-type="<?php echo esc_attr( $item['type'] ); ?>" data-family="<?php echo esc_attr( $item['family'] ); ?>" data-card-img="<?php echo esc_url( $card_img ); ?>">
              <div class="liquid-stone-media">
                <div class="liquid-media-badges">
                  <span class="liquid-badge <?php echo esc_attr( $item['badge_cls'] ); ?>"><?php echo esc_html( $item['badge'] ); ?></span>
                </div>
                <img src="<?php echo esc_url( $card_img ); ?>" alt="<?php echo esc_attr( $item['alt'] ); ?>" loading="lazy" />
                <div class="liquid-card-glare"></div>
              </div>
              <div class="liquid-stone-info">
                <div class="liquid-geology-wrap">
                  <span class="liquid-glow-dot"></span>
                  <span class="liquid-geology"><?php echo esc_html( $item['geology'] ); ?></span>
                </div>
                <h3 class="liquid-stone-title"><?php echo esc_html( $item['title'] ); ?></h3>
                <p class="liquid-stone-desc"><?php echo esc_html( $item['desc'] ); ?></p>
                <div class="liquid-stone-details">
                  <div class="liquid-detail-item">
                    <span class="liquid-detail-label">Formats &amp; Thickness</span>
                    <span class="liquid-detail-value"><?php echo esc_html( $item['formats'] ); ?></span>
                  </div>
                  <div class="liquid-detail-item">
                    <span class="liquid-detail-label">Available Textures</span>
                    <span class="liquid-detail-value"><?php echo esc_html( $item['textures'] ); ?></span>
                  </div>
                  <div class="liquid-detail-item">
                    <span class="liquid-detail-label">Ideal Applications</span>
                    <span class="liquid-detail-value"><?php echo esc_html( $item['apps'] ); ?></span>
                  </div>
                </div>
                <div class="liquid-stone-actions">
                  <a href="<?php echo esc_url( $cat_url ); ?>" class="btn btn-primary"><?php echo esc_html( $item['cta'] ); ?></a>
                </div>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
      </div>
    </section>

    <!-- ================= LIQUID QUICK INSPECT POP-UP MODAL ================= -->
    <div id="liquidModal" class="liquid-modal-backdrop" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="liquidModalTitle">
      <div class="liquid-modal-dialog">
        <button id="liquidModalClose" class="liquid-modal-close" type="button" aria-label="Close dialog">&times;</button>
        <div class="liquid-modal-grid">
          <div class="liquid-modal-media">
            <img id="liquidModalImg" src="<?php echo esc_url( $theme_uri . '/assets/images/stone-types/quartzite.jpg' ); ?>" alt="Selected stone full slab preview" />
          </div>
          <div>
            <span id="liquidModalGeology" class="liquid-geology">THE ART OF NATURAL QUARTZITE</span>
            <h2 id="liquidModalTitle" style="font-family:var(--font-serif); font-size:2rem; margin-bottom:0.25rem;">Quartzite</h2>
            <div id="liquidModalOrigin" style="font-size:0.8rem; font-weight:600; color:var(--muted); margin-bottom:1rem;">Brazil (Bahia &amp; Espirito Santo)</div>
            <p id="liquidModalDesc" style="font-size:0.9rem; line-height:1.6; color:var(--ink-2); margin-bottom:1.25rem;">
              Nature's most resilient masterpiece. Metamorphosed under intense tectonic pressure from pure quartz sandstone.
            </p>

            <div class="liquid-modal-specs">
              <div class="liquid-modal-spec-item">
                <span class="liquid-modal-spec-lbl">Material Category</span>
                <span id="liquidModalCategory" class="liquid-modal-spec-val">Natural Metamorphic</span>
              </div>
              <div class="liquid-modal-spec-item">
                <span class="liquid-modal-spec-lbl">Warehouse Thickness</span>
                <span id="liquidModalThickness" class="liquid-modal-spec-val">3 cm Consecutive Slabs</span>
              </div>
              <div class="liquid-modal-spec-item">
                <span class="liquid-modal-spec-lbl">Available Finishes</span>
                <span id="liquidModalFinishes" class="liquid-modal-spec-val">Polished, Leathered, Honed</span>
              </div>
              <div class="liquid-modal-spec-item">
                <span class="liquid-modal-spec-lbl">Carlstadt, NJ Yard</span>
                <span id="liquidModalAvailability" class="liquid-modal-spec-val">In Stock · Ready for Inspection</span>
              </div>
            </div>

            <div style="font-size:0.82rem; margin-bottom:1.75rem;">
              <strong style="color:var(--ink); display:block; margin-bottom:0.25rem; text-transform:uppercase; font-size:0.72rem; letter-spacing:0.05em;">Best Applications:</strong>
              <span id="liquidModalApps" style="color:var(--ink-2);">Waterfall Islands · Backlit Walls · High-End Kitchen Countertops</span>
            </div>

            <div style="display:flex; gap:0.75rem; flex-wrap:wrap;">
              <a href="<?php echo esc_url( $contact_url ); ?>" class="btn btn-primary">Inquire About Consecutive Bundles</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ================= WHY GRAN TRADE (4 PILLARS) ================= -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">The Wholesale Advantage</span>
          <h2>Built for the trade, open to everyone</h2>
          <p>We work directly with quarries to provide Northeast fabricators, designers, and project managers with unmatched inventory reliability.</p>
        </div>

        <div class="why-grid">
          <div class="why-card">
            <div class="why-num">01</div>
            <h3>Acclaimed at the source</h3>
            <p>Our products come from premier global quarries widely acclaimed for slab clarity. Every ocean container is inspected at our Carlstadt warehouse upon arrival.</p>
          </div>
          <div class="why-card">
            <div class="why-num">02</div>
            <h3>Fully customizable choice</h3>
            <p>Pick from curated natural and engineered stone options — a range tailored to diverse architectural styles, high-traffic commercial spaces, and custom homes.</p>
          </div>
          <div class="why-card">
            <div class="why-num">03</div>
            <h3>Built to perform</h3>
            <p>Durable, cleanable, high-grade stone stocked deep in consecutive bundles so your fabricator can match veins and fulfill multi-room project requirements without batch variations.</p>
          </div>
          <div class="why-card">
            <div class="why-num">04</div>
            <h3>Service you can call</h3>
            <p>We take pride in our direct customer relations. Real stone specialists answer our phones, know the current rack locations, and coordinate seamless delivery logistics.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= APPLIED / FABRICATION VIGNETTE ================= -->
    <section class="section">
      <div class="container">
        <div class="applied-split">
          <div class="applied-media">
            <img src="<?php echo esc_url( $applied_img ); ?>" alt="<?php echo esc_attr( $applied_head ); ?>" loading="lazy" onerror="this.onerror=null; this.src='<?php echo esc_url( $theme_uri . '/assets/images/stone-types/granite.jpg' ); ?>';" />
          </div>

          <div class="applied-text">
            <span class="eyebrow"><?php echo esc_html( $applied_eye ); ?></span>
            <h2><?php echo esc_html( $applied_head ); ?></h2>
            <p class="lead">
              <?php echo esc_html( $applied_lead ); ?>
            </p>

            <div class="applied-features">
              <div class="applied-item">
                <div class="applied-item-icon">&#10003;</div>
                <div class="applied-item-text">
                  <h4>Fabricators</h4>
                  <p>Consistent 3 cm slab thickness, dense structural clarity, and verified resin quality slab after slab.</p>
                </div>
              </div>
              <div class="applied-item">
                <div class="applied-item-icon">&#10003;</div>
                <div class="applied-item-text">
                  <h4>Designers &amp; Architects</h4>
                  <p>Bookmatch sequential slabs from the same geological block for waterfall islands and full-height backsplashes.</p>
                </div>
              </div>
              <div class="applied-item">
                <div class="applied-item-icon">&#10003;</div>
                <div class="applied-item-text">
                  <h4>Homeowners</h4>
                  <p>You are welcome to walk the warehouse and tag your dream slab in person — bring your fabricator or borrow ours.</p>
                </div>
              </div>
            </div>

            <div style="margin-top:2.5rem;">
              <a href="<?php echo esc_url( $showroom_url ); ?>" class="btn btn-dark">Learn About Walking the Yard</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= YARD VISIT CTA BANNER ================= -->
    <section class="section" style="background-color: var(--surface); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line);">
      <div class="container yard-cta-bar">
        <div>
          <span class="eyebrow"><?php echo esc_html( $banner_eye ); ?></span>
          <h2 style="font-size:2.2rem; margin-bottom:0.5rem;"><?php echo esc_html( $banner_head ); ?></h2>
          <p style="max-width:580px;"><?php echo esc_html( $banner_text ); ?></p>
        </div>
        <div class="yard-cta-actions">
          <a href="<?php echo esc_url( $contact_url ); ?>" class="btn btn-primary">Check Hours &amp; Directions</a>
          <a href="tel:<?php echo esc_attr( preg_replace( '/\D+/', '', $phone_raw ) ); ?>" class="btn btn-secondary">Call the Yard: <?php echo esc_html( $phone_display ); ?></a>
        </div>
      </div>
    </section>

    <?php grantrade_render_page_extra_content(); ?>
  </main>

<?php get_footer(); ?>

