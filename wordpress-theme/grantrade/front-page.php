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
$tax_eyebrow   = grantrade_get_page_field( $gt_page_id, '_gt_tax_eyebrow', 'Wholesale Material Taxonomy' );
$tax_heading   = grantrade_get_page_field( $gt_page_id, '_gt_tax_heading', 'The Types of Stone We Carry' );
$tax_lead      = grantrade_get_page_field( $gt_page_id, '_gt_tax_lead', 'Direct from premier quarries across Brazil, Italy, India, and the United States to our Carlstadt, NJ warehouse. Scroll down through our vertical liquid flow catalog to inspect geological formation, natural veining, and architectural applications.' );
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
              'geology'   => 'Metamorphic Quartz Sandstone',
              'title'     => 'Quartzite',
              'desc'      => 'Nature\'s ultimate metamorphic masterpiece. Born from pure quartz sandstone recrystallized under colossal tectonic pressure, quartzite pairs the ethereal crystalline luminescence of fine marble with extraordinary mineral density. Naturally impervious to etching from wine or citrus juices, knife scratches, and daily kitchen wear.',
              'formats'   => '3 cm Bookmatched Consecutive Bundles',
              'textures'  => 'Polished Mirror · Leathered Satin · Honed Velvet',
              'apps'      => 'Waterfall Kitchen Islands · Backlit Feature Walls · Luxury Vanities',
              'popular'   => 'Taj Mahal · Aquamarine Quartzite · Cristallo · Perla Venata',
              'cta'       => 'Browse Quartzite →',
            ),
            array(
              'family'    => 'marble',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Italy (Carrara) & Greece',
              'img'       => 'assets/images/stone-types/marble.jpg',
              'alt'       => 'Italian Arabescato Carrara marble slab with brecciated veining',
              'geology'   => 'Metamorphic Recrystallized Limestone',
              'title'     => 'Marble',
              'desc'      => 'The timeless benchmark of classical and contemporary luxury architecture. Quarried from the renowned Apuan Alps of Tuscany, imported natural marble showcases dramatic brecciated veining, subtle translucency, and cool tactile stone warmth. Consecutive sequence bundles enable mirrored bookmatched fireplace mantels and island showpieces.',
              'formats'   => '3 cm Full Slabs',
              'textures'  => 'Polished High Gloss · Honed Matte · Satin Silk',
              'apps'      => 'Showcase Kitchen Islands · Master En-Suites · Fireplace Surrounds',
              'popular'   => 'Arabescato · Calacatta Monet · Statuario · Carrara Gioia',
              'cta'       => 'Browse Marble →',
            ),
            array(
              'family'    => 'granite',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Brazil, India & Norway',
              'img'       => 'assets/images/stone-types/granite.jpg',
              'alt'       => 'Black Forest granite architectural installation',
              'geology'   => 'Igneous Intrusive Magma',
              'title'     => 'Granite',
              'desc'      => 'Pure volcanic fortitude formed by molten magma slowly crystallizing miles beneath the continental crust. Interlocked quartz, feldspar, and mica crystals produce unmatched structural strength, deep chromatic depth, and enduring resilience against heavy culinary prep, outdoor UV exposure, and all-weather cycles.',
              'formats'   => '3 cm Heavy-Duty Slabs',
              'textures'  => 'Polished · Leathered Tactile · Flamed · Honed',
              'apps'      => 'Chef\'s Working Kitchens · Outdoor BBQ Islands · Commercial Bars',
              'popular'   => 'Black Forest · Steel Grey · Blue Pearl · Titanium Black',
              'cta'       => 'Browse Granite →',
            ),
            array(
              'family'    => 'quartz',
              'type'      => 'engineered',
              'badge_cls' => 'engineered',
              'badge'     => 'Engineered Surfacing',
              'origin'    => 'USA & Global Surfacing',
              'img'       => 'assets/images/stone-types/quartz.jpg',
              'alt'       => 'Calacatta quartz countertop with mitered waterfall edge',
              'geology'   => '93% Pure Quartz Composite',
              'title'     => 'Quartz',
              'desc'      => 'Advanced architectural surfacing engineered for contemporary family living and high-traffic commercial environments. Composed of 93% pure crushed natural quartz crystal fused with advanced polymer resins. Zero porosity ensures liquids and oils never penetrate, requiring zero sealing or chemical conditioning over its lifespan.',
              'formats'   => 'Jumbo Slabs (63" x 128") · 3 cm',
              'textures'  => 'High Polish Brilliant · Soft Touch Matte (Honed)',
              'apps'      => 'Modern Family Kitchens · Multi-Unit Developments · Hospitality Suites',
              'popular'   => 'Calacatta Alps · Versilia · Calacatta Gold · Pure Arctic White',
              'cta'       => 'Browse Quartz →',
            ),
            array(
              'family'    => 'soapstone',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Stone',
              'origin'    => 'Brazil & Virginia, USA',
              'img'       => 'assets/images/stone-types/soapstone.jpg',
              'alt'       => 'Soapstone matte artisanal kitchen surface with organic veining',
              'geology'   => 'Metamorphic Steatite Talc Rock',
              'title'     => 'Soapstone',
              'desc'      => 'An authentic artisanal heritage stone prized for its silky, velvety tactile touch. Naturally non-porous and chemically inert, making it completely impervious to lemon juice, vinegar, red wine, and harsh acids without requiring sealers. Gradually develops an organic, rich charcoal patina when seasoned with food-safe mineral oil.',
              'formats'   => '3 cm Heavy Architectural Slabs',
              'textures'  => 'Honed Silky Matte',
              'apps'      => 'Artisanal & Farmhouse Kitchens · Fireplace Hearths · Chemistry Benches',
              'popular'   => 'Churchill Soapstone · Barroca Black · Mariana Grey',
              'cta'       => 'Browse Soapstone →',
            ),
            array(
              'family'    => 'semi',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Gemstone Slab',
              'origin'    => 'Brazil & Madagascar',
              'img'       => 'assets/images/stone-types/semi-precious.jpg',
              'alt'       => 'Illuminated blue agate semi precious stone architectural feature',
              'geology'   => 'Handcrafted Natural Agate & Crystal Geode',
              'title'     => 'Semi Precious',
              'desc'      => 'The apex of architectural opulence and lapidary mastery. Skilled artisans hand-select and assemble individual cross-sections of genuine translucent agate, petrified wood, and crystal geode. Designed specifically for dramatic rear-illumination with LED light panels to produce glowing, jewel-like feature installations.',
              'formats'   => '2 cm Solid & Reinforced Composite Slabs',
              'textures'  => 'Mirror Polished Gemstone Surface',
              'apps'      => 'Backlit Luxury Cocktail Bars · Powder Room Statement Walls · VIP Foyers',
              'popular'   => 'Blue Agate · Wild Agate · Amethyst · Crystal Quartz',
              'cta'       => 'Browse Semi Precious →',
            ),
            array(
              'family'    => 'monuments',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Structural Granite',
              'origin'    => 'North America & India',
              'img'       => 'assets/images/stone-types/monuments.jpg',
              'alt'       => 'Wholesale structural granite blocks and monument blanks in distribution yard',
              'geology'   => 'Certified Structural Granite',
              'title'     => 'Monuments',
              'desc'      => 'Certified structural-grade natural granites quarried for multi-generational outdoor permanence. Dense, uniform crystalline matrix withstands severe Northeastern freeze-thaw cycles, heavy precipitation, and atmospheric weathering without surface degradation. Provides high contrast for diamond sandblasting and precision laser engraving.',
              'formats'   => 'Custom Architectural Blanks · Bases · Dies · Slants',
              'textures'  => 'Polished Face · Rock Pitch · Thermal Stipple',
              'apps'      => 'Civic Memorials · Public Plazas · Architectural Historic Markers',
              'popular'   => 'Barre Gray · Jet Black · American Black · GT Memorial Blanks',
              'cta'       => 'Browse Monuments →',
            ),
            array(
              'family'    => 'tile',
              'type'      => 'natural',
              'badge_cls' => 'natural',
              'badge'     => 'Natural Formats',
              'origin'    => 'Italy & Turkey',
              'img'       => 'assets/images/stone-types/tile.jpg',
              'alt'       => 'Seamless luxury Mediterranean villa French-pattern travertine stone tile flooring',
              'geology'   => 'Travertine & Natural Marble Formats',
              'title'     => 'Tiles',
              'desc'      => 'Precision-finished natural stone tiles crafted to provide seamless aesthetic continuity across interior floors, bathrooms, and exterior living spaces. Available in interlocking French patterns, large-format rectangles, and modular squares. Tumbled, brushed, and honed textures deliver timeless warmth with safe foot traction.',
              'formats'   => 'French Pattern Sets · 12"x24" · 24"x24" · 1.2 cm',
              'textures'  => 'Tumbled · Brushed · Honed · Pillowed Edge',
              'apps'      => 'Master Shower Enclosures · Foyer Flooring · Covered Loggias & Patios',
              'popular'   => 'French Pattern Travertine · Honed Carrara Tile · Quartzite Pavers',
              'cta'       => 'Browse Tiles →',
            ),
          );

          foreach ( $families as $item ) :
            $cat_url = add_query_arg( 'category', $item['family'], $colls_url );
            ?>
            <article class="liquid-stone-row" data-stone-type="<?php echo esc_attr( $item['type'] ); ?>" data-family="<?php echo esc_attr( $item['family'] ); ?>">
              <div class="liquid-stone-media">
                <div class="liquid-media-badges">
                  <span class="liquid-badge <?php echo esc_attr( $item['badge_cls'] ); ?>"><?php echo esc_html( $item['badge'] ); ?></span>
                </div>
                <img src="<?php echo esc_url( $theme_uri . '/' . $item['img'] ); ?>" alt="<?php echo esc_attr( $item['alt'] ); ?>" loading="lazy" />
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
                  <div class="liquid-detail-item">
                    <span class="liquid-detail-label">Popular On The Racks</span>
                    <span class="liquid-detail-value"><?php echo esc_html( $item['popular'] ); ?></span>
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
            <span id="liquidModalGeology" class="liquid-geology">Metamorphic Quartz Sandstone</span>
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
            <p>Pick from 60+ curated natural and engineered stone options — a range tailored to diverse architectural styles, high-traffic commercial spaces, and custom homes.</p>
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

