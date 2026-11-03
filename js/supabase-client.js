/**
 * GRAN TRADE INC. — SUPABASE CLIENT & CLOUD SYNC MODULE
 * Integrates Cloud PostgreSQL database, media storage, auth, and offline fallback.
 */

(function (global) {
  "use strict";

  const STORAGE_KEY_URL = "grantrade_supabase_url";
  const STORAGE_KEY_KEY = "grantrade_supabase_key";

  let client = null;

  function getConfig() {
    const url = localStorage.getItem(STORAGE_KEY_URL) || (global.GRAN_TRADE_CONFIG && global.GRAN_TRADE_CONFIG.supabaseUrl) || "";
    const key = localStorage.getItem(STORAGE_KEY_KEY) || (global.GRAN_TRADE_CONFIG && global.GRAN_TRADE_CONFIG.supabaseKey) || "";
    return { url: url.trim(), key: key.trim() };
  }

  function setConfig(url, key) {
    if (url) localStorage.setItem(STORAGE_KEY_URL, url.trim());
    else localStorage.removeItem(STORAGE_KEY_URL);

    if (key) localStorage.setItem(STORAGE_KEY_KEY, key.trim());
    else localStorage.removeItem(STORAGE_KEY_KEY);

    client = null;
    return initClient();
  }

  function initClient() {
    if (client) return client;
    const { url, key } = getConfig();
    if (url && key && typeof global.supabase !== "undefined" && typeof global.supabase.createClient === "function") {
      try {
        client = global.supabase.createClient(url, key);
        return client;
      } catch (err) {
        console.warn("[GranTrade] Failed to initialize Supabase client:", err);
      }
    }
    return null;
  }

  const GranTradeDB = {
    getConfig: getConfig,
    setConfig: setConfig,
    isConnected: function () {
      return Boolean(initClient());
    },

    // ---------------- STONES CATALOG ----------------
    fetchStones: async function () {
      const sb = initClient();
      if (!sb) {
        // Fallback to local catalog
        return (global.GRAN_TRADE_CATALOG && global.GRAN_TRADE_CATALOG.all) || [];
      }

      try {
        const { data, error } = await sb
          .from("stones")
          .select("*")
          .order("created_at", { ascending: true });

        if (error) throw error;
        if (data && data.length > 0) {
          // Normalize column names to match local schema
          return data.map((row) => ({
            id: row.id,
            name: row.name,
            gtNumber: row.gt_number,
            lotNumber: row.lot_number,
            category: row.category,
            categoryLabel: row.category_label,
            type: row.type,
            typeLabel: row.type_label,
            finish: row.finish,
            thickness: row.thickness,
            size: row.size,
            origin: row.origin,
            colors: row.colors || [],
            colorLabel: row.color_label,
            application: row.application,
            description: row.description,
            image1: row.image1,
            image2: row.image2,
            inStock: row.in_stock,
            featured: row.featured,
          }));
        }
      } catch (err) {
        console.warn("[GranTrade] Error fetching stones from Supabase, using local catalog:", err);
      }
      return (global.GRAN_TRADE_CATALOG && global.GRAN_TRADE_CATALOG.all) || [];
    },

    saveStone: async function (stone) {
      const sb = initClient();
      if (!sb) throw new Error("Supabase is not configured. Please enter your Project URL and API Key in Settings.");

      const payload = {
        id: stone.id,
        name: stone.name,
        gt_number: stone.gtNumber,
        lot_number: stone.lotNumber,
        category: stone.category,
        category_label: stone.categoryLabel,
        type: stone.type || "natural",
        type_label: stone.typeLabel,
        finish: stone.finish,
        thickness: stone.thickness,
        size: stone.size,
        origin: stone.origin,
        colors: stone.colors || [],
        color_label: stone.colorLabel,
        application: stone.application,
        description: stone.description,
        image1: stone.image1,
        image2: stone.image2,
        in_stock: Boolean(stone.inStock !== false),
        featured: Boolean(stone.featured),
      };

      const { data, error } = await sb.from("stones").upsert(payload, { onConflict: "id" }).select();
      if (error) throw error;
      return data;
    },

    deleteStone: async function (id) {
      const sb = initClient();
      if (!sb) throw new Error("Supabase is not configured.");
      const { error } = await sb.from("stones").delete().eq("id", id);
      if (error) throw error;
      return true;
    },

    toggleStock: async function (id, inStock) {
      const sb = initClient();
      if (!sb) throw new Error("Supabase is not configured.");
      const { data, error } = await sb.from("stones").update({ in_stock: inStock }).eq("id", id).select();
      if (error) throw error;
      return data;
    },

    // ---------------- BULK SYNC ----------------
    syncLocalCatalogToCloud: async function () {
      const sb = initClient();
      if (!sb) throw new Error("Supabase is not configured.");
      const stones = (global.GRAN_TRADE_CATALOG && global.GRAN_TRADE_CATALOG.all) || [];
      if (!stones.length) throw new Error("No local stones found to sync.");

      const rows = stones.map((s) => ({
        id: s.id,
        name: s.name,
        gt_number: s.gtNumber,
        lot_number: s.lotNumber,
        category: s.category,
        category_label: s.categoryLabel,
        type: s.type || "natural",
        type_label: s.typeLabel,
        finish: s.finish,
        thickness: s.thickness,
        size: s.size,
        origin: s.origin,
        colors: s.colors || [],
        color_label: s.colorLabel,
        application: s.application,
        description: s.description,
        image1: s.image1,
        image2: s.image2,
        in_stock: Boolean(s.inStock !== false),
        featured: Boolean(s.featured),
      }));

      const { data, error } = await sb.from("stones").upsert(rows, { onConflict: "id" }).select();
      if (error) throw error;
      return data;
    },

    // ---------------- WHOLESALE INQUIRIES (LEAD CAPTURE) ----------------
    submitInquiry: async function (lead) {
      const sb = initClient();
      if (!sb) {
        console.warn("[GranTrade] Supabase not configured for leads, inquiry saved to local store.");
        const leads = JSON.parse(localStorage.getItem("grantrade_local_leads") || "[]");
        leads.unshift({ ...lead, id: "lead-" + Date.now(), created_at: new Date().toISOString(), status: "new" });
        localStorage.setItem("grantrade_local_leads", JSON.stringify(leads));
        return { success: true, offline: true };
      }

      const payload = {
        full_name: lead.name,
        company: lead.company || "",
        email: lead.email,
        phone: lead.phone || "",
        role: lead.role || "fabricator",
        stone_interest: lead.stone || "",
        message: lead.message,
        status: "new",
      };

      const { data, error } = await sb.from("inquiries").insert([payload]).select();
      if (error) throw error;
      return { success: true, data: data };
    },

    fetchInquiries: async function () {
      const sb = initClient();
      if (!sb) {
        return JSON.parse(localStorage.getItem("grantrade_local_leads") || "[]");
      }

      try {
        const { data, error } = await sb.from("inquiries").select("*").order("created_at", { ascending: false });
        if (error) throw error;
        return data || [];
      } catch (err) {
        console.warn("[GranTrade] Error fetching inquiries:", err);
        return JSON.parse(localStorage.getItem("grantrade_local_leads") || "[]");
      }
    },

    updateInquiryStatus: async function (id, status) {
      const sb = initClient();
      if (!sb) {
        const leads = JSON.parse(localStorage.getItem("grantrade_local_leads") || "[]");
        const idx = leads.findIndex((l) => l.id === id);
        if (idx !== -1) {
          leads[idx].status = status;
          localStorage.setItem("grantrade_local_leads", JSON.stringify(leads));
        }
        return true;
      }

      const { error } = await sb.from("inquiries").update({ status: status }).eq("id", id);
      if (error) throw error;
      return true;
    },

    // ---------------- MEDIA & STORAGE ----------------
    uploadMedia: async function (file, path) {
      const sb = initClient();
      if (!sb) throw new Error("Supabase is not configured.");

      const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9\._-]/g, "")}`;
      const fullPath = path ? `${path}/${filename}` : filename;

      const { data, error } = await sb.storage.from("stone-media").upload(fullPath, file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = sb.storage.from("stone-media").getPublicUrl(fullPath);
      return {
        path: fullPath,
        publicUrl: urlData.publicUrl,
        name: file.name,
        size: file.size,
      };
    },

    listMedia: async function () {
      const sb = initClient();
      if (!sb) return [];

      try {
        const { data, error } = await sb.storage.from("stone-media").list("", {
          limit: 100,
          offset: 0,
          sortBy: { column: "created_at", order: "desc" },
        });

        if (error) throw error;
        return (data || []).map((item) => {
          const { data: urlData } = sb.storage.from("stone-media").getPublicUrl(item.name);
          return {
            name: item.name,
            id: item.id,
            size: item.metadata ? item.metadata.size : 0,
            publicUrl: urlData.publicUrl,
            createdAt: item.created_at,
          };
        });
      } catch (err) {
        console.warn("[GranTrade] Error listing media:", err);
        return [];
      }
    },

    deleteMedia: async function (filename) {
      const sb = initClient();
      if (!sb) throw new Error("Supabase is not configured.");
      const { error } = await sb.storage.from("stone-media").remove([filename]);
      if (error) throw error;
      return true;
    },
  };

  // Auto-init on load
  initClient();

  global.GranTradeDB = GranTradeDB;
})(typeof window !== "undefined" ? window : this);
