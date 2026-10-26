# 🌸 Venue Decorator & Visualization AI

A production-ready, highly polished web application that transforms bare, empty event venues into breathtaking celebration spaces using **React (Vite)**, **Tailwind CSS**, **Lucide React**, and the official **Google GenAI SDK (`@google/genai`)**.

Featuring an **In-Place Venue Redecoration & Neural Compositing Engine**, the application preserves the exact architecture, walls, windows, rafters, and perspective of your uploaded space while synthesizing realistic fairy-light canopies, floral arches, crystal chandeliers, table settings, and romantic atmospheric lighting.

---

## 🎨 Design & Aesthetic Theme

- **Color Palette:** Charcoal Black base (`#0F0F12` background, `#1A1A22` card surfaces) accented with vibrant Hot Pink (`#FF1493`) highlights, buttons, and active states.
- **Background Atmosphere:** Animated, soft-blurred glowing hot-pink (`#FF1493`) and warm-gold (`#FFB800`) bokeh circles simulating an ambient fairy-light aesthetic.
- **UI Style:** Modern glassmorphism (`backdrop-blur-md bg-opacity-75`), glowing borders (`border-pink-500/20`), smooth transitions, and high-contrast WCAG AA readable typography.

---

## 🚀 Two-Stage AI Transformation Workflow

Built with the official `@google/genai` client:

```
[ Venue Image (Uploaded or Preset) + Specifications ]
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│  STAGE 1: Spatial Layout Analysis                      │
│  Model: gemini-2.5-flash                               │
│  - Analyzes room geometry, ceiling height, and anchors │
│  - Generates an architectural master prompt            │
│  - Parses an itemized vendor decor checklist with      │
│    cost estimates and placement notes                  │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│  STAGE 2: In-Place Venue Redecoration Engine           │
│  - Preserves 100% of your uploaded room's geometry     │
│  - Synthesizes decor directly onto the exact space:    │
│    • Atmospheric lighting wash & color-palette grade   │
│    • Ceiling fairy light canopies & chandeliers        │
│    • Ceremonial floral arch at the focal center        │
│    • Banquet tables, linens, chiavari chairs, candles  │
│    • Floor hurricane lanterns & rose petal walkway     │
│    • Volumetric fairy-light bokeh shimmer              │
│  - Optional: Conceptual AI Synthesis via Imagen 3      │
└────────────────────────────────────────────────────────┘
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│  INTERACTIVE WORKSPACE                                 │
│  1. Interactive Drag-Split Comparison Slider           │
│  2. Itemized Vendor Decor Checklist & Budget Tracker   │
│  3. Spatial Breakdown & Quick Modifier Chips           │
│  4. Export Hub (Composite PNG, CSV, Print Brief)       │
└────────────────────────────────────────────────────────┘
```

---

## 🧩 Key Interactive Features

### 1. Venue Input Module
- **Drag-and-Drop Uploader:** Accepts PNG, JPG, JPEG, and WebP images up to 20MB with automatic client-side compression and dimension calculation.
- **3 Curated Venue Presets:**
  - **Rustic Barn:** Vaulted timber rafters, exposed cedar beams, and warm wooden textures.
  - **Grand Ballroom:** Palatial elegance with marble floors, columns, and classical arches.
  - **Open Lawn:** Manicured estate grounds under open twilight skies.

### 2. Event Vision & Specification Controls
- **Celebration Types:** Wedding Ceremony & Reception, Luxury Gala, Milestone Birthday, Romantic Anniversary, Corporate Summit, Cocktail Soirée.
- **Aesthetic Styles:** Bohemian Romantic, Modern Minimalist, Luxury Glamour, Enchanted Forest, Neon Glam / Cyberpunk, Vintage French Chateau, Tropical Elegance.
- **Color Palette Swatches:** Interactive multi-color chips (Rose Gold & Champagne, Emerald & Warm Gold, Hot Pink & Charcoal Noir, Lavender Haze, Midnight Navy, Sunset Coral, Pure White & Eucalyptus).
- **Primary Lighting Atmospheres:** Fairy Lights & Twinkle Canopy, Crystal Chandeliers, Warm Candlelight & Lanterns, Hot Pink Neon Uplighting, Edison Bulbs & Festoons, Ambient Golden Hour.
- **Custom Decor Notes:** Freeform input with quick-idea tags (`+ Champagne tower table`, `+ Draped white chiffon ceiling`, `+ Monogram dance floor`).

### 3. Interactive Feature 1: Drag-Split Comparison Slider
- **Custom Split Slider:** Compare the bare venue against the decorated render using a hot-pink glowing divider handle.
- **Keyboard Operable:** Navigate smoothly using keyboard arrow keys (`←` Left, `→` Right, `Home`, `End`).
- **3 View Modes:**
  - **Split Slider:** Drag the divider across the image.
  - **Side by Side:** Simultaneous dual view.
  - **Toggle View:** Click anywhere to flip between Before and After.
- **Fullscreen Lightbox:** Inspect details in full-screen mode.

### 4. Interactive Feature 2: Itemized Vendor Decor Checklist
- **Vendor Categories:** Lighting & Ambiance, Florals & Greenery, Furniture & Seating, Tableware & Linens, Structural & Backdrops.
- **Real-Time Budget Tracker:** Live calculation of Total Estimated Cost, Secured/Completed Cost, Remaining Budget, and Percentage Progress.
- **Celebration Confetti:** Automatically launches celebratory confetti when 100% of items are completed!
- **Multi-Currency Converter:** Switch instantly between USD (`$`), EUR (`€`), GBP (`£`), and INR (`₹`).
- **Custom Items:** Add custom items with category, quantity, and unit cost.
- **Export Tools:** Export to CSV spreadsheet, copy project summary to clipboard, or generate printable client briefs.

### 5. Interactive Feature 3: Prompt Refiner & Quick Modifiers
- **Stage 1 Spatial Breakdown:** Room architecture, clearance, structural rigging anchors, and surface reflections.
- **Quick-Click Modifier Chips:** One-click chips (*"Add hanging wisteria florals"*, *"Switch to candlelight"*, *"Drape sheer ivory chiffon"*, *"Install fairy light ceiling"*, *"Add champagne tower"*, *"Add gold chiavari chairs"*).
- **Editable Prompt:** Live textarea with character count and copy button.
- **Refine & Re-render:** Instantly re-synthesizes the decor on your venue with updated prompt modifiers.

### 6. Export Hub
- **Branded Composite Image (PNG):** Uses HTML5 Canvas to generate a side-by-side comparison graphic featuring "Before: Bare Space" and "After: AI Decorated Render" with headers, metadata, and timestamps.
- **Individual Renders:** Download the high-res decorated render or bare venue photo.
- **Spreadsheets & Proposals:** Download the CSV vendor checklist or launch the browser print view.

---

## ⚙️ Environment Variables & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer; v24 recommended)
- npm (v9 or newer)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Srishti-Ahuja/Event-Venue-Decorator.git
cd Event-Venue-Decorator

# Install dependencies (use npm.cmd on Windows if needed)
npm install
```

### 2. Configure Environment Variable (`.env`)
Create a `.env` file in the root directory (or copy from `.env.example`):

```bash
cp .env.example .env
```

Add your Google Gemini API key to `.env`:

```env
# Google Gemini API Key for Venue Decorator AI
# Obtain a free key from Google AI Studio: https://aistudio.google.com/app/apikey
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

> 💡 **Zero-Friction Fallback:** If no API key is provided, the application automatically runs in **High-Resolution Simulation Mode**, generating realistic spatial layouts, prompts, checklists, and in-place venue transformations without requiring any credentials.

---

## 🏃 Running the Application

### Development Mode

```bash
# Start Vite development server
npm run dev

# On Windows PowerShell (if script execution is restricted):
npm.cmd run dev
```

Open your browser at **[http://localhost:3000/](http://localhost:3000/)**.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🛡️ Accessibility (a11y) & Engineering Mandates

- **Semantic Landmarks:** Uses `<header>`, `<main>`, `<section>`, `<aside>`, and `<footer>`.
- **ARIA Announcements:** `aria-live="polite"` regions announce AI generation state changes and progress percentages.
- **Keyboard Operable:** All interactive elements (sliders, tabs, checkboxes, chips, modals) are accessible via `Tab`, `Space`, `Enter`, and Arrow keys with visible focus rings (`focus:ring-2 focus:ring-pink-500`).
- **Color Contrast:** WCAG AA compliant text contrast against Charcoal `#0F0F12` and `#1A1A22` backgrounds.
- **Performance:** Optimized bundle chunking (`vendor`, `genai`, `icons`, `css`), client-side thumbnail compression, and memory-safe Canvas compositing.
