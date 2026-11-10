#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
THEME_DIR="$ROOT_DIR/wordpress-theme/grantrade"
ZIP_PATH="$ROOT_DIR/wordpress-theme/grantrade.zip"

echo "Syncing shared assets into WordPress theme: $THEME_DIR"

mkdir -p "$THEME_DIR/css" "$THEME_DIR/js" "$THEME_DIR/assets" "$THEME_DIR/data"

# 1. Sync public 5-way CSS
cp "$ROOT_DIR/css/base.css" "$THEME_DIR/css/"
cp "$ROOT_DIR/css/layout.css" "$THEME_DIR/css/"
cp "$ROOT_DIR/css/components.css" "$THEME_DIR/css/"
cp "$ROOT_DIR/css/pages.css" "$THEME_DIR/css/"
cp "$ROOT_DIR/css/responsive.css" "$THEME_DIR/css/"

# 2. Sync public JS modules
cp "$ROOT_DIR/js/stone-catalog-data.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/wp-compat.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/nav.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/contact-guard.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/favorites.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/tabs.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/filters.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/viewer.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/stone-types.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/homepage-loader.js" "$THEME_DIR/js/"
cp "$ROOT_DIR/js/slab-detail.js" "$THEME_DIR/js/"

# 3. Sync images and data
rm -rf "$THEME_DIR/assets" "$THEME_DIR/data"
cp -R "$ROOT_DIR/assets" "$THEME_DIR/assets"
cp -R "$ROOT_DIR/data" "$THEME_DIR/data"

# 4. Build upload-ready WordPress theme zip (grantrade/ at zip root)
rm -f "$ZIP_PATH"
(
  cd "$ROOT_DIR/wordpress-theme"
  zip -rq "$ZIP_PATH" grantrade -x "*/.DS_Store"
)

echo "Built WordPress theme archive: $ZIP_PATH"
ls -lh "$ZIP_PATH"

