# Nicolaas Labuschagne — Portfolio

Live at [nicolaaslabuschagne.github.io/Nicolaas_Labuschagne](https://nicolaaslabuschagne.github.io/Nicolaas_Labuschagne/)

## Case Study

### 1. The Problem

Most developer portfolios are built from a template — a project grid, a resume PDF, a contact form — and end up showing design taste rather than engineering judgment. A static one-pager is also where corners quietly get cut: broken accessibility nobody re-audits, dead code nobody re-checks, third-party APIs that change shape underneath the site without anyone noticing until something silently stops working.

### 2. The Engineered Solution

Built entirely by hand — no page builder, no template, no UI framework — as a single-page site with a custom neubrutalist/zine-style design system (a hand-tuned light and dark palette, hard-shadow cards, hand-drawn SVG accents) on top of Tailwind's utility layer. Two pieces of custom engineering do the real work: a live GitHub API integration with client-side session caching (to stay well under GitHub's unauthenticated rate limit) that pulls real repo data into the Projects grid, and a fully custom interactive terminal overlay — a from-scratch typed boot sequence, inline prompt architecture (no fixed input bar), and about a dozen commands including a live GitHub activity heatmap — the kind of feature most portfolio sites don't attempt at all.

### 3. Measurable Impact

An automated WCAG AA accessibility audit (axe-core) on the light-mode palette went from 59 flagged color-contrast violations to zero, without changing the palette's identity — the fix traced back to three specific CSS rules rather than a full redesign. Separately, a GitHub API breaking change (the Events API silently stopped including commit data on push events) broke two live features; it was diagnosed by testing directly against the live endpoint — ruling out rate-limiting first — and fixed by switching to a different data source, verified against real data rather than assumed. A pre-launch cleanup pass also caught a corrupted SVG attribute that had been silently throwing a console error on every single page load, missed by earlier testing because it only checked for thrown exceptions, not console errors.

### 4. Tech Stack & Architecture

- HTML5 / CSS3, Tailwind (CDN, utility layer only — no build step)
- Vanilla JavaScript (ES6+), no framework
- GitHub REST API with client-side session caching
- p5.js (generative background)
- axe-core (automated accessibility auditing)
- Hosted on GitHub Pages
