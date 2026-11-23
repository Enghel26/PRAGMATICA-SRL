# PRAGMÁTICA S.R.L. — UI/UX Pro Max Master Design System

> **Generated via**: `ui-ux-pro-max` & `design-system` skills (`https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git`)
> **Category**: B2B Enterprise IT Consulting, Cybersecurity & Software Engineering
> **Primary Pattern**: `Enterprise Gateway` + `Bento Grid Showcase` + `Trust & Authority + Conversion`
> **Visual Style**: `Bento Box Grid` (`bento-box-grid`) + `Soft UI Evolution` (`soft-ui-evolution`) + `Glassmorphism` (`glassmorphism`)
> **Design Dials**: `--variance 6` (Modular Asymmetric Bento) | `--motion 5` (Smooth Scroll & Micro-interactions) | `--density 7` (High Information Density, Zero Dead Whitespace)

---

## 1. Visual Direction & Whitespace Strategy

### Problem Solved (Whitespace Optimization)
1. **Tightened Vertical Rhythm (`--density 7`)**:
   - Replaced oversized `80px–160px` vertical gaps between sections and headings with a calibrated 8dp spacing scale (`--spacing-xl: 5.6rem`, section header margin `4.2rem`).
   - Expanded `.container` max-width to `132rem` (`1320px`) to reduce lateral empty margins on desktop monitors while preserving optimal line length (`60–75ch`).
2. **Bento Grid Completeness (Zero Orphan Cells)**:
   - **Homepage (`index.html`)**: 4-column Executive KPI strip + 3 Primary Bento Service Cards with capability chips + 4-column Quick Solutions Bento Bar + 2x2 Enriched Value Proposition Bento Cards with metric badges and deliverable pills.
   - **Services (`Soluciones.html`)**: 7 core services paired with a dynamic 2-column Bento Custom Architecture & Diagnostic Card (`grid-column: span 2`) that automatically adapts its span across category filters so every row is 100% filled.
   - **Partners & Clients (`Socios.html`)**: Fixed DOM nesting bug and configured the 15th CTA card (`Tu Empresa Aquí`) to dynamically span remaining grid columns (`span 2` in default 4-column view) so no empty slot appears at the end of the grid.
   - **Company (`Empresa.html` & `Nosotros.html`)**: Enriched Mission/Vision cards with strategic pillar chips and transformed the 9 corporate values into compact numbered Bento cards (`01`–`09`).
   - **Contact (`Contacto.html`)**: Balanced left and right columns by pairing a 2x2 Contact Channel Bento Grid with an integrated Location + Interactive Map card on the left, matching the height of the Enterprise Lead Form on the right.

---

## 2. Three-Layer Design Token Architecture

### Layer 1: Primitive Tokens
```css
--color-blue-600: #0062b9;
--color-blue-700: #004c94;
--color-navy-800: #033957;
--color-navy-900: #07192f;
--color-navy-950: #030d1a;
--color-cyan-400: #00c6ff;
--color-cyan-500: #00a8e8;
--color-emerald-500: #10b981;
--color-slate-50: #f8fafc;
--color-slate-100: #f1f5f9;
--color-slate-200: #e2e8f0;
--color-slate-500: #64748b;
--color-slate-800: #1e293b;
```

### Layer 2: Semantic Tokens
```css
--primary-blue: var(--color-blue-600);
--primary-blue-dark: var(--color-blue-700);
--primary-dark: var(--color-navy-800);
--primary-navy: var(--color-navy-900);
--accent-cyan: var(--color-cyan-500);
--accent-bright: var(--color-cyan-400);
--status-green: var(--color-emerald-500);
--surface-card: var(--bg-white);
--surface-muted: var(--bg-slate);
--border-subtle: #e2e8f0;
```

### Layer 3: Component & Bento Tokens
```css
--bento-gap: 2.2rem;
--bento-radius: 2rem;
--bento-padding: 2.8rem;
--bento-border: 1px solid var(--border-subtle);
--bento-shadow: 0 10px 28px -6px rgba(3, 25, 47, 0.07);
--bento-shadow-hover: 0 20px 40px -12px rgba(0, 98, 185, 0.16);
```

---

## 3. UI/UX Pro Max Pre-Delivery Checklist Compliance
- [x] **No emojis as structural icons**: Strictly vector FontAwesome / inline SVG icons with `aria-hidden="true"` on decorative glyphs.
- [x] **Contrast & Legibility**: Minimum 4.5:1 text contrast across light mode (`#1e293b` on `#ffffff`/`#f8fafc`) and dark mode (`#dbe4ef` on `#0f2036`/`#0a1729`).
- [x] **Touch Targets & Interaction**: Interactive buttons, filter chips, and nav controls meet `>=44x44px` target guidelines with `cursor: pointer` and `200-300ms` cubic-bezier transitions.
- [x] **Resilient Text & Chips**: Badges, capability chips, and KPI cards wrap cleanly without clipping or horizontal overflow across `375px`, `768px`, `1024px`, and `1440px`.
- [x] **Reduced Motion**: Respects `@media (prefers-reduced-motion: reduce)` for animations and marquees.
