# Admin Panel — Config-driven modular admin

> The admin is a **separate Vite + React project** (not Next.js, not part of `web/`). It uses a modular, config-driven architecture inspired by Django Admin.
> Each domain entity is an **app** with its own `config.jsx` declaring columns, fields, tabs.
>
> Only scaffolded if `IDEA.md` declares `Admin panel: yes`.

Stack: **Vite 6 + React 19 + React Router 7 + TypeScript optional (JSX is fine) + plain CSS Modules + axios + FontAwesome 7**.

---

## 🎯 Why separate from `web/`?

| Concern | `web/` (Next.js) | `frontend/` (admin) |
|---------|------------------|---------------------|
| Audience | End users (customers) | Internal team (super-users) |
| SSR | Required (SEO, performance) | Not needed |
| Build speed | Slower (Next compiler) | Fast (Vite) |
| Deploy cadence | Often | Rarely |
| Auth | Public + JWT | Admin-only role check |
| Design system | Calm/Notion-flat (white bg) | Admin-specific tokens (`--admin-*`) |
| Routing | File-based (`app/`) | Programmatic (React Router) |

Keeping them separate avoids polluting the main app with admin concerns and lets the admin iterate independently.

---

## 📁 Folder Structure

```
frontend/                              # The admin project (Vite + React)
├── package.json
├── vite.config.js
├── eslint.config.js
├── index.html
├── public/
└── src/
    ├── main.jsx                       # Entry — renders <App />
    ├── App.jsx                        # Root with React Router
    ├── ErrorBoundary.jsx
    │
    ├── services/
    │   └── api.js                     # axios instance + JWT interceptor
    │
    └── admin/
        ├── AdminApp.jsx               # Routes definition
        │
        ├── apps/                      # ONE FOLDER PER ENTITY (modular)
        │   ├── auth/                  # Login page
        │   ├── dashboard/             # KPI overview
        │   ├── {{entity1}}/
        │   │   ├── config.jsx         # ⭐ heart of the app
        │   │   ├── constants.js       # tableColumns, formFields, etc.
        │   │   ├── pages/
        │   │   │   ├── {{Entity1}}List.jsx
        │   │   │   ├── {{Entity1}}Detail.jsx
        │   │   │   ├── {{Entity1}}Add.jsx     # optional
        │   │   │   └── index.js
        │   │   ├── tabs/
        │   │   │   ├── InfoTab/
        │   │   │   │   ├── InfoTab.jsx
        │   │   │   │   └── InfoTab.module.css
        │   │   │   ├── {{OtherTab}}/
        │   │   │   └── index.js
        │   │   ├── components/        # app-specific UI
        │   │   ├── hooks/             # app-specific hooks (optional)
        │   │   └── utils/             # formatters, transforms
        │   ├── {{entity2}}/           # same shape
        │   ├── trash/                 # soft-deleted items (universal)
        │   ├── history/               # audit log (universal)
        │   └── profile/               # admin user's profile
        │
        ├── shared/
        │   ├── components/
        │   │   ├── layout/
        │   │   │   ├── DetailPage/    # generic detail page (uses config)
        │   │   │   ├── ListPage/      # generic list page (uses config)
        │   │   │   └── TabsView/      # tabs navigation
        │   │   ├── form/
        │   │   │   ├── FormBuilder/   # renders fields from config
        │   │   │   └── FormField/
        │   │   ├── fields/            # custom field types
        │   │   │   ├── IconPicker/
        │   │   │   ├── EmojiPicker/
        │   │   │   ├── AvatarUpload/
        │   │   │   └── ColorPicker/
        │   │   └── ui/                # primitives: Card, Button, Modal, Toast, Badge
        │   ├── hooks/                 # useApi, useAuth, useToast
        │   ├── services/              # service wrappers (CRUD generic)
        │   ├── layout/
        │   │   ├── AdminLayout/       # shell with Sidebar + TopBar
        │   │   ├── Sidebar/           # nav (one entry per app)
        │   │   └── TopBar/            # user menu, breadcrumbs
        │   └── constants/             # global constants
        │
        ├── styles/
        │   ├── variables.css          # ⭐ ALL --admin-* tokens
        │   ├── globals.css
        │   └── reset.css
        │
        ├── ini/
        │   └── config/
        │       ├── endpoints.js       # API_ENDPOINTS — central registry
        │       ├── limits.js          # pagination, upload, etc.
        │       └── defaults.js        # default values
        │
        ├── constants/                 # icon lists, emoji lists
        └── contexts/
            └── ToastContext.jsx       # global toast
```

---

## 🧬 The `config.jsx` — Heart of Each App

Every app declares **what its data looks like** and **how to render it** in a single config file. The generic `DetailPage` / `ListPage` / `FormBuilder` components read this config and render everything.

```jsx
// admin/apps/orders/config.jsx
import { TABLE_COLUMNS, FORM_FIELDS } from './constants';
import { InfoTab, ItemsTab } from './tabs';
import { API_ENDPOINTS } from '../../ini/config/endpoints';

export default {
  // Identity
  entity: 'orders',
  title: 'Orders',
  singularTitle: 'Order',
  icon: 'fa-receipt',
  apiEndpoint: API_ENDPOINTS.ORDERS,

  // Quick info cards on detail page header
  quickInfo: (data) => [
    { label: 'Status', value: data.status, type: 'status' },
    { label: 'Total', value: `R$ ${data.total_amount}`, type: 'highlight' },
    { label: 'Created', value: data.created_at, type: 'date' },
  ],

  // Table columns for the list view
  tableColumns: TABLE_COLUMNS,

  // Form fields for the "Add new" page
  formFields: FORM_FIELDS,

  // Tabs on the detail page
  detailTabs: [
    {
      key: 'info',
      label: 'Information',
      icon: 'fa-info-circle',
      render: (data, formData, isEditing, errors, onChange, onRefresh) => (
        <InfoTab {...{ data, formData, isEditing, errors, onChange, onRefresh }} />
      ),
    },
    {
      key: 'items',
      label: 'Items',
      icon: 'fa-list',
      render: (data, _f, _e, _err, _oc, onRefresh) => (
        <ItemsTab order={data} onRefresh={onRefresh} />
      ),
    },
  ],

  // Filters for the list view
  filters: [
    { key: 'status', label: 'Status', type: 'select', options: ['pending', 'paid', 'cancelled'] },
    { key: 'created_at', label: 'Created', type: 'daterange' },
  ],
};
```

That's it. The whole CRUD page is defined declaratively.

---

## 📊 `constants.js` — Columns and Fields

```javascript
// admin/apps/orders/constants.js
import { formatCurrency, formatDate } from '../../shared/utils/format';

export const TABLE_COLUMNS = [
  {
    key: 'id',
    label: 'ID',
    sortable: true,
    width: 80,
  },
  {
    key: 'customer',
    label: 'Customer',
    type: 'custom',
    render: (_v, row) => <span>{row.customer.name}</span>,
  },
  {
    key: 'status',
    label: 'Status',
    type: 'badge',
    badgeMap: {
      pending: { color: 'warning', label: 'Pending' },
      paid: { color: 'success', label: 'Paid' },
      cancelled: { color: 'error', label: 'Cancelled' },
    },
  },
  {
    key: 'total_amount',
    label: 'Total',
    type: 'currency',
    format: formatCurrency,
    align: 'right',
  },
  {
    key: 'created_at',
    label: 'Created',
    format: formatDate,
    sortable: true,
  },
];

export const FORM_FIELDS = [
  { name: 'customer_id', label: 'Customer', type: 'select', apiEndpoint: '/api/users/',
    valueKey: 'id', labelKey: 'email', required: true },
  { name: 'total_amount', label: 'Total (R$)', type: 'number', required: true, min: 0 },
  { name: 'notes', label: 'Notes', type: 'textarea', rows: 4 },
];

export const INFO_TAB_FIELDS = [
  { name: 'status', label: 'Status', type: 'select',
    options: ['pending', 'paid', 'cancelled'] },
  { name: 'total_amount', label: 'Total (R$)', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea', rows: 6 },
];
```

---

## 🧰 Generic Components

### `DetailPage` — handles everything

```jsx
// admin/apps/orders/pages/OrderDetail.jsx
import DetailPage from '../../../shared/components/layout/DetailPage/DetailPage';
import config from '../config';

export default function OrderDetail() {
  return <DetailPage config={config} />;
}
```

`DetailPage` reads `config` and handles:
- Fetching data via `config.apiEndpoint`
- Editing mode toggle
- Form validation
- Save / Cancel / Delete (with confirmation modal)
- Tab system rendering
- Quick info cards on header
- Loading / error states

### `ListPage` — generic list view

```jsx
// admin/apps/orders/pages/OrderList.jsx
import ListPage from '../../../shared/components/layout/ListPage/ListPage';
import config from '../config';

export default function OrderList() {
  return <ListPage config={config} />;
}
```

`ListPage` handles: pagination, filtering (`config.filters`), sorting, search, bulk actions, row click → detail.

### `FormBuilder` — renders any form from config

```jsx
import FormBuilder from '../../../shared/components/form/FormBuilder/FormBuilder';
import { INFO_TAB_FIELDS } from '../../constants';

<FormBuilder
  fields={INFO_TAB_FIELDS}
  data={isEditing ? formData : data}
  errors={errors}
  onChange={onChange}
  readOnly={!isEditing}
/>
```

Supported field types: `text · email · number · textarea · select · boolean · date · daterange · image · custom`.

For `custom`, pass `component`:
```javascript
{ name: 'icon', label: 'Icon', type: 'custom', component: IconPicker }
```

### `TabsView` — tab navigation

Handled internally by `DetailPage` using `config.detailTabs`. Don't render manually.

---

## 🎨 CSS Variables — `styles/variables.css`

**Every color, spacing, and size in the admin uses an `--admin-*` variable.** This namespace prevents collision with the main `web/`'s variables.

```css
:root {
  /* Status colors (booleans, active/inactive) */
  --admin-status-yes:    #059669;
  --admin-status-yes-bg: rgba(16, 185, 129, 0.15);
  --admin-status-no:     #525252;
  --admin-status-no-bg:  rgba(82, 82, 82, 0.10);

  /* Brand */
  --admin-primary:        #2563eb;
  --admin-primary-hover:  #1d4ed8;
  --admin-primary-bg:     rgba(37, 99, 235, 0.08);

  /* Surfaces */
  --admin-bg-primary:     #ffffff;     /* page bg */
  --admin-bg-secondary:   #f9fafb;     /* secondary surfaces */
  --admin-bg-tertiary:    #f3f4f6;     /* hover, selected */

  /* Borders */
  --admin-border-light:   #e5e7eb;
  --admin-border-medium:  #d1d5db;

  /* Text */
  --admin-text-primary:   #111827;
  --admin-text-secondary: #4b5563;
  --admin-text-tertiary:  #9ca3af;

  /* Spacing */
  --admin-space-xs: 4px;
  --admin-space-sm: 8px;
  --admin-space-md: 12px;
  --admin-space-lg: 16px;
  --admin-space-xl: 20px;
  --admin-space-2xl: 24px;
  --admin-space-3xl: 32px;

  /* Typography */
  --admin-text-xs:   11px;
  --admin-text-sm:   13px;
  --admin-text-base: 14px;
  --admin-text-md:   16px;
  --admin-text-lg:   18px;
  --admin-text-xl:   24px;
  --admin-text-2xl:  32px;

  --admin-weight-regular:  400;
  --admin-weight-medium:   500;
  --admin-weight-semibold: 600;
  --admin-weight-bold:     700;

  /* Radius */
  --admin-radius-sm:   4px;
  --admin-radius-md:   8px;
  --admin-radius-lg:   12px;
  --admin-radius-full: 9999px;

  /* Shadows */
  --admin-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --admin-shadow-md: 0 4px 6px rgba(0, 0, 0, 0.07);
  --admin-shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.10);

  /* Transitions */
  --admin-transition-fast:   150ms ease;
  --admin-transition-normal: 250ms ease;
}
```

**Rule**: never write hex colors or px values inside admin CSS. Always use `var(--admin-*)`.

---

## ➕ How to Create a New App

Five steps:

### 1. Create folders

```bash
mkdir -p frontend/src/admin/apps/{{entity}}/{pages,tabs,components,hooks,utils}
```

### 2. Create `constants.js`

Declare `TABLE_COLUMNS`, `FORM_FIELDS`, `INFO_TAB_FIELDS`. (See template above.)

### 3. Create `config.jsx`

Declare entity metadata + tabs. (See template above.)

### 4. Create the InfoTab

```jsx
// tabs/InfoTab/InfoTab.jsx
import FormBuilder from '../../../../shared/components/form/FormBuilder/FormBuilder';
import { INFO_TAB_FIELDS } from '../../constants';

export default function InfoTab({ data, formData, isEditing, errors, onChange }) {
  return (
    <FormBuilder
      fields={INFO_TAB_FIELDS}
      data={isEditing ? formData : data}
      errors={errors}
      onChange={onChange}
      readOnly={!isEditing}
    />
  );
}
```

### 5. Wire routes in `AdminApp.jsx`

```jsx
import { {{Entity}}List, {{Entity}}Detail } from './apps/{{entity}}/pages';

<Route path="{{entity}}" element={<{{Entity}}List />} />
<Route path="{{entity}}/:id" element={<{{Entity}}Detail />} />
```

And add an entry to the Sidebar:
```jsx
{ key: '{{entity}}', label: '{{Entity}}s', icon: 'fa-receipt', path: '/{{entity}}' }
```

Done. The new entity has full CRUD with filtering, pagination, edit mode, soft-delete, and audit logging.

---

## 🗑️ Trash & History (universal apps)

Both apps come pre-built and work for any entity that has `deleted_at` (soft delete) and audit logging configured on the backend.

- **`apps/trash/`** — Lists soft-deleted items across all entities. Allows restore or permanent delete. Filterable by entity type.
- **`apps/history/`** — Audit log. Shows every admin action: who · what · when · changes. Filterable by user, entity, action.

The backend exposes these via:
- `GET /api/admin/trash/?entity={name}` — soft-deleted items
- `POST /api/admin/trash/{id}/restore/` — restore
- `DELETE /api/admin/trash/{id}/` — permanent delete
- `GET /api/admin/audit/?user={id}&entity={name}` — audit entries

---

## 🔐 Auth & Authorization

The admin uses the **same JWT** as the main app, but every page is gated by `role === 'admin'`:

```jsx
// admin/AdminApp.jsx
import { useAuth } from './shared/hooks/useAuth';

function AdminApp() {
  const { user, isLoading } = useAuth();
  if (isLoading) return <Spinner />;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;
  return <AdminLayout>...</AdminLayout>;
}
```

The backend re-enforces this on every endpoint via `permission_classes = [IsAdminUser]` (Django) or equivalent.

---

## 🔌 Backend Integration

The admin uses **the same `/api/`** as the consumer app, plus optional admin-only endpoints under `/api/admin/`:

| Endpoint | Used by | Permission |
|----------|---------|------------|
| `GET /api/{{entity}}/` | Consumer + Admin | `IsAuthenticated` (filters by user) for consumer, `IsAdmin` for admin (sees all) |
| `POST /api/{{entity}}/` | Consumer + Admin | Same |
| `GET /api/admin/trash/` | Admin only | `IsAdmin` |
| `POST /api/admin/trash/{id}/restore/` | Admin only | `IsAdmin` |
| `GET /api/admin/audit/` | Admin only | `IsAdmin` |
| `GET /api/admin/stats/` | Admin only — for Dashboard | `IsAdmin` |

The admin's `services/api.js` is identical to web's, just with a different `baseURL` if needed (typically same backend).

---

## 🚦 Pre-merge Admin Checklist

- [ ] New app has `config.jsx`, `constants.js`, `pages/`, `tabs/InfoTab/`?
- [ ] All colors use `var(--admin-*)` (zero hex / hardcoded values)?
- [ ] All spacings use `var(--admin-space-*)`?
- [ ] All form fields go through `FormBuilder` (no manual `<input>`)?
- [ ] `tableColumns` and `formFields` extracted to `constants.js` (not inline in config)?
- [ ] Routes wired in `AdminApp.jsx` AND Sidebar entry added?
- [ ] `API_ENDPOINTS` centralized in `ini/config/endpoints.js` (not inline strings)?
- [ ] Soft delete tested (entity appears in `/trash/` after delete)?
- [ ] Audit entry created on every action (verify in `/history/`)?
- [ ] Auth gate works (non-admin user redirected)?

---

## 🚫 Anti-patterns banned

- Hardcoded `<input>` instead of `FormBuilder`
- Hex color in admin component CSS (must use `--admin-*`)
- Inline `apiEndpoint` strings instead of `API_ENDPOINTS.X`
- Recreating columns/fields inline in `config.jsx` instead of extracting to `constants.js`
- Tab content with business logic (tabs are pure render — logic goes in app hooks)
- Bypassing the role guard in `AdminApp.jsx`
- Skipping audit logging on a mutation endpoint
