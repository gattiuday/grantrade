<?php
/**
 * Shared Slab Detail Viewer Partial
 *
 * @package GranTrade
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$theme_uri     = get_template_directory_uri();
$home_url      = grantrade_get_page_url( 'home' );
$colls_url     = grantrade_get_page_url( 'collections' );
$contact_url   = grantrade_get_page_url( 'contact' );
$addr1         = grantrade_get_option( 'gt_address_line1', '178 Commerce Road' );
$addr2         = grantrade_get_option( 'gt_address_line2', 'Carlstadt, NJ 07072' );
$phone_display = grantrade_get_option( 'gt_phone_display', '(201) 438-1888' );
$phone_raw     = grantrade_get_option( 'gt_phone_raw', '2014381888' );
?>
  <style>
    .slab-detail-section { padding-top: clamp(2rem, 3.5vw, 3.5rem); padding-bottom: clamp(3.5rem, 5vw, 6rem); }
    .breadcrumbs { display: flex; align-items: center; flex-wrap: wrap; gap: 0.5rem; font-size: 0.85rem; color: var(--muted); margin-bottom: 2rem; }
    .breadcrumbs a { color: var(--muted); text-decoration: none; transition: color var(--transition-fast); }
    .breadcrumbs a:hover { color: var(--accent); }
    .breadcrumbs .crumb-sep { color: var(--line); user-select: none; }
    .breadcrumbs .crumb-current { color: var(--ink); font-weight: 600; }
    .slab-hero-grid { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: clamp(2rem, 3.5vw, 3.5rem); align-items: start; margin-bottom: 4rem; }
    .slab-post-viewer { display: flex; flex-direction: column; gap: 1.25rem; min-width: 0; max-width: 100%; }
    .stage-controls-overlay { position: absolute; top: 1rem; right: 1rem; display: inline-flex; align-items: center; gap: 0.35rem; background: rgba(22, 18, 14, 0.88); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); padding: 0.35rem 0.5rem; border-radius: var(--radius-pill); border: 1px solid rgba(255, 255, 255, 0.16); box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35); z-index: 10; }
    .stage-ctrl-btn { background: transparent; border: none; color: #ffffff; font-family: inherit; font-size: 0.78rem; font-weight: 600; padding: 0.4rem 0.75rem; border-radius: var(--radius-pill); cursor: pointer; display: inline-flex; align-items: center; gap: 0.35rem; transition: all var(--transition-fast); user-select: none; white-space: nowrap; }
    .stage-ctrl-btn * { pointer-events: none; }
    .stage-ctrl-btn:hover { background: rgba(255, 255, 255, 0.2); color: #ffffff; }
    .stage-ctrl-btn.highlight { background: var(--accent); color: #ffffff; }
    .stage-ctrl-btn.highlight:hover { background: #c99718; }
    .stage-ctrl-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .stage-nav-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(22, 18, 14, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 9; backdrop-filter: blur(6px); transition: all var(--transition-fast); opacity: 0.85; }
    .stage-nav-arrow:hover { background: var(--accent); border-color: var(--accent); opacity: 1; transform: translateY(-50%) scale(1.08); }
    .stage-prev { left: 1rem; }
    .stage-next { right: 1rem; }
    .post-stage { position: relative; background-color: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); min-height: 480px; display: flex; align-items: center; justify-content: center; }
    .stage-single { width: 100%; height: 100%; position: relative; aspect-ratio: 16 / 11; max-height: 560px; overflow: hidden; cursor: zoom-in; user-select: none; -webkit-user-select: none; touch-action: pan-y; }
    .stage-single.is-zoomed { cursor: grab; touch-action: none; }
    .stage-single.grabbing { cursor: grabbing !important; }
    .stage-single img { width: 100%; height: 100%; object-fit: cover; display: block; transform-origin: center center; transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; will-change: transform; }
    .post-stage:fullscreen, .post-stage:-webkit-full-screen, .post-stage.is-fallback-fullscreen { position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important; width: 100vw !important; height: 100vh !important; max-height: 100vh !important; border-radius: 0 !important; border: none !important; background-color: #0b0908 !important; display: flex !important; align-items: center !important; justify-content: center !important; z-index: 999999 !important; margin: 0 !important; }
    .post-stage:fullscreen img, .post-stage:-webkit-full-screen img, .post-stage.is-fallback-fullscreen img { max-width: 96vw; max-height: 92vh; object-fit: contain; }
    .post-stage:fullscreen .stage-controls-overlay, .post-stage:-webkit-full-screen .stage-controls-overlay, .post-stage.is-fallback-fullscreen .stage-controls-overlay { top: 1.5rem; right: 1.5rem; z-index: 1000000; }
    .post-stage:fullscreen .stage-tag, .post-stage:-webkit-full-screen .stage-tag, .post-stage.is-fallback-fullscreen .stage-tag { top: 1.5rem; left: 1.5rem; z-index: 1000000; }
    .post-stage:fullscreen .stage-nav-arrow, .post-stage:-webkit-full-screen .stage-nav-arrow, .post-stage.is-fallback-fullscreen .stage-nav-arrow { z-index: 1000000; }
    .stage-tag { position: absolute; top: 1.25rem; left: 1.25rem; background-color: rgba(22, 18, 14, 0.85); color: #ffffff; padding: 0.4rem 0.85rem; border-radius: var(--radius-pill); font-size: 0.78rem; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; backdrop-filter: blur(8px); z-index: 2; }
    .post-thumbs { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .thumb-btn { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; background-color: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-md); cursor: pointer; text-align: left; font-family: inherit; transition: all var(--transition-fast); }
    .thumb-btn:hover { border-color: var(--accent); }
    .thumb-btn.active { border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent); background-color: var(--bg); }
    .thumb-btn img { width: 72px; height: 54px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--line); flex-shrink: 0; }
    .thumb-info { display: flex; flex-direction: column; gap: 0.2rem; }
    .thumb-num { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--accent); }
    .thumb-label { font-size: 0.85rem; font-weight: 600; color: var(--ink); }
    .slab-details-card { background-color: var(--surface); border: 1px solid var(--line); border-radius: var(--radius-lg); padding: clamp(1.75rem, 3vw, 2.5rem); box-shadow: var(--shadow-sm); display: flex; flex-direction: column; gap: 1.75rem; min-width: 0; max-width: 100%; }
    .slab-header-block { border-bottom: 1px solid var(--line); padding-bottom: 1.25rem; }
    .slab-eyebrow-row { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-bottom: 0.5rem; }
    .slab-cat-badge { font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--accent); }
    .slab-title { font-family: var(--font-serif); font-size: clamp(2rem, 3vw, 2.5rem); line-height: 1.15; color: var(--ink); margin: 0; }
    .specs-callout-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background-color: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 1.25rem; }
    .spec-block { display: flex; flex-direction: column; gap: 0.25rem; }
    .spec-block .label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
    .spec-block .value { font-size: 1.05rem; font-weight: 700; color: var(--ink); font-feature-settings: "tnum"; overflow-wrap: anywhere; }
    .spec-block .value.highlight { color: var(--accent); font-family: var(--font-serif); font-size: 1.25rem; }
    .specs-list-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
    .specs-list-table tr { border-bottom: 1px solid var(--line); }
    .specs-list-table tr:last-child { border-bottom: none; }
    .specs-list-table th { text-align: left; padding: 0.65rem 0.5rem 0.65rem 0; color: var(--muted); font-weight: 500; width: 42%; }
    .specs-list-table td { padding: 0.65rem 0; color: var(--ink); font-weight: 600; text-align: right; overflow-wrap: anywhere; }
    .slab-desc-text { font-size: 0.95rem; line-height: 1.6; color: var(--ink-2); border-top: 1px solid var(--line); padding-top: 1.25rem; }
    .slab-actions { display: flex; flex-direction: column; gap: 0.75rem; padding-top: 0.5rem; }
    .action-btn-row { display: flex; gap: 0.75rem; }
    .warehouse-direct-note { display: flex; align-items: center; gap: 0.75rem; background-color: var(--bg); border: 1px solid var(--line); border-radius: var(--radius-md); padding: 0.85rem 1rem; font-size: 0.82rem; color: var(--muted); }
    .warehouse-direct-note strong { color: var(--ink); }
    .related-section { margin-top: 4rem; padding-top: 3.5rem; border-top: 1px solid var(--line); }
    .related-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem; margin-bottom: 2rem; }
    @media (max-width: 960px) {
      .slab-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 1.5rem; margin-bottom: 2.5rem; }
      .post-stage { min-height: 320px; }
    }
    @media (max-width: 768px) {
      .breadcrumbs { gap: 0.1rem 0.35rem; font-size: 0.82rem; }
      .breadcrumbs a { min-height: 44px; min-width: 44px; display: inline-flex; align-items: center; padding: 0.15rem 0.1rem; }
      .stage-tag { top: 0.75rem; left: 0.75rem; max-width: calc(100% - 1.5rem); font-size: 0.7rem; padding: 0.32rem 0.7rem; }
      .stage-controls-overlay { top: auto; bottom: 0.75rem; left: 50%; right: auto; transform: translateX(-50%); max-width: calc(100% - 1.5rem); justify-content: center; }
      .stage-ctrl-btn { min-height: 40px; padding: 0.4rem 0.65rem; }
    }
    @media (max-width: 640px) {
      .slab-detail-section { padding-top: 1.25rem; padding-bottom: 2.75rem; }
      .post-stage { min-height: 240px; }
      .stage-single { aspect-ratio: 4 / 3; max-height: 420px; }
      .slab-search-bar-wrap { width: 100%; margin-left: 0; }
      .slab-search-form { width: 100%; min-height: 46px; }
      .slab-search-form input { width: 100%; flex: 1; min-width: 0; font-size: 16px; }
      .slab-search-form .btn { min-height: 40px; }
      .slab-details-card { padding: 1.25rem; gap: 1.25rem; }
      .specs-callout-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.85rem; padding: 1rem; }
      .post-thumbs { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.6rem; }
      .thumb-btn { flex-direction: column; align-items: flex-start; gap: 0.45rem; padding: 0.5rem; min-width: 0; min-height: 44px; }
      .thumb-btn img { width: 100%; height: 68px; }
      .action-btn-row { flex-direction: column; }
      .related-head .btn { width: 100%; }
    }
    @media (max-width: 340px) {
      .specs-callout-grid { grid-template-columns: minmax(0, 1fr); }
    }
    @media (max-width: 520px) {
      #zoomInBtn span, #zoomOutBtn span, #fsText { display: none; }
      .stage-ctrl-btn { min-width: 40px; min-height: 40px; padding: 0.4rem 0.55rem; justify-content: center; }
      .stage-nav-arrow { width: 40px; height: 40px; }
      .stage-prev { left: 0.5rem; }
      .stage-next { right: 0.5rem; }
    }
  </style>

  <main id="mainContent" class="slab-detail-section">
    <div class="container">
      <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:1rem; margin-bottom:2rem;">
        <nav class="breadcrumbs" aria-label="Breadcrumb Navigation" style="margin-bottom:0;">
          <a href="<?php echo esc_url( $home_url ); ?>">Home</a>
          <span class="crumb-sep">&rsaquo;</span>
          <a href="<?php echo esc_url( $colls_url ); ?>">Collections</a>
          <span class="crumb-sep">&rsaquo;</span>
          <a href="<?php echo esc_url( $colls_url ); ?>" id="crumbCategory">All Stones</a>
          <span class="crumb-sep">&rsaquo;</span>
          <span class="crumb-current" id="crumbStoneName">Slab Inspection</span>
        </nav>

        <div class="slab-search-bar-wrap">
          <?php
          $colls_parts = wp_parse_url( $colls_url );
          $colls_action = ! empty( $colls_parts['path'] ) ? $colls_parts['path'] : $colls_url;
          $colls_query_params = array();
          if ( ! empty( $colls_parts['query'] ) ) {
            parse_str( $colls_parts['query'], $colls_query_params );
          }
          ?>
          <form class="slab-search-form" action="<?php echo esc_url( $colls_action ); ?>" method="get">
            <?php foreach ( $colls_query_params as $param_k => $param_v ) : ?>
              <input type="hidden" name="<?php echo esc_attr( $param_k ); ?>" value="<?php echo esc_attr( $param_v ); ?>" />
            <?php endforeach; ?>
            <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/></svg>
            <input type="search" name="q" placeholder="Search slabs, GT#, lot#, tags..." aria-label="Search catalog" autocomplete="off" />
            <button type="submit" class="btn btn-sm btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div class="slab-hero-grid">
        <div class="slab-post-viewer">
          <div id="mainStageSingle" class="post-stage stage-single" title="Drag to pan · Double-click to zoom · Scroll to zoom · Pinch on mobile">
            <span id="stageTag" class="stage-tag">Picture 1 · Full Slab Upright View</span>

            <div class="stage-controls-overlay" role="toolbar" aria-label="Image Zoom and Fullscreen Controls">
              <button id="zoomInBtn" class="stage-ctrl-btn" type="button" title="Zoom In (+ / =)" aria-label="Zoom in">
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>
                <span>Zoom In</span>
              </button>
              <button id="zoomOutBtn" class="stage-ctrl-btn" type="button" title="Zoom Out (-)" aria-label="Zoom out" disabled>
                <svg width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>
                <span>Zoom Out</span>
              </button>
              <button id="zoomResetBtn" class="stage-ctrl-btn" type="button" title="Reset Zoom to 100% (0 / R)" aria-label="Reset zoom">
                <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"/></svg>
                <span id="zoomLevelText">100%</span>
              </button>
              <button id="fullscreenBtn" class="stage-ctrl-btn highlight" type="button" title="Full Screen View (Esc to exit)" aria-label="Toggle full screen">
                <svg id="fsIconExpand" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"/></svg>
                <svg id="fsIconCompress" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24" style="display:none;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"/></svg>
                <span id="fsText">Full Screen</span>
              </button>
            </div>

            <button id="stagePrevBtn" class="stage-nav-arrow stage-prev" type="button" aria-label="Previous picture">
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/></svg>
            </button>
            <button id="stageNextBtn" class="stage-nav-arrow stage-next" type="button" aria-label="Next picture">
              <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/></svg>
            </button>

            <img id="mainStageImg" src="<?php echo esc_url( $theme_uri . '/assets/images/aquamarine-slab-1.jpg' ); ?>" alt="Slab Full View" loading="eager" />
          </div>

          <div class="post-thumbs">
            <button id="thumb1" class="thumb-btn active" type="button">
              <img id="thumbImg1" src="<?php echo esc_url( $theme_uri . '/assets/images/aquamarine-slab-1.jpg' ); ?>" alt="Picture 1 Thumbnail" />
              <div class="thumb-info">
                <span class="thumb-num">Picture 1</span>
                <span class="thumb-label">Full Slab A-Frame</span>
              </div>
            </button>
            <button id="thumb2" class="thumb-btn" type="button">
              <img id="thumbImg2" src="<?php echo esc_url( $theme_uri . '/assets/images/aquamarine-slab-2.jpg' ); ?>" alt="Picture 2 Thumbnail" />
              <div class="thumb-info">
                <span class="thumb-num">Picture 2</span>
                <span class="thumb-label">Vein &amp; Mineral Detail</span>
              </div>
            </button>
          </div>
        </div>

        <div class="slab-details-card">
          <div class="slab-header-block">
            <div class="slab-eyebrow-row">
              <span id="slabCatBadge" class="slab-cat-badge">Quartzite</span>
            </div>
            <h1 id="slabName" class="slab-title">Aquamarine Quartzite</h1>
          </div>

          <div class="specs-callout-grid">
            <div class="spec-block">
              <span class="label">GT Number</span>
              <span id="specGtNumber" class="value highlight">&mdash;</span>
            </div>
            <div class="spec-block">
              <span class="label">Lot Code</span>
              <span id="specLotNumber" class="value highlight">#59108</span>
            </div>
            <div class="spec-block">
              <span class="label">Thickness</span>
              <span id="specThickness" class="value">3 cm</span>
            </div>
            <div class="spec-block">
              <span class="label">Dimensions</span>
              <span id="specSize" class="value">128" × 76" · 67.5 sq. ft.</span>
            </div>
          </div>

          <table class="specs-list-table">
            <tbody>
              <tr>
                <th>Surface Finish</th>
                <td id="specFinish">Polished</td>
              </tr>
              <tr>
                <th>Material Class</th>
                <td id="specType">Natural Metamorphic Stone</td>
              </tr>
            </tbody>
          </table>

          <div class="slab-desc-text">
            <p id="slabDesc"></p>
          </div>
        </div>
      </div>

      <section class="related-section">
        <div class="related-head">
          <div>
            <span class="eyebrow" id="relatedEyebrow">Stone Family</span>
            <h2 id="relatedTitle">Related Slabs</h2>
          </div>
          <a href="<?php echo esc_url( $colls_url ); ?>" class="btn btn-secondary">Back to Full Catalog &rarr;</a>
        </div>
        <div id="relatedGrid" class="slab-grid"></div>
      </section>
    </div>
  </main>

