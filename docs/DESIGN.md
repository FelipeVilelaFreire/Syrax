# Design — Calm / Notion-flat dialect

> The visual language. Read this when writing CSS or making any visual decision.

The design philosophy: **calm, clean, confident**. Think Linear, Notion, Vercel, Stripe — never Bootstrap, never Material, never "AI-generated dashboard."

---

## ⚡ Five rules to memorize

1. **Background**: `var(--color-white)` for page and cards. Never off-white.
2. **Hero number**: `var(--font-display)` + `letter-spacing: -0.04em` + `tabular-nums`.
3. **Accent ≤ 3 hits per viewport**: progress fill, primary CTA, inline CTA link. Otherwise gray.
4. **Filter active**: `gray100 + gray900 + font-weight 600`. Never solid accent.
5. **Card**: `box-shadow` OR `border`, never both. White → shadow. Gray → border.

If you violate any of these, the design loses its calm character.

---

## 🎨 Color Palette

### CSS Variables — declared in `web/src/theme/globals.css`

```css
:root {
  /* Brand — change per project */
  --color-primary: {{PRIMARY_COLOR}};         /* default: #0066ff */
  --color-primary-hover: {{PRIMARY_HOVER}};   /* default: #0052cc */
  --color-primary-light: {{PRIMARY_LIGHT}};   /* default: #e6f0ff */

  /* Neutral grayscale — Calm/Notion-flat */
  --color-white: #ffffff;
  --color-gray50:  #fafafa;
  --color-gray100: #f4f4f5;
  --color-gray200: #e4e4e7;
  --color-gray300: #d4d4d8;
  --color-gray400: #a1a1aa;
  --color-gray500: #71717a;
  --color-gray600: #52525b;
  --color-gray700: #3f3f46;
  --color-gray800: #27272a;
  --color-gray900: #18181b;
  --color-black:   #000000;

  /* Status — semantic, not decorative */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error:   #ef4444;
  --color-info:    #3b82f6;
}
```

### Usage discipline

| Color | Where it can appear |
|-------|---------------------|
| `--color-primary` | Progress fill · primary CTA bg · inline CTA link · active tab indicator. **Max 3 per viewport.** |
| `--color-gray900` | Body text on white · hero numbers · active filter text |
| `--color-gray700` | Section titles · secondary headings |
| `--color-gray500` | Secondary text · meta · "see all" links · default icon color |
| `--color-gray400` | Tertiary text · placeholder · disabled |
| `--color-gray200` | Border for cards on gray bg · divider |
| `--color-gray100` | Subtle bg (filter pills active, hover surfaces) |
| `--color-gray50` | Alternative page bg (rarely) |
| `--color-success/warning/error` | Status text only — NEVER as a badge background |

### Anti-pattern: too much color

```css
/* ❌ */
.card { background: var(--color-primary-light); border-left: 4px solid var(--color-primary); }
.badge { background: rgba(16, 185, 129, 0.1); color: var(--color-success); }

/* ✅ */
.card { background: var(--color-white); box-shadow: 0 1px 4px rgba(0,0,0,0.07); }
.statusText { color: var(--color-success); font-weight: 600; }
```

---

## 📐 Spacing Scale

```css
:root {
  --spacing-xs:  4px;
  --spacing-sm:  8px;
  --spacing-md:  12px;
  --spacing-lg:  16px;
  --spacing-xl:  20px;
  --spacing-2xl: 24px;
  --spacing-3xl: 32px;
  --spacing-4xl: 48px;
  --spacing-5xl: 64px;
}
```

Rules:
- Mobile padding: `var(--spacing-lg)` (16px) is the default for card interiors
- Desktop padding: `var(--spacing-2xl)` (24px) or `--spacing-3xl` (32px) for hero sections
- Gap between cards in a list: `var(--spacing-md)` (12px)
- Gap inside a card: `var(--spacing-sm)` (8px)
- Section vertical rhythm: `var(--spacing-3xl)` (32px) between major blocks

---

## 🟦 Border Radius

```css
:root {
  --radius-xs:   4px;
  --radius-sm:   8px;
  --radius-md:   12px;
  --radius-lg:   16px;
  --radius-xl:   24px;
  --radius-full: 9999px;
}
```

| Element | Radius |
|---------|--------|
| Button | `--radius-md` (12px) |
| Input | `--radius-md` (12px) |
| Card | `--radius-xl` (24px) |
| Modal | `--radius-xl` (24px) |
| Avatar | `--radius-full` |
| Pill / chip | `--radius-full` |
| Image inside card | `--radius-lg` (16px) |

---

## 🔤 Typography

### Font families

```css
:root {
  --font-display: 'Manrope', system-ui, sans-serif;     /* Hero numbers, headlines */
  --font-body:    'Inter', system-ui, sans-serif;       /* Body text, UI */
}
```

### Font sizes

```css
:root {
  --font-size-xs:    12px;   /* Meta, captions */
  --font-size-sm:    14px;   /* Secondary text */
  --font-size-base:  16px;   /* Body */
  --font-size-lg:    18px;   /* Lead, card titles */
  --font-size-xl:    20px;   /* Section titles */
  --font-size-2xl:   24px;   /* Page subtitles */
  --font-size-3xl:   30px;   /* Page titles */
  --font-size-4xl:   36px;   /* Hero numbers */
}
```

### Font weights

```css
:root {
  --font-weight-regular:  400;   /* Body */
  --font-weight-medium:   500;   /* Section title, label */
  --font-weight-semibold: 600;   /* CTA, active tab, nav */
  --font-weight-bold:     700;   /* Hero number, h1 */
}
```

### Hierarchy precision

| Level | Weight | Use |
|-------|--------|-----|
| Hero number / nome principal | 700 | Headline value, page h1 |
| Tab ativa / nav / CTA | 600 | Buttons, tabs, active breadcrumb |
| Section title / label | 500 | Section headings, form labels |
| Body / meta | 400 | Paragraphs, subtitles, dates |

### Hero number recipe

```css
.heroNumber {
  font-family: var(--font-display);          /* Manrope */
  font-size: clamp(1.5rem, 5vw, 1.875rem);   /* 24px → 30px responsive */
  font-weight: var(--font-weight-bold);      /* 700 */
  letter-spacing: -0.04em;
  font-variant-numeric: tabular-nums;        /* Aligned digits */
  color: var(--color-gray900);
}
```

### Body text rules

```css
body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-regular);
  letter-spacing: -0.01em;                   /* Subtle tightening */
  line-height: 1.5;
  color: var(--color-gray900);
}
```

---

## 🌑 Shadow Scale — three levels only

```css
:root {
  --shadow-resting:  0 1px 4px rgba(0, 0, 0, 0.07);    /* Card at rest */
  --shadow-hover:    0 4px 16px rgba(0, 0, 0, 0.10);   /* Card on hover */
  --shadow-elevated: 0 8px 32px rgba(0, 0, 0, 0.12);   /* Modal, dropdown */
}
```

Rules:
- **Always neutral** (rgba black). Never colored shadows.
- **Three levels max**. No glow effects, no inner shadows, no neon.
- Cards on **white bg use shadow**. Cards on **gray bg use border** (never shadow on gray).

---

## 🃏 Card Pattern

### Default card

```css
.card {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-resting);
  padding: var(--spacing-2xl);
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-hover);
}
```

### Card on gray bg

```css
.card {
  background: var(--color-white);
  border: 1px solid var(--color-gray200);
  border-radius: var(--radius-xl);
  padding: var(--spacing-2xl);
  /* NO box-shadow on gray bg */
}
```

### The XOR rule

| Background | Decoration |
|------------|------------|
| `--color-white` (page) | `box-shadow` only |
| `--color-gray50` / `--color-gray100` | `border` only |
| Inside form inputs | `border` always |

Never both.

---

## 📊 Bento Grid — for dashboards

Used when a screen needs to show multiple stats / metrics in a layered hierarchy.

```css
.statGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.statHero {
  order: -1;                    /* Always first on mobile */
  grid-column: 1 / -1;          /* Full width on mobile */
  border-radius: var(--radius-xl);
}

@media (min-width: 769px) {
  .statGrid {
    grid-template-columns: 1fr 1.4fr 1fr;   /* Hero in the middle */
    gap: var(--spacing-md);
  }
  .statHero {
    order: 0;                   /* Natural flow on desktop */
    grid-column: auto;
  }
}
```

Mobile layout:
```
┌──────────────────┐
│   HERO METRIC    │
└──────────────────┘
┌────────┬─────────┐
│ stat 1 │ stat 2  │
└────────┴─────────┘
```

Desktop layout:
```
┌────────┬───────────┬────────┐
│ stat 1 │   HERO    │ stat 2 │
└────────┴───────────┴────────┘
```

---

## 🔘 Button Pattern

### Primary CTA

```css
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-2xl);
  border-radius: var(--radius-md);
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
  border: none;
}

.primary {
  background: var(--color-primary);
  color: var(--color-white);
}
.primary:hover  { background: var(--color-primary-hover); }
.primary:active { transform: translateY(1px); }

.secondary {
  background: var(--color-gray100);
  color: var(--color-gray900);
}
.secondary:hover { background: var(--color-gray200); }

.tertiary {
  background: transparent;
  color: var(--color-gray700);
  padding: var(--spacing-sm) var(--spacing-md);
}
.tertiary:hover { color: var(--color-gray900); }

.destructive {
  background: var(--color-error);
  color: var(--color-white);
}

.button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

Mobile: buttons are typically `width: 100%` (full bleed).
Desktop: buttons are `width: auto`.

---

## 🏷️ Filter Pills

### Inactive

```css
.pill {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-full);
  background: transparent;
  border: 1px solid var(--color-gray200);
  color: var(--color-gray500);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
}
```

### Active — `gray100 + gray900`, NEVER solid accent

```css
.pillActive {
  background: var(--color-gray100);
  border-color: transparent;
  color: var(--color-gray900);
  font-weight: var(--font-weight-semibold);
}
```

---

## 🟢 Status — colored text, never badge

```css
.statusText {
  font-size: 11px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.statusSuccess { color: var(--color-success); }
.statusWarning { color: var(--color-warning); }
.statusError   { color: var(--color-error); }
```

```html
<!-- ✅ -->
<span class={statusText + ' ' + statusSuccess}>Paid</span>

<!-- ❌ -->
<span class="badge bg-green-100 text-green-700">Paid</span>
```

---

## 📝 Form Pattern

```css
.field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-gray700);
}

.input {
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid var(--color-gray200);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
  background: var(--color-white);
  color: var(--color-gray900);
  transition: border-color 0.15s ease;
}

.input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.input::placeholder {
  color: var(--color-gray400);
}

.error {
  font-size: var(--font-size-xs);
  color: var(--color-error);
}

.inputError {
  border-color: var(--color-error);
}
```

---

## 🚫 Anti-patterns — banned forever

| Anti-pattern | Replace with |
|--------------|--------------|
| Decorative blob (`::before` with `border-radius: 50%; filter: blur`) | Remove. Card is flat. |
| `linear-gradient` in progress fills, cards, headers | `background: solid color` |
| Color halo behind icon (`bg: ${accent}10`) | Remove bg. Icon direct on card. |
| Status as chip with rgba bg | Colored text |
| Active filter with solid accent bg | `gray100 + gray900` |
| Border + box-shadow on the same card | One or the other. White → shadow. Gray → border. |
| Hero icon with `accent` bg + white icon | `gray50` bg + `gray600` icon |
| Hero number in body font without `letter-spacing` | Manrope + `letter-spacing: -0.04em` + `tabular-nums` |
| `accentColor` everywhere (every icon, link, badge) | Neutral gray. Accent only in 3 hits per viewport. |
| Off-white card bg (`#fefefe`, `#fcfafa`) | `var(--color-white)` |
| Drop shadow with color (e.g. blue glow) | Always neutral rgba black |
| `font-weight: bold` (string) | `var(--font-weight-bold)` (700) |
| Hardcoded breakpoint `@media (max-width: 600px)` | Mobile-first `@media (min-width: 769px)` |

---

## 📱 Mobile vs Desktop dialect

| Element | Mobile (≤768px) | Desktop (≥769px) |
|---------|-----------------|------------------|
| Modal | `BottomModal` (slides up) | `Modal` (centered) |
| Page header | Often hidden — content speaks | Always visible |
| Bento Grid | Hero on top, full-width | Hero in middle, equal weight |
| Card hover | `translateY(-1px)` | `translateY(-2px)` |
| Buttons | `width: 100%` | `width: auto` |
| Padding inside card | `--spacing-lg` (16px) | `--spacing-2xl` (24px) |
| Tabs / filters | `overflow-x: auto`, scroll | Inline row |
| Image aspect | 16:9 or 4:3 | Often square or 3:2 |
| Hero number | `clamp(1.5rem, 5vw, 1.875rem)` | Same clamp, naturally larger |

CSS lives in `@media (min-width: 769px)`. Content visibility may differ between breakpoints (e.g., `pageHeader` hidden on mobile).

---

## ✅ Visual Pre-merge Checklist

**Color**
- [ ] Background is `var(--color-white)` (not off-white)?
- [ ] Accent (primary) ≤ 3 hits per viewport, each carrying information or action?
- [ ] Status colors used as **text**, not badges?
- [ ] No decorative gradients, halos, blobs?

**Typography**
- [ ] Hero number uses `var(--font-display)` + `letter-spacing: -0.04em` + `tabular-nums`?
- [ ] Font weight matches hierarchy (700 hero · 600 active/CTA · 500 section · 400 body)?
- [ ] No `font-weight: bold` strings — only `var(--font-weight-bold)`?

**Layout**
- [ ] Cards have `box-shadow` OR `border`, never both?
- [ ] Mobile-first CSS (default = mobile, `@media (min-width: 769px)` adds desktop)?
- [ ] Spacing uses tokens (`var(--spacing-*)`)?
- [ ] Radius uses tokens (`var(--radius-*)`)?

**Interactivity**
- [ ] Active filter pill uses `gray100 + gray900` (not solid accent)?
- [ ] Hover state changes shadow / position, not scale?
- [ ] Transitions are subtle (0.15s–0.2s ease)?

**Tokens**
- [ ] Zero hardcoded colors / px / font-sizes anywhere?
- [ ] Zero Tailwind classes anywhere?
- [ ] All visual values come from `globals.css` CSS Variables?
