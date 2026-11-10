<?php
/**
 * Template Name: Collections Catalog
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( function_exists( 'grantrade_maybe_render_elementor_only' ) && grantrade_maybe_render_elementor_only() ) {
	return;
}
$gt_page_id    = (int) get_queried_object_id();
$coll_eyebrow  = grantrade_get_page_field( $gt_page_id, '_gt_page_eyebrow', '' );
$coll_heading  = grantrade_get_page_field( $gt_page_id, '_gt_page_heading', '' );
$coll_lead     = grantrade_get_page_field( $gt_page_id, '_gt_page_lead', '' );
$search_ph     = grantrade_get_page_field( $gt_page_id, '_gt_page_search_ph', 'Filter by stone variety, GT reference, lot code, quarry origin, 3 cm, or custom color tag...' );
$phone_display = grantrade_get_option( 'gt_phone_display', '(201) 438-1888' );
$phone_raw     = grantrade_get_option( 'gt_phone_raw', '2014381888' );
$catalog_mode  = grantrade_get_option( 'gt_catalog_mode', 'wp_only' );
$wp_stones     = function_exists( 'grantrade_get_wp_stones' ) ? grantrade_get_wp_stones() : array();
$tab_counts    = array(
	'all'       => 'wp_only' === $catalog_mode ? count( $wp_stones ) : 50,
	'quartzite' => 'wp_only' === $catalog_mode ? 0 : 8,
	'quartz'    => 'wp_only' === $catalog_mode ? 0 : 11,
	'granite'   => 'wp_only' === $catalog_mode ? 0 : 11,
	'marble'    => 'wp_only' === $catalog_mode ? 0 : 11,
	'monuments' => 'wp_only' === $catalog_mode ? 0 : 5,
	'soapstone' => 'wp_only' === $catalog_mode ? 0 : 2,
	'semi'      => 'wp_only' === $catalog_mode ? 0 : 1,
	'tile'      => 'wp_only' === $catalog_mode ? 0 : 1,
);
if ( 'wp_only' === $catalog_mode && ! empty( $wp_stones ) ) {
	foreach ( $wp_stones as $ws ) {
		$cat_key = $ws['category'] ?? '';
		if ( isset( $tab_counts[ $cat_key ] ) ) {
			$tab_counts[ $cat_key ]++;
		}
	}
}
get_header();
?>

  <main id="mainContent" class="section">
    <div class="container">
      <?php if ( $coll_heading || $coll_lead || $coll_eyebrow ) : ?>
        <div class="section-head center" style="margin-bottom:1.5rem;">
          <?php if ( $coll_eyebrow ) : ?><span class="eyebrow"><?php echo esc_html( $coll_eyebrow ); ?></span><?php endif; ?>
          <h1><?php echo esc_html( $coll_heading ? $coll_heading : 'Stone Collections' ); ?></h1>
          <?php if ( $coll_lead ) : ?><p class="lead" style="margin:0 auto;"><?php echo esc_html( $coll_lead ); ?></p><?php endif; ?>
        </div>
      <?php else : ?>
        <h1 class="visually-hidden">Stone Collections</h1>
      <?php endif; ?>
      <div class="catalog-search-hero">
        <form id="catalogSearchForm" class="search-hero-form" onsubmit="return false;">
          <div class="search-hero-box">
            <svg class="search-hero-icon" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
            </svg>
            <input type="search" id="catalogSearchHero" class="search-hero-input" placeholder="<?php echo esc_attr( $search_ph ); ?>" aria-label="Search slabs by stone name, GT number, lot number, or color tags" autocomplete="off" />
            <button type="button" id="searchHeroClearBtn" class="search-hero-clear" aria-label="Clear search" style="display:none;">&times;</button>
            <button type="submit" class="search-hero-submit" aria-label="Search inventory catalog">
              <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>
              </svg>
              <span>Search Catalog</span>
            </button>
          </div>
        </form>
      </div>

      <div class="coll-tabs" role="tablist" aria-label="Stone Family Categories">
        <button class="tab-btn" type="button" data-category="all" aria-pressed="true"><span>All Slabs</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['all'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="quartzite" aria-pressed="false"><span>Quartzite</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['quartzite'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="quartz" aria-pressed="false"><span>Quartz</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['quartz'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="granite" aria-pressed="false"><span>Granite</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['granite'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="marble" aria-pressed="false"><span>Marble</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['marble'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="monuments" aria-pressed="false"><span>Monuments</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['monuments'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="soapstone" aria-pressed="false"><span>Soapstone</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['soapstone'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="semi" aria-pressed="false"><span>Semi Precious</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['semi'] ); ?></span></button>
        <button class="tab-btn" type="button" data-category="tile" aria-pressed="false"><span>Tiles</span><span class="tab-count"><?php echo esc_html( (string) $tab_counts['tile'] ); ?></span></button>
      </div>

      <div class="filters-bar">
        <div class="filter-controls">
          <label class="visually-hidden" for="filterColor">Filter by color</label>
          <select id="filterColor" class="filter-select">
            <option value="all">Color: All Colors</option>
            <option value="blue">Blue / Teal</option>
            <option value="green">Green</option>
            <option value="white">White</option>
            <option value="grey">Grey</option>
            <option value="black">Black</option>
            <option value="gold">Gold / Amber</option>
            <option value="cream">Cream / Beige</option>
            <option value="brown">Brown</option>
            <option value="red">Red</option>
          </select>

          <label class="visually-hidden" for="filterType">Filter by stone type</label>
          <select id="filterType" class="filter-select">
            <option value="all">Type: Natural &amp; Engineered</option>
            <option value="natural">Natural Stone</option>
            <option value="engineered">Engineered Quartz</option>
          </select>

          <label class="visually-hidden" for="filterFinish">Filter by finish</label>
          <select id="filterFinish" class="filter-select">
            <option value="all">Finish: All Finishes</option>
            <option value="polished">Polished</option>
            <option value="leather">Leathered</option>
            <option value="honed">Honed</option>
          </select>

          <label class="visually-hidden" for="filterThickness">Filter by thickness</label>
          <select id="filterThickness" class="filter-select">
            <option value="all">Thickness: All</option>
            <option value="3">3 cm</option>
          </select>
        </div>

        <div style="display:flex; align-items:center; gap:0.75rem;">
          <label class="visually-hidden" for="sortBy">Sort catalog</label>
          <select id="sortBy" class="filter-select">
            <option value="featured">Sort: Featured First</option>
            <option value="name-az">Name: A to Z</option>
            <option value="name-za">Name: Z to A</option>
            <option value="gt-asc">GT Number: Low to High</option>
            <option value="thick-desc">Thickness: Thickest First</option>
            <option value="thick-asc">Thickness: Thinnest First</option>
            <option value="cat-az">Category: A to Z</option>
          </select>
        </div>
      </div>

      <div id="activeFiltersBar" class="active-filters-bar" style="display:none;">
        <span class="active-filters-label">Active Filters:</span>
        <div id="activeChipsList" style="display:flex; align-items:center; gap:0.4rem; flex-wrap:wrap;"></div>
        <button id="clearAllFiltersBtn" class="clear-all-filters-btn" type="button">Clear All Filters</button>
      </div>

      <div class="filter-meta-bar">
        <div id="collCount" class="result-count"><?php echo esc_html( (string) $tab_counts['all'] ); ?> Architectural Slabs Staged</div>
        <div class="filter-meta-controls" style="display:flex; align-items:center; gap:0.75rem; flex-wrap:wrap;">
          <div id="resultCount" style="font-size:0.85rem; color:var(--muted);"></div>

          <div class="view-mode-toggle" role="group" aria-label="Catalog View Mode">
            <button id="viewGridBtn" class="view-mode-btn active" type="button" aria-pressed="true" title="Grid View (Slab Visuals)">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>
              <span>Grid</span>
            </button>
            <button id="viewListBtn" class="view-mode-btn" type="button" aria-pressed="false" title="Manifest List View (Trade Specifications)">
              <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/></svg>
              <span>Manifest List</span>
            </button>
          </div>
        </div>
      </div>

      <div id="slabGrid" class="slab-grid" aria-label="Wholesale Stone Inventory">
        <div id="slabEmpty" class="empty-box" style="display:none; grid-column:1 / -1;">
          <h3>No stone slabs found</h3>
          <p>We couldn't find any stone slabs for your specific filter criteria. Try clearing some filters or search query.</p>
          <button id="resetFiltersBtn" class="btn btn-primary" type="button">Reset All Filters</button>
        </div>
      </div>
    </div>

    <section class="yard-advantage-strip">
      <div class="container">
        <div class="yard-adv-grid">
          <div class="yard-adv-card">
            <div class="yard-adv-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582"/></svg>
            </div>
            <h4>Quarry Direct Provenance</h4>
            <p>Block imports sourced straight from multi-generational quarries in Carrara, Bahia, Espírito Santo, and Rajasthan with zero intermediate broker markups.</p>
          </div>

          <div class="yard-adv-card">
            <div class="yard-adv-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6"/></svg>
            </div>
            <h4>Sequential Bundle Staging</h4>
            <p>Full consecutive bundles hoisted on request for bookmatched vein tracking, surface finish inspection, and daylight illumination review.</p>
          </div>

          <div class="yard-adv-card">
            <div class="yard-adv-icon">
              <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V4.5A2.25 2.25 0 0012 2.25H4.5A2.25 2.25 0 002.25 4.5v9.75M16.5 7.5h-2.25"/></svg>
            </div>
            <h4>Regional Fleet Logistics</h4>
            <p>Specialized boom-truck and flatbed transport delivering directly to fabrication workshops and commercial jobsites throughout NY, NJ, CT, and Eastern PA.</p>
          </div>
        </div>
      </div>
    </section>

    <?php grantrade_render_page_extra_content(); ?>
  </main>

<?php get_footer(); ?>

