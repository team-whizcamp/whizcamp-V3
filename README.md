# Whizcamp LLC - Web Platform (V3)

A modern, responsive, and high-performance digital web platform for Whizcamp LLC, built with clean semantic HTML5, modular CSS architecture, and performant vanilla JavaScript.

---

## 📁 Project Structure

The project follows industry-standard front-end web architecture:

```text
whizcamp-V3/
├── index.html                    # Main entry point (Homepage)
├── README.md                     # Project documentation & guidelines
├── assets/                       # Static production assets
│   ├── css/                      # Modular stylesheets
│   │   ├── globals.css           # Global resets, typography, and base variables
│   │   ├── home.css              # Dedicated homepage layout & component styling
│   │   ├── responsive.css        # Responsive engine (desktop 100vw, tablet/mobile scale)
│   │   └── pages/                # Stylesheets for subpages
│   │       └── page.css          # Shared layout & UI components for inner pages
│   ├── js/                       # Modular JavaScript
│   │   ├── main.js               # Application entry point & initialization
│   │   └── modules/              # Reusable interactive components
│   │       └── accordion.js      # Accessible Services Accordion module
│   ├── images/                   # Raster images (.png, .jpg, .webp)
│   │   └── [58 image assets]     # Banners, project mockups, avatars, cards
│   ├── icons/                    # Vector icons & decorative SVGs (.svg)
│   │   └── [25 icon assets]      # Logos, arrows, badges, vector lines
│   └── fonts/                    # Web font declarations & self-hosted fonts
│       └── README.md             # Font loading & self-hosting instructions
├── pages/                        # Multi-page application views
│   ├── services.html             # Capabilities & technology offerings
│   ├── about.html                # Mission, vision, and company background
│   ├── contact.html              # Consultation booking & contact inquiry form
│   ├── blog.html                 # Technical perspectives, insights & articles
│   └── README.md                 # Guidelines for creating additional pages
└── workspace/                    # Project specifications & change tracking
    ├── CHANGELOG.md              # Historical version changelog
    ├── CODER.md                  # Development notes
    ├── DATABASE.md               # Data dictionary & schemas
    ├── SOUL.md                   # Brand guidelines & identity
    └── TODO.md                   # Roadmap & action items
```

---

## 🎨 Asset Conventions

- **Icons (`assets/icons/`)**: All vector art, badges, logo marks, and SVG assets are grouped here.
- **Images (`assets/images/`)**: High-resolution raster images, project mockups, backgrounds, and team photos.
- **Self-Contained**: All assets are locally hosted—no runtime dependency on third-party design CDNs.

---

## 🚀 Responsive Layout Architecture

1. **Wide Desktop ($\ge 1440\text{px}$)**:
   - Full-width sections (Hero, Featured Projects, Services, Blogs, CTA, Contact, Footer) stretch to `100%` / `100vw`.
   - Content containers are centered on a `1280px` grid using `calc(50% - 640px)`.
2. **Tablets & Mobile ($< 1440\text{px}$)**:
   - Smooth fluid scaling via CSS custom property `--page-scale: calc(100vw / 1440)` with `transform-origin: top center`.
   - Preserves pixel-perfect design fidelity without overflowing or horizontal scrollbars.

---

## 🛠️ Development & Deployment

- **Local Preview**: Open `index.html` directly in any modern browser (or run a local HTTP server such as `npx serve` or Live Server).
- **Adding New Pages**: Duplicate any template in `pages/`, link `../assets/css/globals.css`, `../assets/css/pages/page.css`, and `../assets/js/main.js`.
- **Scripts**: Modular ES-style organization with local file protocol (`file://`) compatibility.