/**
 * Gran Trade WordPress Admin Interactive Controls
 * - Unified WP Media Library Picker for Picture fields
 * - Color Tag Preset Chips for Stone Slabs
 * - Built-in WP CodeMirror initializer for File Manager & Custom CSS/JS
 */
(function ($) {
  "use strict";

  function normalizeColorTokens(raw) {
    return String(raw || "")
      .split(/[,;|/]+/)
      .map(function (item) {
        return item.trim().toLowerCase();
      })
      .filter(Boolean);
  }

  function updatePreview(container, url) {
    var preview = container.querySelector(".gt-media-preview");
    if (!preview) return;
    var img = preview.querySelector("img");
    var cleanUrl = (url || "").trim();
    if (!cleanUrl) {
      preview.classList.add("is-empty");
      if (img) img.removeAttribute("src");
      return;
    }
    preview.classList.remove("is-empty");
    if (img) img.setAttribute("src", cleanUrl);
  }

  function initMediaPickers() {
    var fields = document.querySelectorAll("[data-gt-media-field]");
    fields.forEach(function (container) {
      var input = container.querySelector("input[data-gt-media-input]");
      var idInput = container.querySelector("input[data-gt-media-id]");
      var uploadBtn = container.querySelector("[data-gt-media-upload]");
      var clearBtn = container.querySelector("[data-gt-media-clear]");
      if (!input) return;

      input.addEventListener("input", function () {
        if (idInput) idInput.value = "";
        updatePreview(container, input.value);
      });

      if (clearBtn) {
        clearBtn.addEventListener("click", function (e) {
          e.preventDefault();
          input.value = "";
          if (idInput) idInput.value = "";
          updatePreview(container, "");
        });
      }

      if (uploadBtn && window.wp && window.wp.media) {
        uploadBtn.addEventListener("click", function (e) {
          e.preventDefault();
          var frame = window.wp.media({
            title: uploadBtn.getAttribute("data-title") || "Select or Upload Picture",
            button: { text: uploadBtn.getAttribute("data-button") || "Use Picture" },
            library: { type: "image" },
            multiple: false
          });

          frame.on("select", function () {
            var selection = frame.state().get("selection").first();
            if (!selection) return;
            var data = selection.toJSON();
            if (data && data.url) {
              input.value = data.url;
              if (idInput && data.id) {
                idInput.value = String(data.id);
              }
              updatePreview(container, data.url);
              input.dispatchEvent(new Event("change", { bubbles: true }));
            }
          });

          frame.open();
        });
      }
    });
  }

  function initColorChips() {
    var input = document.getElementById("gt_colors");
    var chipWrap = document.querySelector("[data-gt-color-chips]");
    var customInput = document.getElementById("gtCustomColorName");
    var customHex = document.getElementById("gtCustomColorHex");
    var addBtn = document.getElementById("gtAddCustomColorBtn");
    var mapField = document.getElementById("gtCustomColorMap");
    if (!input || !chipWrap) return;

    var customMap = {};

    function formatLabel(tok) {
      return String(tok || "").replace(/\b\w/g, function (c) { return c.toUpperCase(); });
    }

    function ensureChipButton(token, hexColor) {
      var existing = null;
      chipWrap.querySelectorAll("[data-gt-color-preset]").forEach(function (btn) {
        if ((btn.getAttribute("data-gt-color-preset") || "").toLowerCase() === token) {
          existing = btn;
        }
      });
      if (existing) {
        if (hexColor) {
          var dot = existing.querySelector(".gt-color-dot");
          if (dot) dot.style.background = hexColor;
        }
        return existing;
      }

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gt-preset-chip";
      btn.setAttribute("data-gt-color-preset", token);

      var dotEl = document.createElement("span");
      dotEl.className = "gt-color-dot";
      dotEl.style.background = hexColor || "#8b929a";

      var labelEl = document.createElement("span");
      labelEl.textContent = formatLabel(token);

      btn.appendChild(dotEl);
      btn.appendChild(labelEl);
      chipWrap.appendChild(btn);
      return btn;
    }

    function syncActiveChips() {
      var active = normalizeColorTokens(input.value);
      active.forEach(function (tok) {
        ensureChipButton(tok, customMap[tok]);
      });
      chipWrap.querySelectorAll("[data-gt-color-preset]").forEach(function (btn) {
        var token = (btn.getAttribute("data-gt-color-preset") || "").toLowerCase();
        btn.classList.toggle("is-active", active.indexOf(token) !== -1);
      });
    }

    function addCustomColorTag() {
      if (!customInput) return;
      var raw = (customInput.value || "").trim().toLowerCase().replace(/\s+/g, " ");
      if (!raw) return;
      var hexVal = (customHex && customHex.value) ? customHex.value : "#8b929a";
      var newTokens = normalizeColorTokens(raw);
      if (!newTokens.length) return;
      var current = normalizeColorTokens(input.value);
      newTokens.forEach(function (tok) {
        customMap[tok] = hexVal;
        ensureChipButton(tok, hexVal);
        if (current.indexOf(tok) === -1) {
          current.push(tok);
        }
      });
      input.value = current.join(", ");
      if (mapField) {
        mapField.value = JSON.stringify(customMap);
      }
      customInput.value = "";
      syncActiveChips();
    }

    if (addBtn) {
      addBtn.addEventListener("click", function (e) {
        e.preventDefault();
        addCustomColorTag();
      });
    }
    if (customInput) {
      customInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          addCustomColorTag();
        }
      });
    }

    chipWrap.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-gt-color-preset]");
      if (!btn) return;
      e.preventDefault();
      var token = (btn.getAttribute("data-gt-color-preset") || "").toLowerCase();
      var current = normalizeColorTokens(input.value);
      var idx = current.indexOf(token);
      if (idx === -1) {
        current.push(token);
      } else {
        current.splice(idx, 1);
      }
      input.value = current.join(", ");
      syncActiveChips();
    });

    input.addEventListener("input", syncActiveChips);
    syncActiveChips();
  }

  function initCodeEditors() {
    if (!window.wp || !window.wp.codeEditor || !window.grantradeAdminData || !window.grantradeAdminData.codeEditors) {
      return;
    }

    var instances = [];
    document.querySelectorAll("textarea[data-gt-code-editor]").forEach(function (textarea) {
      var modeKey = textarea.getAttribute("data-gt-code-editor");
      var settings = window.grantradeAdminData.codeEditors[modeKey] || window.grantradeAdminData.codeEditors.default;
      if (!settings) return;
      try {
        var editor = window.wp.codeEditor.initialize(textarea, settings);
        if (editor && editor.codemirror) {
          instances.push(editor.codemirror);
        }
      } catch (err) {
        // Leave plain textarea intact if CodeMirror cannot initialize cleanly.
      }
    });

    if (instances.length > 0) {
      document.addEventListener("submit", function () {
        instances.forEach(function (cm) {
          if (typeof cm.save === "function") cm.save();
        });
      });
    }
  }

  $(function () {
    initMediaPickers();
    initColorChips();
    initCodeEditors();
  });
})(window.jQuery || function (fn) {
  if (document.readyState !== "loading") fn();
  else document.addEventListener("DOMContentLoaded", fn);
});

