# Gran Trade Inc. — WordPress Theme Installation & Guide

The Gran Trade website is packaged as a standalone, responsive **WordPress Theme** (`wordpress-theme/grantrade/` and `wordpress-theme/grantrade.zip`) while keeping the original static site (`index.html`, `collections.html`, etc.) fully intact.

---

## 1. Install in WordPress (Upload Theme Zip)

1. Log into your **WordPress Admin Dashboard** (`/wp-admin`).
2. Navigate to **Appearance -> Themes -> Add New -> Upload Theme**.
3. Upload `wordpress-theme/grantrade.zip` and click **Install Now**.
4. Click **Activate**.

### What Happens Automatically on Activation
On theme activation (`after_switch_theme`), the theme automatically:
- Creates any missing core pages (**Home**, **About Us**, **Collections**, **Showroom & Yard**, **Contact Us**, **Slab Inspection**) with their assigned templates.
- Configures **Home** as the static front page (`show_on_front`).
- Creates and assigns the **Gran Trade Primary** menu in **Primary Navigation** (you can edit it anytime under **Appearance -> Menus**).
- Registers the **Stone Families** taxonomy (`quartzite`, `quartz`, `granite`, `marble`, `monuments`, `soapstone`, `semi`, `tile`).

*(If you installed via FTP/SFTP by copying `wordpress-theme/grantrade` into `wp-content/themes/grantrade`, simply activate the theme from **Appearance -> Themes** to trigger setup, then go to **Settings -> Permalinks** and click **Save Changes** if needed.)*

---

## 2. Managing Content & Inventory in WordPress

### Customizer Settings (**Appearance -> Customize -> Gran Trade — Warehouse & Hero**)
Update without touching code:
- Hero tagline badge, main headline, and lead paragraph
- Warehouse street address, city/state/ZIP, phone number, sales email, and hours strip
- **Stone Catalog Source**:
  - **Built-in 50 Stones + WordPress Stone Slabs** (default): keeps all 50 built-in slabs live immediately and merges any slabs added in WordPress Admin.
  - **WordPress Stone Slabs CPT Only**: displays only slabs published under **Stone Slabs** in WordPress Admin.

### Adding or Editing Slabs (**Stone Slabs -> Add New**)
- Title: Stone name (e.g., *Taj Mahal Quartzite*)
- Featured Image: Picture 1 (Full Slab A-Frame view)
- Description / Excerpt: Architectural & geological overview
- **Stone Families**: Select category (`Exotic Quartzite`, `Fine Marble`, etc.)
- **Gran Trade Slab Specifications** meta box: GT Number, Lot Number, Calibrated Thickness, Net Slab Dimensions, Surface Finish, Quarry Origin, Material Type, Filter Colors, Applications, Close-Up Picture 2 URL, and In-Stock flag.

### Contact Form & Yard Inquiries (**Yard Inquiries**)
- Submitting the Contact Us form sends an email via `wp_mail()` to your configured sales email AND stores a private record under **Yard Inquiries** in WordPress Admin.

---

## 3. Syncing Shared CSS / JS / Assets After Code Changes

The static site and WordPress theme share the exact same `css/`, `js/`, `assets/`, and `data/` files. After editing shared stylesheets, scripts, or images in the repository root, run:

```bash
bash scripts/sync-wp-theme.sh
```

This refreshes `wordpress-theme/grantrade/` and rebuilds `wordpress-theme/grantrade.zip`.

