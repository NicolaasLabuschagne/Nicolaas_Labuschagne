# Nicolaas Labuschagne Portfolio - Style & Theme Guide

This document provides a comprehensive guide to the "Neon Zine / Global Dev" design system used in this portfolio. Any AI agent or developer working on this project should adhere to these guidelines to maintain visual and functional consistency.

## 1. Core Brand & Theme
- **Theme Name:** Neon Zine / Global Dev (Glow-Cartoon).
- **Concept:** The website is designed as a high-contrast, interactive "Zine" or dossier. It balances technical rigor ("Global Dev") with a creative, vibrant aesthetic.
- **Aesthetic:** Neo-brutalist with "Glow-Cartoon" accents. Features thick borders (4px-6px), hard shadows (no blur), and vibrant neon highlights.
- **Theme Cycling:** Features a tri-state theme engine (Creative, Fun, Professional) toggled via an interactive pet (🐾).

## 2. Color Palette (Design Tokens)

### Global Constants (Creative/Zine Default)
- **Primary:** `#bef264` (Lime Green - User Preferred)
- **Secondary:** `#ffda35` (Yellow)
- **Accent/Pink:** `#ff4a8d` (Pink)
- **Background:** `#131313` (Dark)
- **Text:** `#e5e2e1` (Off-white)
- **Borders:** `#131313` or themed equivalents.

### Theme Variations (via CSS Variables)
- **Creative:** The default high-contrast dark theme with lime highlights.
- **Fun:** Rounded corners (`2rem`), bright parchment background (`#fff8eb`), and deep pink highlights.
- **Professional:** Clean, minimalist style with Slate colors, thin borders (1px), and standard shadows.

## 3. Typography
- **Headlines:** 'Space Grotesk', sans-serif (Weights: 700, 900). Variable: `var(--font-main)`.
- **Body:** 'Plus Jakarta Sans', sans-serif. Variable: `var(--font-body)`.
- **Mono:** 'Space Mono', monospace. Variable: `var(--font-mono)`.
- **Hand:** 'Caveat', cursive. Variable: `var(--font-cursive)`.

## 4. UI/UX Principles
- **High-Contrast Borders:** Use `var(--border-width)` (3px) and `var(--border-color)` (`#2c1e1a`) for almost all containers and buttons.
- **Hard Shadows:** Use "Neo-brutalism" style hard shadows. `box-shadow: 4px 4px 0px 0px var(--border-color);` (or larger offsets for larger elements).
- **Sticker & Tape Aesthetics:** Use `.sticker` and `.tape` classes to simulate items being stuck onto the page. Stickers should have background colors like `--primary-color`, `--accent-color`, or `--purple-color`.
- **Interactive States:** Buttons and interactive tags should use a "press-in" effect: `transform: translate(x, y); box-shadow: 0px 0px 0px 0px;`.
- **Grain/Noise Overlay:** A global noise texture is applied to the body to give it a physical paper feel.

## 5. Component-Specific Guidelines
- **Navigation:** Fixed at the top, styled as a floating bar with hard shadows.
- **Hero Section:** Features a tilted profile card with "tape" corners and a speech bubble. Includes a "Buy me a coffee" call-to-action with a hand-drawn arrow.
- **Skills:** Organized in categories. Each tag should have a hover effect and a random "press-in" animation triggered by JavaScript.
- **Timeline (Journey):** A vertical line with "dots" and cards that look like they are taped to the page.
- **Map:** Uses Leaflet.js with a custom bicycle icon marker. Dark mode uses a CSS filter to invert the map colors.

## 6. Animation & Interaction Patterns
- **P5.js Background:** An interactive background using architectural and adventure symbols (`★`, `•`, `✎`, `➤`, `❖`). Symbols react to mouse movement (offset and rotation).
- **Reveal Animations:** Use the `.animate-reveal` class. Triggered via `IntersectionObserver` in `script.js`.
- **Keyword Highlights:** Use the `.highlight` class for text. An animation expands the background color when the element becomes visible.
- **Scroll Progress:** A bicycle icon (`🚲`) that "rides" across the top of the screen as the user scrolls.

## 7. Technical Implementation
- **Tech Stack:** Vanilla HTML5, CSS3 (using CSS variables for theming), and Vanilla JavaScript.
- **Libraries:**
  - **p5.js:** For the interactive background.
  - **Leaflet.js:** For the interactive maps.
  - **Font Awesome 4.7.0:** For icons.
- **File Structure:**
  - `CSS/style1.css`: Main stylesheet.
  - `JS/script.js`: Main logic, p5.js sketch, and interactive elements.
  - `images/`: Static assets.
  - `archive/`: Legacy code and assets (do not modify).

## 8. Development Workflow
- **Theming:** Always use CSS variables (e.g., `var(--bg-color)`) to ensure compatibility with Light/Dark mode.
- **Responsive Design:** Use media queries to handle mobile responsiveness (breakpoints: 992px, 768px, 480px).
- **Modifying Assets:** If editing a source file that has a corresponding artifact, ensure the artifact is updated accordingly.
- **Verification:** Use Playwright for visual regression testing and frontend verification.

---
*Note: This file is intended for AI agents and developers to understand the design language of the project.*
