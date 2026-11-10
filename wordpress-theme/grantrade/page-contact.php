<?php
/**
 * Template Name: Contact & Yard Hours
 *
 * @package GranTrade
 */
if (!defined('ABSPATH')) {
  exit;
}
if (function_exists('grantrade_maybe_render_elementor_only') && grantrade_maybe_render_elementor_only()) {
  return;
}
$gt_page_id = (int) get_queried_object_id();
$addr1 = grantrade_get_option('gt_address_line1', '178 Commerce Road');
$addr2 = grantrade_get_option('gt_address_line2', 'Carlstadt, NJ 07072');
$phone_display = grantrade_get_option('gt_phone_display', '(201) 438-1888');
$phone_raw = grantrade_get_option('gt_phone_raw', '2014381888');
$sales_email = grantrade_get_option('gt_sales_email', 'sales.grantrade@gmail.com');
$inquiry_email = grantrade_get_option('gt_inquiry_email', 'grantrade@gmail.com');
$colls_url = grantrade_get_page_url('collections');
$cnt_eyebrow = grantrade_get_page_field($gt_page_id, '_gt_page_eyebrow', 'Connect With Us');
$cnt_heading = grantrade_get_page_field($gt_page_id, '_gt_page_heading', 'Visit or contact our facility');
$cnt_lead = grantrade_get_page_field($gt_page_id, '_gt_page_lead', 'Direct wholesale supplier for stone fabricators, commercial contractors, interior designers');
$form_heading = grantrade_get_page_field($gt_page_id, '_gt_form_heading', 'Send a warehouse inquiry');
$form_lead = grantrade_get_page_field($gt_page_id, '_gt_form_lead', 'Need to confirm slab lot numbers, place a trade bundle hold, or arrange crane staging for your client walkthrough? Reach our warehouse team directly.');
$maps_url = grantrade_get_page_field($gt_page_id, '_gt_page_maps_url', 'https://maps.google.com/?q=178+Commerce+Road+Carlstadt+NJ+07072');
get_header();
?>

<main id="mainContent" class="section">
  <div class="container">
    <div class="section-head">
      <span class="eyebrow"><?php echo esc_html($cnt_eyebrow); ?></span>
      <h1><?php echo esc_html($cnt_heading); ?></h1>
      <p class="lead">
        <?php echo esc_html($cnt_lead); ?>
      </p>
    </div>

    <div class="contact-mobile-actions" aria-label="Quick Contact Actions">
      <a href="tel:<?php echo esc_attr(preg_replace('/\D+/', '', $phone_raw)); ?>" class="btn btn-secondary">Call Yard</a>
      <a href="<?php echo esc_url($maps_url); ?>" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">Directions</a>
      <a href="#inquiryFormCard" class="btn btn-primary">Send Inquiry</a>
    </div>

    <div class="contact-split">
      <div class="contact-info-panel">
        <div class="info-card">
          <div
            style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <h3 style="margin-bottom:0; border-bottom:none; padding-bottom:0;">Warehouse Hours</h3>
            <div class="open-indicator">
              <span class="open-dot"></span>
              <span class="open-text">Checking status...</span>
            </div>
          </div>

          <table id="hoursTable" class="hours-table">
            <tbody>
              <tr data-day="1">
                <td>Monday</td>
                <td>8:00 AM – 6:00 PM</td>
              </tr>
              <tr data-day="2">
                <td>Tuesday</td>
                <td>8:00 AM – 6:00 PM</td>
              </tr>
              <tr data-day="3">
                <td>Wednesday</td>
                <td>8:00 AM – 6:00 PM</td>
              </tr>
              <tr data-day="4">
                <td>Thursday</td>
                <td>8:00 AM – 6:00 PM</td>
              </tr>
              <tr data-day="5">
                <td>Friday</td>
                <td>8:00 AM – 6:00 PM</td>
              </tr>
              <tr data-day="6">
                <td>Saturday</td>
                <td>9:00 AM – 2:00 PM</td>
              </tr>
              <tr data-day="0">
                <td>Sunday</td>
                <td>10:00 AM – 2:00 PM</td>
              </tr>
            </tbody>
          </table>
          <p style="font-size:0.82rem; color:var(--muted); margin-top:1rem;">
            * No appointment needed for warehouse visits during standard operating hours.
          </p>
        </div>

        <div class="info-card">
          <h3>Facility Location</h3>
          <p style="font-size:1.05rem; font-weight:600; color:var(--ink); margin-bottom:0.35rem;">Gran Trade Inc.</p>
          <p style="margin-bottom:1.15rem;">
            <?php echo esc_html($addr1); ?><br />
            <?php echo esc_html($addr2); ?><br />
            Bergen County, New Jersey
          </p>
          <div class="contact-map-frame">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3018.856040817609!2d-74.06393312346007!3d40.83112563031437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2f8f3a4864b1f%3A0x6d95a20c3f75bdad!2sGran%20Trade%20Inc.!5e0!3m2!1sen!2sus!4v1794348581842!5m2!1sen!2sus"
              title="Gran Trade Inc. Carlstadt Warehouse Live Map"
              width="100%" height="300" style="border:0; display:block;" allowfullscreen="" loading="lazy"
              referrerpolicy="strict-origin-when-cross-origin"></iframe>
          </div>
          <a href="<?php echo esc_url($maps_url); ?>" target="_blank" rel="noopener noreferrer"
            class="btn btn-secondary btn-block">
            Open in Google Maps &rarr;
          </a>
        </div>

        <div class="info-card">
          <h3>Direct Phone Lines</h3>
          <div class="phone-list">
            <div>
              <div style="font-size:0.8rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">Main
                Reception / Yard Desk</div>
              <a href="tel:<?php echo esc_attr(preg_replace('/\D+/', '', $phone_raw)); ?>"
                class="phone-link"><?php echo esc_html($phone_display); ?></a>
            </div>
            <div>
              <div style="font-size:0.8rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">Direct
                Desk Lines</div>
              <div style="display:flex; flex-direction:column; gap:0.25rem; margin-top:0.2rem;">
                <a href="tel:2014389339" class="phone-link">(201) 438-9339</a>
                <a href="tel:2014388126" class="phone-link">(201) 438-8126</a>
              </div>
            </div>
            <div>
              <div style="font-size:0.8rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">Fax</div>
              <span class="phone-link" style="cursor:default;">(201) 438-1898</span>
            </div>
            <div style="margin-top:0.5rem;">
              <div style="font-size:0.8rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">Direct
                Sales Emails</div>
              <div style="display:flex; flex-direction:column; gap:0.25rem; margin-top:0.2rem;">
                <a href="mailto:<?php echo esc_attr($inquiry_email); ?>" class="phone-link"
                  style="font-size:0.95rem;"><?php echo esc_html($inquiry_email); ?></a>
                <?php if ( strtolower( trim( $sales_email ) ) !== strtolower( trim( $inquiry_email ) ) ) : ?>
                  <a href="mailto:<?php echo esc_attr($sales_email); ?>" class="phone-link"
                    style="font-size:0.95rem;"><?php echo esc_html($sales_email); ?></a>
                <?php endif; ?>
              </div>
            </div>
            <div style="margin-top:0.5rem;">
              <div style="font-size:0.8rem; color:var(--muted); text-transform:uppercase; letter-spacing:0.05em;">Follow &amp; Reviews</div>
              <?php if ( function_exists( 'grantrade_render_social_links' ) ) { echo grantrade_render_social_links(); } ?>
            </div>
          </div>
        </div>
      </div>

      <div id="inquiryFormCard" class="contact-form-card">
        <span class="eyebrow">Wholesale Inquiry</span>
        <h2 style="font-size:1.85rem; margin-bottom:0.5rem;"><?php echo esc_html($form_heading); ?></h2>
        <p style="margin-bottom:1.5rem; font-size:0.92rem; color:var(--ink-2);">
          <?php echo esc_html($form_lead); ?>
        </p>

        <?php
        $wpforms_id = absint(grantrade_get_page_field($gt_page_id, '_gt_wpforms_id', ''));
        if ($wpforms_id > 0 && shortcode_exists('wpforms')):
          echo do_shortcode('[wpforms id="' . $wpforms_id . '"]');
        else:
          ?>
          <form id="inquiryForm" action="https://formsubmit.co/<?php echo esc_attr($inquiry_email); ?>" method="POST">
            <div style="display:none;" aria-hidden="true">
              <label>Leave blank: <input name="bot_field" tabindex="-1" autocomplete="off" /></label>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="fullName">Full Name *</label>
                <input class="form-input" type="text" id="fullName" name="fullName" required />
              </div>

              <div class="form-group">
                <label class="form-label" for="companyName">Company / Fabricator Name</label>
                <input class="form-input" type="text" id="companyName" name="companyName" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="email">Email Address *</label>
                <input class="form-input" type="email" id="email" name="email" required />
                <small class="form-helper-note">Genuine email required for reply.</small>
              </div>

              <div class="form-group">
                <label class="form-label" for="phone">Phone Number *</label>
                <input class="form-input" type="tel" id="phone" name="phone" required />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="inquiryType">Inquiry Type *</label>
              <select class="form-select" id="inquiryType" name="inquiryType" required>
                <option value="hold">Check Slab Availability &amp; Place Hold</option>
                <option value="staging">Plan Crane Staging for Client Visit</option>
                <option value="trade-account">Fabricator / Trade Account Application</option>
                <option value="monuments">Civic / Headstone Monument Inventory</option>
                <option value="general">General Stone Specification Question</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="stonesOfInterest">Stones of Interest / Bundle Numbers</label>
              <input class="form-input" type="text" id="stonesOfInterest" name="stonesOfInterest" />
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Project Details / Inquiry Message *</label>
              <textarea class="form-textarea" id="message" name="message" maxlength="3000" required></textarea>
            </div>

            <?php
            $form_token = function_exists('grantrade_create_form_token') ? grantrade_create_form_token() : '';
            ?>
            <input type="hidden" name="_gt_form_token" id="gtFormToken" value="<?php echo esc_attr($form_token); ?>" />

            <div id="inquiryFormError" role="alert"
              style="display:none; background:#fcf0f1; border:1px solid #d63638; color:#8a2424; padding:0.75rem 1rem; border-radius:var(--radius-sm); font-size:0.88rem; margin-bottom:1rem;">
            </div>

            <button type="submit" class="btn btn-primary btn-block">Send Warehouse Inquiry</button>

            <p class="form-privacy-note">
              <strong>Wholesale Trade Note:</strong> Gran Trade Inc. is a slab distributor. We supply un-cut slabs to
              certified fabricators. Fabrication, cutting, edge profiling, and installation pricing is provided by your
              fabricator.
            </p>
          </form>
        <?php endif; ?>
      </div>
    </div>

    <?php grantrade_render_page_extra_content(); ?>
  </div>
</main>

<script>
  (function () {
    const form = document.getElementById("inquiryForm");
    if (!form) return;

    const guard = window.GranTradeContactGuard;
    const env = window.GRAN_TRADE_ENV || {};
    const TARGET_EMAIL = env.inquiryEmail || "<?php echo esc_js($inquiry_email); ?>";
    const COLLECTIONS_URL = "<?php echo esc_js($colls_url); ?>";
    const errorBox = document.getElementById("inquiryFormError");

    function showError(msg) {
      if (!errorBox) return;
      errorBox.textContent = msg;
      errorBox.style.display = "block";
    }

    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = "";
      errorBox.style.display = "none";
    }

    guard.prefillFromQuery();

    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      clearError();
      const submitBtn = form.querySelector("button[type='submit']");
      const originalBtnText = submitBtn ? submitBtn.textContent : "Send Warehouse Inquiry";

      const typeSelect = document.getElementById("inquiryType");
      const typeLabel = typeSelect ? typeSelect.selectedOptions[0]?.text : "Wholesale Stone Inquiry";
      const payload = {
        name: document.getElementById("fullName").value.trim(),
        company: document.getElementById("companyName").value.trim() || "Individual / Homeowner",
        email: document.getElementById("email").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        role: typeSelect ? typeSelect.value : "general",
        roleLabel: typeLabel,
        stone: document.getElementById("stonesOfInterest").value.trim() || "Full Catalog Inquiry",
        message: document.getElementById("message").value.trim(),
        botField: (form.querySelector("input[name='bot_field']")?.value || "").trim(),
        formToken: (document.getElementById("gtFormToken")?.value || "").trim()
      };

      const emailCheck = guard.validateGenuineEmail(payload.email);
      if (!emailCheck.ok) {
        showError(emailCheck.reason);
        document.getElementById("email")?.focus();
        return;
      }
      payload.email = emailCheck.email;

      if ([payload.name, payload.company, payload.email, payload.phone, payload.stone, payload.message].some(guard.hasUnsafePayload)) {
        showError("Your message contains blocked HTML/script syntax. Please use plain text.");
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending Inquiry to Sales Desk...";
      }

      // 1. Primary: Submit via WordPress admin-ajax.php (stores Yard Inquiry CPT + genuine email firewall + wp_mail)
      let wpOk = false;
      let wpMailSent = false;
      if (env.ajaxUrl && env.nonce) {
        try {
          const fd = new FormData();
          fd.append("action", "grantrade_submit_inquiry");
          fd.append("nonce", env.nonce);
          fd.append("fullName", payload.name);
          fd.append("companyName", payload.company);
          fd.append("email", payload.email);
          fd.append("phone", payload.phone);
          fd.append("inquiryType", payload.roleLabel);
          fd.append("stonesOfInterest", payload.stone);
          fd.append("message", payload.message);
          fd.append("bot_field", payload.botField);
          fd.append("_gt_form_token", payload.formToken);

          const res = await fetch(env.ajaxUrl, { method: "POST", body: fd });
          const json = await res.json();
          if (!res.ok || !json || !json.success) {
            const serverMsg = (json && json.data && json.data.message) ? json.data.message : "Could not verify inquiry submission. Please enter a genuine email and try again.";
            showError(serverMsg);
            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalBtnText;
            }
            return;
          }
          wpOk = true;
          wpMailSent = Boolean(json.data && json.data.mailSent);
        } catch (_) { }
      }

      // 2. Fallback email relay via FormSubmit if PHP wp_mail() was unable to send
      let relaySent = false;
      if (!wpMailSent && !payload.botField) {
        try {
          const fsRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(TARGET_EMAIL)}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
            },
            body: JSON.stringify({
              _subject: `Wholesale Stone Inquiry: ${payload.stone} — ${payload.name}`,
              _template: "table",
              _captcha: "false",
              _replyto: payload.email,
              "Customer Name": payload.name,
              "Company / Fabricator": payload.company,
              "Email Address": payload.email,
              "Phone Number": payload.phone,
              "Inquiry Type": payload.roleLabel,
              "Slabs of Interest": payload.stone,
              "Project Details / Message": payload.message
            })
          });
          relaySent = fsRes.ok;
        } catch (_) { }
      }

      const directMailtoUrl = guard.buildMailtoUrl(TARGET_EMAIL, payload);

      form.innerHTML = `
          <div style="background:var(--teal-light); border:1px solid var(--teal); border-radius:var(--radius-md); padding:2.25rem 2rem; text-align:center;">
            <svg style="width:52px; height:52px; color:var(--teal); margin:0 auto 1.25rem; display:block;" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="eyebrow" style="color:var(--teal); margin-bottom:0.25rem;">${(wpMailSent || relaySent || wpOk) ? "Saved & Dispatched" : "Inquiry Prepared"}</span>
            <h3 style="font-family:var(--font-serif); font-size:1.65rem; margin-bottom:0.5rem; color:var(--ink);">Inquiry Received</h3>
            <p style="color:var(--ink-2); font-size:0.95rem; max-width:480px; margin:0 auto 1.5rem; line-height:1.55;">
              Thank you, <strong>${guard.escapeHtml(payload.name)}</strong>. Your inquiry regarding <em>${guard.escapeHtml(payload.stone)}</em> has been routed to our sales desk (${guard.escapeHtml(TARGET_EMAIL)}). Replies will be sent to <strong>${guard.escapeHtml(payload.email)}</strong>.
            </p>
            <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap; margin-top:1.25rem;">
              <a href="${guard.escapeHtml(COLLECTIONS_URL)}" class="btn btn-primary">Browse More Slabs &rarr;</a>
              <a href="${guard.escapeHtml(directMailtoUrl)}" class="btn btn-secondary">Open in Email Client</a>
            </div>
          </div>
        `;
    });
  })();
</script>

<?php get_footer(); ?>