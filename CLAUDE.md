# SYRAX — Claude Code Rules

> SYRAX é uma plataforma B2B (SaaS) de inteligência de vendas focada em recuperação de receita para infoprodutores e e-commerces. O sistema escuta webhooks de Kiwify e Hotmart, cria Leads automaticamente quando pagamentos são abandonados e apoia operadores a recuperar receita via WhatsApp.
>
> Stack: Django 5 + DRF + PostgreSQL · Next.js 16 (App Router) · CSS Modules · i18n PT/EN.

---

## ⚡ THE FOUR PRINCIPLES

```
backend  = SOURCE OF TRUTH   →  business rules, integrity, authorization live in Django
hooks    = BRAIN             →  every piece of UI logic lives in web/src/hooks/
services = HTTP LAYER        →  every API call lives in web/src/services/
components = RENDER ONLY     →  JSX + CSS. Zero logic. Zero hardcoded values.
```

> **Logic in a component → move to a hook.**
> **Business rule in a hook → it must also be enforced in Django. Never trust the client.**

---

## 🔴 10 INVIOLABLE RULES

### 1 · BACKEND IS THE SOURCE OF TRUTH (BFF philosophy)

The frontend can compute, validate, and transform — but only for UX. Every business rule is **also enforced in Django**. The client cannot be trusted.

| Allowed in frontend | Required in backend |
|--------------------|---------------------|
| Form validation (instant feedback) | Same validation, stricter, in serializer |
| Permission-based UI hiding | Permission check on the ViewSet |
| Optimistic updates | Real authorization on every endpoint |
| Display transformation (format dates, sums) | Source data, untouched |
| Computed fields for display | Persisted truth |

> Rule: if a malicious user calls the API directly bypassing the UI, the system must still be safe and consistent.

### 2 · LOGIC = HOOK. ALWAYS.

All business logic lives in `web/src/hooks/{domain}/`. Components call the hook and render the result. Zero `useState` for data, zero `useEffect` for fetching, zero validation in JSX.

### 3 · COMPONENTS = RENDER ONLY

Zero `useState` for forms. Zero `handleSave`. Zero `toCreateData`. Zero validation.
Allowed locally: `useState` for pure UI (modal open, active tab) · animations · router calls · error feedback.

### 4 · TYPES = CENTRALIZED IN `src/types/`

Entity, payload, business enum → `web/src/types/{domain}/index.ts`. Never recreate locally.

**Allowed locally:** `XxxProps` · UI state · `UseXxxReturn` / `UseXxxOptions` · display DTOs.

### 5 · SERVICES = NO RAW FETCH. EVER.

```typescript
await leadService.list()        // ✅
fetch('/api/leads/')             // ❌ NEVER
```

### 6 · NEVER TAILWIND. CSS MODULES ONLY.

This project does **not** use Tailwind, utility classes, or atomic CSS. Every component has its own `.module.css`.

```typescript
// ✅
import styles from './Button.module.css';
<button className={styles.primary}>Save</button>

// ❌ NEVER
<button className="bg-blue-500 px-4 py-2 rounded-md">Save</button>
```

### 7 · NEVER HARDCODE VALUES. CSS VARIABLES ONLY.

```css
/* ✅ */
padding: var(--spacing-lg);
border-radius: var(--radius-md);
color: var(--color-text);
font-size: var(--font-size-base);
font-weight: var(--font-weight-semibold);

/* ❌ */
padding: 16px;
color: #ededed;
font-size: 18px;
```

Tokens are defined in `web/src/theme/globals.css`. See `docs/DESIGN.md`.

### 8 · ONE FOLDER PER COMPONENT

```
ComponentName/
├── ComponentName.tsx           # component
├── ComponentName.module.css    # ALWAYS separate
├── ComponentName.types.ts      # if > 5 interfaces
└── index.ts                    # mandatory barrel export
```

Inline `style={{...}}` is allowed only for **runtime-computed** values (e.g. dynamic width from props). Static styles go to the `.module.css`.

### 9 · NEVER HARDCODE USER-FACING TEXT

All UI text comes from `STRINGS` in `web/src/constants/strings/`. Never literal strings in JSX.

```typescript
// ✅
import { STRINGS } from '@/src/constants/strings';
<h1>{STRINGS.lead.title}</h1>
placeholder={STRINGS.search.placeholder}

// ❌
<h1>Leads</h1>
```

**STRINGS rules:**
- Organized by domain/screen: `lead`, `auth`, `actions`, etc.
- Parametric strings are functions: `STRINGS.lead.whatsappTemplate(name, product, value)`
- Generic actions in `STRINGS.actions.*` (save, cancel, edit, delete, back, add, create, close, loading, saving)

**Protocol when adding a new string:**
1. Add to `pt-BR.ts` AND `en.ts` in the same change
2. Import via `@/src/constants/strings`
3. TypeScript validates both have the same shape — missing keys cause a compile error

### 10 · MOBILE-FIRST RESPONSIVE

Default styles target mobile (≤768px). Desktop styles use `@media (min-width: 769px)`.

```css
/* ✅ Mobile-first */
.card {
  padding: var(--spacing-lg);
  flex-direction: column;
}
@media (min-width: 769px) {
  .card {
    padding: var(--spacing-2xl);
    flex-direction: row;
  }
}

/* ❌ Desktop-first */
.card { padding: var(--spacing-2xl); flex-direction: row; }
@media (max-width: 768px) { .card { ... } }
```

| Aspect | Mobile (≤768px) | Desktop (≥769px) |
|--------|-----------------|------------------|
| Modals | Bottom sheet (`<BottomModal>`) | Centered (`<Modal>`) |
| Layout | Single column, stacked | Multi-column grid |
| Buttons | Full-width | Auto-width |
| Tabs/filters | Horizontal scroll | Inline row |
| Page header | Often hidden | Visible |

---

## 🚨 AUTOMATIC DIAGNOSTIC

**If a component `.tsx` has any of these → move to a hook:**
```
useState for data or form  |  useEffect for fetching  |  handleSave / handleDelete
isValid / errors / validation  |  toCreateData         |  raw fetch() or axios
```

**Mandatory action (in this order):**
1. Create `web/src/hooks/{domain}/useXxxScreen.ts` with the extracted logic
2. Refactor the component to consume the hook (render only)
3. If the type/payload doesn't exist in `web/src/types/{domain}/`, add it there

---

## 🧭 BEFORE CREATING

### TYPE
```
Domain type (entity, payload, business enum)?
  ├── YES → Already in web/src/types/?
  │          ├── YES → Import. Never recreate.
  │          └── NO  → Add to web/src/types/{domain}/index.ts
  └── NO  → Props, UI state, hook contract? → Stays local.
```

### HOOK
```
Does a hook in web/src/hooks/ already cover this case?
  ├── YES → Use the existing one.
  └── NO  → Is it business logic / data / form?
             ├── YES → Create web/src/hooks/{domain}/useXxx.ts
             └── NO  → Is it router/animation/Alert? → Stays in component.
```

### COMPONENT
```
Does it have logic? (useState for data, fetch, validation, handlers)
  └── YES → STOP. Extract to a hook first.

How many routes use this component?
  ├── 1 route   → self-contained inside the route file (app/...)
  └── 2+ routes → src/components/features/FeatureName/
```

### USER-FACING TEXT
```
Already in STRINGS (pt-BR.ts)?
  ├── YES → Use: STRINGS.{domain}.{key}
  └── NO  → Add to pt-BR.ts AND en.ts (same change)
```

---

## 🏗️ CODE TEMPLATES

### 3 Layers: app/ → Screen → Feature

| Layer | Responsibility |
|-------|---------------|
| `app/route/page.tsx` | Thin wrapper. ~5 lines. Zero logic, zero styles. |
| `screens/XxxScreen/` | Fetch + loading skeleton + error + back. Delegates UI to feature. |
| `features/XxxDetail/` | Pure UI: receives data via props. Zero fetch. Zero router. |

### Hook — Standard Interface

```typescript
// web/src/hooks/{domain}/useXxxScreen.ts
export interface UseXxxScreenOptions {
  id?: string;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}
export interface UseXxxScreenReturn {
  data: XxxDetail | null;
  loading: boolean;
  isSaving: boolean;
  handleSave: (data: XxxCreateData) => Promise<void>;
  handleDelete: () => Promise<void>;
}
```

| Level | Suffix | Use case |
|-------|--------|----------|
| Screen | `useXxxScreen` | Fetch + save + delete for a screen |
| Form | `useXxxForm` | Form state, validation, transformation |
| Tab | `useXxxTab` | Filterable list inside a tab |
| Data | `useXxxData` | Just loads data |
| Card | `useXxxCardData` | Transforms data for card display |

### Import Order

```typescript
// 1. React + Next
// 2. External libs (recharts, date-fns, ...)
// 3. Internal UI components (@/src/components/ui)
// 4. Hooks (@/src/hooks)
// 5. Services (@/src/services)
// 6. Types (@/src/types) with `import type`
// 7. Constants (@/src/constants/strings, etc)
// 8. Local files (styles, types, utils)
```

**Naming:** Folders/files `PascalCase` · handlers prefix `handle` · interfaces suffix `Props | Data | Return` · no `font-weight: bold` (use `var(--font-weight-bold)`)

---

## 🎨 DESIGN — DARK MODE ONLY

SYRAX is dark-first. All tokens come from the dark palette. See [`docs/DESIGN.md`](./docs/DESIGN.md).

**Quick reminders:**
- Background: `var(--color-bg)` (#0B0B0B) for page. `var(--color-card)` (#121212) for cards.
- Cards: always `border: 1px solid var(--color-border)`. Shadow is invisible on dark bg — skip it.
- Hero number: `var(--font-display)` + `letter-spacing: -0.04em` + `tabular-nums`.
- Accent (`var(--color-primary)` = gold #D4AF37) max 3 hits per viewport.
- Active filter: `var(--color-card-elevated) + var(--color-text)`, never solid accent.
- Status: colored text only — never badge with rgba background.
- Score bar fill: always `var(--color-primary)` regardless of score value.

---

## 🔒 MULTI-TENANT RULES (CRITICAL)

Every request must be scoped to a Company. Cross-tenant leakage is the #1 bug.

```python
# ✅ ALWAYS — filter by company from JWT middleware
def get_queryset(self):
    return Lead.objects.filter(company=self.request.company)

# ❌ NEVER — filter by user (wrong scope)
def get_queryset(self):
    return Lead.objects.filter(user=self.request.user)
```

- `TenantMiddleware` in `apps.core.middleware` sets `request.company` from JWT `company_id` claim
- Frontend **never** sends `company_id` in payloads — backend derives it from auth token
- Every new ViewSet must filter by `company=self.request.company` in `get_queryset()`
- Test: user A must not see Company B data — every test suite must include this case

---

## 📦 FOLDER STRUCTURE

```
syrax-revenue-intelligence/
├── backend/                  # Django API
│   ├── apps/
│   │   ├── core/             # SoftDeleteModel, TenantMiddleware, WebhookTokenAuthentication
│   │   ├── users/            # User + JWT (email login, UUID, company FK, role)
│   │   ├── companies/        # Company (Tenant) model
│   │   ├── leads/            # Lead + Interaction models
│   │   ├── integrations/     # Integration model
│   │   └── webhooks/         # Kiwify + Hotmart receivers
│   ├── config/
│   └── manage.py
│
├── web/                      # Next.js App
│   ├── app/                  # File-based routing
│   │   ├── (auth)/login/
│   │   ├── (auth)/register/
│   │   ├── (main)/onboarding/
│   │   ├── (main)/dashboard/
│   │   ├── (main)/leads/
│   │   ├── (main)/oportunidades/
│   │   ├── (main)/conversas/
│   │   ├── (main)/recuperacoes/
│   │   ├── (main)/integracoes/
│   │   ├── (main)/relatorios/
│   │   ├── (main)/configuracoes/
│   │   └── layout.tsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── features/     # Shared (used in 2+ routes)
│   │   │   ├── cards/        # LeadCard, OportunidadeCard, IntegracaoCard
│   │   │   ├── shared/       # Sidebar, Header, BottomNav
│   │   │   └── ui/           # Button, Input, Modal, Icon, Skeleton, Badge, ProgressBar
│   │   ├── screens/          # Fetch layer (between app/ and features/)
│   │   ├── hooks/            # BRAIN — all logic
│   │   ├── services/         # HTTP layer
│   │   ├── types/            # Domain contracts
│   │   ├── constants/        # STRINGS, ICONS, ROUTES
│   │   ├── lib/              # iconMapper, auth, storage, errors, format
│   │   ├── contexts/         # AuthContext
│   │   └── theme/            # globals.css with CSS Variables (dark palette)
│   └── package.json
│
└── docs/
    ├── ARCHITECTURE.md
    ├── BACKEND.md
    ├── FRONTEND.md
    ├── DESIGN.md
    └── PROMPTS/
```

---

## 🌐 i18n PROTOCOL

**All UI text goes through `STRINGS`. No exceptions.**

```
web/src/constants/strings/
├── pt-BR.ts          # default language
├── en.ts             # same shape
├── types.ts          # type extracted from pt-BR
└── index.ts          # exports STRINGS based on locale
```

---

## 🔍 PRE-MERGE CHECKLIST

**Logic**
- [ ] Component has zero business logic? (just JSX + hook call)
- [ ] Hook in `src/hooks/`? (handleSave, validation, transformation inside?)
- [ ] Backend enforces every rule the frontend enforces?
- [ ] ViewSet filters by `request.company` (not user)?

**Types**
- [ ] Domain types in `src/types/` (not recreated locally)?
- [ ] IDs typed as `string` (UUIDs)?

**Strings**
- [ ] Zero hardcoded text in JSX?
- [ ] New strings added to `pt-BR.ts` AND `en.ts`?

**Styling**
- [ ] No Tailwind classes anywhere?
- [ ] CSS Variables used (no hardcoded px/colors/font-sizes)?
- [ ] Styles in separate `.module.css`? Barrel export (`index.ts`)?
- [ ] Mobile-first CSS (default = mobile, `@media (min-width: 769px)` = desktop)?
- [ ] Card uses `border`, not `box-shadow` (dark mode rule)?

**Design**
- [ ] Accent (primary gold) ≤ 3 hits per viewport?
- [ ] Status uses colored text (not rgba badge)?
- [ ] Hero number uses `var(--font-display)` + `letter-spacing: -0.04em`?

---

## 🌿 GIT WORKFLOW

| Environment | Branch | URL |
|-------------|--------|-----|
| Production | `main` | `{{prod-url}}` |
| Staging | `staging` | `{{staging-url}}` |
| Preview | `feat/*` | Auto Vercel URL |

---

## 📚 References

| Area | Doc |
|------|-----|
| Architecture deep-dive (BFF, layers, hooks) | [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) |
| Django patterns (apps, models, views, JWT) | [`docs/BACKEND.md`](./docs/BACKEND.md) |
| Next.js patterns (routing, components, i18n) | [`docs/FRONTEND.md`](./docs/FRONTEND.md) |
| Design system (tokens, palette, components) | [`docs/DESIGN.md`](./docs/DESIGN.md) |

---

## 🛠️ THIS PROJECT'S DOMAIN

### Entities
- **Company** (Tenant): id UUID, name, cnpj, sector, webhook_token (auto-generated)
- **User**: id UUID, name, email (unique), role (admin|operator), is_active, company FK
- **Lead**: id UUID, name, phone (E.164), email, product_name, value (decimal), abandon_type (pix|boleto|cart), status (novo|em_contato|convertido|perdido), origin, score (0-100), company FK
- **Interaction**: id UUID, type (whatsapp_sent|status_change|note|ai_triggered), content, lead FK, user FK (nullable)
- **Integration**: id UUID, platform (kiwify|hotmart|whatsapp), status (connected|disconnected), api_key (nullable), total_events_received, company FK

### User roles
- **admin** — Full access: Dashboard KPIs, Relatórios, Configurações, Integrações + all operational tabs
- **operator** — Operational only: Leads, Oportunidades, Conversas, Recuperações. Cannot see revenue KPIs, Relatórios, Configurações, Integrações.

### External integrations
- **Kiwify** — Inbound webhooks: `POST /api/webhooks/kiwify/{webhook_token}/`
- **Hotmart** — Inbound webhooks: `POST /api/webhooks/hotmart/{webhook_token}/`
- **WhatsApp** — Outbound `wa.me` deep links only. No API. Backend records Interaction on trigger.

### Brand color
- `--color-primary`: `#D4AF37` (gold)
