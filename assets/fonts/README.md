# Fonts Directory

This directory is designated for custom and self-hosted web fonts (`.woff2`, `.woff`, `.ttf`).

### Current Fonts Loaded:
The project currently imports the following optimized web fonts via Google Fonts in `assets/css/globals.css`:
- **DM Sans** (weights: 400, 500, 600, 700)
- **Google Sans Flex** (weights: 400, 500, 600, 700)
- **Poppins** (weights: 400, 700)

### To Self-Host Fonts:
1. Place font binary files (`.woff2`) directly in this directory (`assets/fonts/`).
2. Add `@font-face` definitions in `assets/css/globals.css` using `url('../fonts/<font-file>.woff2') format('woff2')`.
