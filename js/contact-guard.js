/**
 * Gran Trade Genuine Email & Contact Form Security Helper
 * Shared across static contact.html and WordPress page-contact.php.
 */
(function (global) {
  "use strict";

  var BLOCKED_DOMAINS = {
    // Reserved / placeholder / test domains
    "example.com": true,
    "example.org": true,
    "example.net": true,
    "example.edu": true,
    "test.com": true,
    "test.org": true,
    "test.net": true,
    "invalid.com": true,
    "fake.com": true,
    "fake.org": true,
    "localhost": true,
    "domain.com": true,
    "email.com": true,
    // Common disposable / burner / throwaway mail providers
    "mailinator.com": true,
    "mailinator.net": true,
    "mailinator.org": true,
    "guerrillamail.com": true,
    "guerrillamail.net": true,
    "guerrillamail.org": true,
    "guerrillamail.biz": true,
    "guerrillamailblock.com": true,
    "sharklasers.com": true,
    "grr.la": true,
    "tempmail.com": true,
    "tempmail.net": true,
    "temp-mail.org": true,
    "temp-mail.io": true,
    "temp-mail.ru": true,
    "10minutemail.com": true,
    "10minutemail.net": true,
    "10minutemail.org": true,
    "yopmail.com": true,
    "yopmail.fr": true,
    "yopmail.net": true,
    "trashmail.com": true,
    "trashmail.net": true,
    "getnada.com": true,
    "nada.email": true,
    "throwawaymail.com": true,
    "maildrop.cc": true,
    "fakeinbox.com": true,
    "mintemail.com": true,
    "dispostable.com": true,
    "mohmal.com": true,
    "emailondeck.com": true,
    "burnermail.io": true,
    "mailnesia.com": true,
    "spamgourmet.com": true,
    "mytemp.email": true,
    "tempr.email": true,
    "mailcatch.com": true,
    "trbvm.com": true,
    "tempinbox.com": true,
    "discard.email": true,
    "mailnull.com": true,
    "incognitomail.org": true,
    "tempail.com": true
  };

  var BLOCKED_LOCALS = {
    "noreply": true,
    "no-reply": true,
    "donotreply": true,
    "do-not-reply": true,
    "mailer-daemon": true,
    "postmaster": true,
    "nobody": true,
    "fake": true,
    "spam": true,
    "trash": true,
    "dummy": true,
    "asdf": true,
    "qwerty": true,
    "123456": true
  };

  function escapeHtml(str) {
    return String(str || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function hasUnsafePayload(text) {
    return /<\s*script\b|<\?(?:php|=)?|\b(?:javascript|vbscript)\s*:|data\s*:\s*text\/html|\bon(?:load|error|click|mouseover|focus|blur|submit|input)\s*=|\b(?:eval|base64_decode|shell_exec|passthru)\s*\(/i.test(
      String(text || "")
    );
  }

  function isBlockedDomain(domain) {
    if (!domain) return true;
    if (BLOCKED_DOMAINS[domain]) return true;
    var parts = domain.split(".");
    for (var i = 1; i < parts.length; i++) {
      var parent = parts.slice(i).join(".");
      if (BLOCKED_DOMAINS[parent]) return true;
    }
    return false;
  }

  function validateGenuineEmail(rawEmail) {
    var clean = String(rawEmail || "").trim();
    if (!clean) {
      return { ok: false, reason: "Please enter your email address." };
    }
    if (clean.length > 160 || /[\r\n\s<>]/.test(clean) || hasUnsafePayload(clean)) {
      return { ok: false, reason: "Please enter a valid email address without spaces or special script characters." };
    }

    var match = /^([A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,24})$/.exec(clean);
    if (!match) {
      return { ok: false, reason: "Please enter a genuine email address (for example, name@company.com or name@gmail.com)." };
    }

    var local = match[1].toLowerCase();
    var domain = match[2].toLowerCase();

    if (
      local.charAt(0) === "." ||
      local.charAt(local.length - 1) === "." ||
      local.indexOf("..") !== -1 ||
      domain.charAt(0) === "." ||
      domain.charAt(0) === "-" ||
      domain.charAt(domain.length - 1) === "-" ||
      domain.indexOf("..") !== -1
    ) {
      return { ok: false, reason: "Please check the spelling of your email address." };
    }

    if (isBlockedDomain(domain)) {
      return {
        ok: false,
        reason: "Please use a genuine business or personal email address (temporary, disposable, or example addresses are not accepted)."
      };
    }

    var domainLabel = domain.split(".")[0];
    if (BLOCKED_LOCALS[local] || (local === "test" && (domainLabel === "test" || domainLabel === "demo" || domainLabel === "fake"))) {
      return {
        ok: false,
        reason: "Please provide a real personal or company email address so our sales team can reply."
      };
    }

    return { ok: true, email: clean };
  }

  function prefillFromQuery() {
    try {
      var urlParams = new URLSearchParams(global.location.search);
      var paramStone = (urlParams.get("stone") || urlParams.get("slab") || "").slice(0, 120);
      var paramGt = (urlParams.get("gt") || "").slice(0, 40);
      var paramType = (urlParams.get("type") || "").slice(0, 40);

      if (paramStone && !hasUnsafePayload(paramStone)) {
        var stoneInput = document.getElementById("stonesOfInterest");
        if (stoneInput) {
          stoneInput.value = paramGt ? paramStone + " (" + paramGt + ")" : paramStone;
        }
        var typeSelect = document.getElementById("inquiryType");
        if (typeSelect) {
          typeSelect.value = "hold";
        }
      } else if (paramType) {
        var sel = document.getElementById("inquiryType");
        if (sel && Array.from(sel.options).some(function (o) { return o.value === paramType; })) {
          sel.value = paramType;
        }
      }
    } catch (_) {}
  }

  function buildMailtoUrl(targetEmail, payload) {
    var mailtoSub = encodeURIComponent("Stone Inquiry: " + payload.stone + " \u2014 " + payload.name);
    var bodyLines = [
      "Hello Gran Trade Sales Team,",
      "",
      "I have submitted the following inquiry through your website:",
      "",
      "\u2022 Full Name: " + payload.name,
      "\u2022 Company: " + payload.company,
      "\u2022 Email: " + payload.email,
      "\u2022 Phone: " + payload.phone,
      "\u2022 Inquiry Type: " + payload.roleLabel,
      "\u2022 Stone(s) of Interest: " + payload.stone,
      "",
      "Project Details:",
      payload.message,
      ""
    ];
    if (payload.timestamp) {
      bodyLines.push("Submitted: " + payload.timestamp);
    }
    var mailtoBody = encodeURIComponent(bodyLines.join("\n"));
    return "mailto:" + encodeURIComponent(targetEmail) + "?subject=" + mailtoSub + "&body=" + mailtoBody;
  }

  global.GranTradeContactGuard = {
    escapeHtml: escapeHtml,
    hasUnsafePayload: hasUnsafePayload,
    validateGenuineEmail: validateGenuineEmail,
    prefillFromQuery: prefillFromQuery,
    buildMailtoUrl: buildMailtoUrl
  };
})(window);

