# Hearth — Shopify OS 2.0 Theme

A custom Shopify OS 2.0 theme for premium hearths and fireplaces. Built from scratch with warm earth-tone palette, Cormorant Garamond typography, and full Theme Editor customisation.

## Features

- **11 custom sections** — hero, marquee, featured collection, split feature, rich text, testimonials, image banner, product main, collection main, cart main, page main
- **5 templates** — index, product, collection, cart, page (all OS 2.0 JSON)
- **Global theme settings** — colours, typography, layout, header, footer, social, favicon
- **Sticky transparent-over-hero header** with IntersectionObserver auto-switching
- **Mobile drawer nav** with sub-menu support and ARIA-compliant toggles
- **Variant-aware product page** — colour swatches, size pills, sticky ATC bar, accordion details
- **Native filter/sort** on collection pages (`collection.filters` API)
- **AJAX cart updates** with quantity stepper, remove animation, debounced order note
- **Product recommendations** upsell on cart page
- **Newsletter signup** via native `form 'customer'` (no third party required)
- **Performance** — Google Fonts loaded with `media="print" onload="this.media='all'"` pattern, no render blocking
- **Accessibility** — skip link, ARIA labels throughout, keyboard navigation, `prefers-reduced-motion` respected

## Folder structure

```
hearth-theme/
├── config/
│   └── settings_schema.json       # Global theme settings
├── layout/
│   └── theme.liquid               # Master layout: header, footer, global CSS/JS
├── sections/
│   ├── hero.liquid
│   ├── marquee-strip.liquid
│   ├── featured-collection.liquid
│   ├── split-feature.liquid
│   ├── rich-text.liquid
│   ├── testimonials.liquid
│   ├── image-banner.liquid
│   ├── product-main.liquid
│   ├── collection-main.liquid
│   ├── cart-main.liquid
│   └── page-main.liquid
└── templates/
    ├── index.json
    ├── product.json
    ├── collection.json
    ├── cart.json
    └── page.json
```

## Brand palette

| Token | Value | Usage |
|---|---|---|
| `--color-accent` | `#8C6A48` | Eyebrows, icons, underlines, active states |
| `--color-accent-light` | `#C9A87A` | Dark backgrounds, sticky bars |
| `--color-bg` | `#FAF8F5` | Primary background |
| `--color-bg-2` | `#F2EDE6` | Secondary background |
| `--color-bg-dark` | `#1C1410` | Dark sections |
| `--color-text` | `#1C1410` | Body text |
| `--color-text-muted` | `#6B5B4E` | Secondary text |
| `--color-border` | `#E4DAD0` | Borders, dividers |

## Typography

- **Display font:** Cormorant Garamond (300, 400, 500, italic 300/400)
- **Loaded via:** Google Fonts CDN with performance-safe `media="print"` pattern

## Installation

### Method 1 — Upload via Shopify Admin

1. Zip the theme folder so `config/`, `layout/`, `sections/`, `templates/` sit at the **top level** of the zip (not nested inside another folder)
2. Shopify Admin → Online Store → Themes → Add theme → Upload zip file
3. Once uploaded, click "Customize" to start editing in the Theme Editor

### Method 2 — Push via Shopify CLI

```bash
shopify theme push --store your-store.myshopify.com
```

## Customisation

All theme-wide settings live in `config/settings_schema.json` and are accessible in the Theme Editor under **Theme settings**:

- **Colours** — brand, backgrounds, text, buttons
- **Typography** — base font size, heading scale, nav letter spacing
- **Layout** — max page width, vertical section spacing
- **Header** — logo, menu, sticky/transparent behaviour, announcement bar
- **Footer** — tagline, three nav columns, newsletter, legal text
- **Social** — Instagram, Facebook, Pinterest, TikTok, YouTube, X/Twitter
- **Favicon**

Every section has its own colour scheme picker (light, dark, warm, charcoal where applicable) and spacing controls.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge — last 2 versions). Uses `IntersectionObserver`, CSS custom properties, CSS Grid, `aspect-ratio`. No IE11 support.

## License

Custom theme — all rights reserved.
