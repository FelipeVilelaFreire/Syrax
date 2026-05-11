# Frontend — Next.js

> Concrete patterns for the Next.js side. Read this when creating routes, screens, components, hooks, services, or wiring i18n.

Stack: **Next.js 16 (App Router) + CSS Modules + TypeScript + axios + i18n via TS files**.
**No Tailwind. No CSS-in-JS. No utility libraries.**

---

## 📁 Frontend Folder Structure

```
web/
├── app/                          # File-based routing (Next App Router)
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (main)/
│   │   ├── layout.tsx            # Auth-protected layout
│   │   ├── dashboard/page.tsx
│   │   └── {{entity}}/[id]/page.tsx
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Imports theme/globals.css
│   └── not-found.tsx
│
├── src/
│   ├── components/
│   │   ├── ui/                   # Primitives — Button, Input, Modal, Icon, Skeleton
│   │   ├── shared/               # Layout, Header, BottomNav
│   │   ├── features/             # Cross-route reusable UIs (OrderDetail, CartView)
│   │   ├── modals/               # Reusable modals
│   │   └── cards/                # List item cards
│   │
│   ├── screens/                  # Fetch layer (between app/ and features/)
│   │   └── OrderScreen/
│   │       ├── OrderScreen.tsx
│   │       └── index.ts
│   │
│   ├── hooks/                    # BRAIN — all logic
│   │   ├── order/
│   │   ├── auth/
│   │   └── shared/               # useDebounce, useDelayedLoading, etc.
│   │
│   ├── services/                 # HTTP layer
│   │   ├── api.ts                # axios instance + interceptors
│   │   ├── orderService.ts
│   │   └── authService.ts
│   │
│   ├── types/                    # Domain contracts
│   │   ├── order/index.ts
│   │   └── user/index.ts
│   │
│   ├── constants/
│   │   ├── strings/              # i18n
│   │   ├── icons.ts              # ICON_NAMES enum
│   │   └── routes.ts             # ROUTES helper
│   │
│   ├── lib/
│   │   ├── iconMapper.ts         # FontAwesome registration + aliases
│   │   ├── storage.ts            # localStorage abstraction
│   │   └── auth.ts               # token helpers
│   │
│   ├── theme/
│   │   └── globals.css           # CSS Variables (the single source of design tokens)
│   │
│   └── contexts/                 # React contexts (rarely needed)
│       └── AuthContext.tsx
│
├── public/                       # Static assets
├── next.config.ts
├── tsconfig.json
└── package.json
```

---

## 🛣️ Routing — App Router Conventions

### Route Groups

Use `(name)` route groups to scope layouts without affecting URLs.

```
app/
├── (auth)/              # No URL prefix, but its own layout
│   ├── layout.tsx       # Centered card layout
│   ├── login/page.tsx
│   └── register/page.tsx
└── (main)/              # No URL prefix, auth-protected
    ├── layout.tsx       # Header + sidebar
    ├── dashboard/page.tsx
    └── orders/[id]/page.tsx
```

### Layout patterns

```typescript
// app/(main)/layout.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from '@/src/lib/auth';
import { Header } from '@/src/components/shared/Header';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession();
  if (!session) redirect('/login');

  return (
    <div>
      <Header user={session.user} />
      <main>{children}</main>
    </div>
  );
}
```

### Page = thin wrapper

```typescript
// app/(main)/orders/[id]/page.tsx
import { OrderScreen } from '@/src/screens/OrderScreen';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <OrderScreen id={Number(id)} />;
}
```

5 lines. Zero logic. Zero styles.

---

## 🌐 Service Layer — `axios` instance

```typescript
// src/services/api.ts
import axios from 'axios';
import { getAccessToken, refreshAccessToken, clearTokens } from '@/src/lib/auth';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        await refreshAccessToken();
        return api(error.config);
      } catch {
        clearTokens();
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
```

### Service file pattern

```typescript
// src/services/orderService.ts
import { api } from './api';
import type { Order, OrderCreateData, OrderUpdateData } from '@/src/types/order';
import type { PaginatedResponse } from '@/src/types/shared';

export const orderService = {
  list: async (params?: { status?: string }) => {
    const { data } = await api.get<PaginatedResponse<Order>>('/orders/', { params });
    return data;
  },
  retrieve: async (id: number) => {
    const { data } = await api.get<Order>(`/orders/${id}/`);
    return data;
  },
  create: async (payload: OrderCreateData) => {
    const { data } = await api.post<Order>('/orders/', payload);
    return data;
  },
  update: async (id: number, payload: OrderUpdateData) => {
    const { data } = await api.patch<Order>(`/orders/${id}/`, payload);
    return data;
  },
  delete: async (id: number) => api.delete(`/orders/${id}/`),
  cancel: async (id: number) => {
    const { data } = await api.post<Order>(`/orders/${id}/cancel/`);
    return data;
  },
};
```

Rules:
- One service file per domain
- Always typed with the matching `src/types/{domain}/` interfaces
- Custom actions are methods (`cancel`, `submit`, etc.)
- Components and hooks **never** call `api` directly — always through a service.

---

## 🪝 Hook Patterns

### Screen hook — full lifecycle

```typescript
// src/hooks/order/useOrderScreen.ts
import { useEffect, useState, useCallback } from 'react';
import { orderService } from '@/src/services/orderService';
import { getErrorMessage } from '@/src/lib/errors';
import type { Order, OrderUpdateData } from '@/src/types/order';

export interface UseOrderScreenOptions {
  id: number;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

export interface UseOrderScreenReturn {
  data: Order | null;
  loading: boolean;
  error: string | null;
  isSaving: boolean;
  handleSave: (payload: OrderUpdateData) => Promise<void>;
  handleDelete: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useOrderScreen({ id, onSuccess, onError }: UseOrderScreenOptions): UseOrderScreenReturn {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await orderService.retrieve(id));
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  const handleSave = useCallback(async (payload: OrderUpdateData) => {
    setIsSaving(true);
    try {
      const updated = await orderService.update(id, payload);
      setData(updated);
      onSuccess?.();
    } catch (err) {
      onError?.(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  }, [id, onSuccess, onError]);

  const handleDelete = useCallback(async () => {
    try {
      await orderService.delete(id);
      onSuccess?.();
    } catch (err) {
      onError?.(getErrorMessage(err));
    }
  }, [id, onSuccess, onError]);

  return { data, loading, error, isSaving, handleSave, handleDelete, refresh };
}
```

### Form hook — pure state

```typescript
// src/hooks/order/useOrderForm.ts
import { useState, useMemo, useCallback } from 'react';
import type { OrderCreateData } from '@/src/types/order';
import { STRINGS } from '@/src/constants/strings';

interface FormState {
  status: string;
  totalAmount: string;
  notes: string;
}

export function useOrderForm(initial?: Partial<FormState>) {
  const [form, setForm] = useState<FormState>({
    status: initial?.status ?? 'pending',
    totalAmount: initial?.totalAmount ?? '',
    notes: initial?.notes ?? '',
  });

  const errors = useMemo(() => {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.totalAmount || Number(form.totalAmount) <= 0) {
      e.totalAmount = STRINGS.order.errors.totalRequired;
    }
    return e;
  }, [form]);

  const isValid = Object.keys(errors).length === 0;

  const setField = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const toCreateData = useCallback((): OrderCreateData => ({
    status: form.status as OrderCreateData['status'],
    total_amount: Number(form.totalAmount),
    notes: form.notes,
  }), [form]);

  return { form, errors, isValid, setField, toCreateData };
}
```

---

## 🌐 i18n — Strings via TS files

### Folder structure

```
src/constants/strings/
├── pt-BR.ts          # Default
├── en.ts             # Same shape
├── types.ts          # Type extracted from pt-BR
└── index.ts          # Exports STRINGS based on locale
```

### Default file

```typescript
// src/constants/strings/pt-BR.ts
export const PT_BR = {
  actions: {
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    back: 'Voltar',
    add: 'Adicionar',
    create: 'Criar',
    close: 'Fechar',
    loading: 'Carregando...',
    saving: 'Salvando...',
  },
  auth: {
    login: { title: 'Entrar', emailPlaceholder: 'seu@email.com', passwordPlaceholder: 'Senha' },
    register: { title: 'Criar conta' },
  },
  order: {
    title: 'Pedidos',
    detail: { title: 'Detalhes do pedido' },
    errors: { totalRequired: 'O total deve ser maior que zero.' },
    itemCount: (n: number) => `${n} ${n === 1 ? 'item' : 'itens'}`,
  },
} as const;
```

### Mirror in English

```typescript
// src/constants/strings/en.ts
import type { Strings } from './types';

export const EN: Strings = {
  actions: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    back: 'Back',
    add: 'Add',
    create: 'Create',
    close: 'Close',
    loading: 'Loading...',
    saving: 'Saving...',
  },
  auth: {
    login: { title: 'Sign in', emailPlaceholder: 'your@email.com', passwordPlaceholder: 'Password' },
    register: { title: 'Create account' },
  },
  order: {
    title: 'Orders',
    detail: { title: 'Order details' },
    errors: { totalRequired: 'Total must be greater than zero.' },
    itemCount: (n) => `${n} ${n === 1 ? 'item' : 'items'}`,
  },
};
```

### Type contract

```typescript
// src/constants/strings/types.ts
import type { PT_BR } from './pt-BR';
export type Strings = typeof PT_BR;
```

```typescript
// src/constants/strings/index.ts
import { PT_BR } from './pt-BR';
import { EN } from './en';

const LOCALE = (process.env.NEXT_PUBLIC_LOCALE ?? 'pt-BR') as 'pt-BR' | 'en';
export const STRINGS = LOCALE === 'en' ? EN : PT_BR;
```

If `EN` ever drifts from `PT_BR` shape, TypeScript fails compilation.

---

## 🎨 Component Patterns

### Standard component file

```typescript
// src/components/features/OrderDetail/OrderDetail.tsx
import styles from './OrderDetail.module.css';
import { Icon } from '@/src/components/ui/Icon';
import { ICON_NAMES } from '@/src/constants/icons';
import { STRINGS } from '@/src/constants/strings';
import type { Order, OrderUpdateData } from '@/src/types/order';

export interface OrderDetailProps {
  order: Order;
  onSave: (data: OrderUpdateData) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function OrderDetail({ order, onSave, onDelete }: OrderDetailProps) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{STRINGS.order.detail.title}</h1>
        <span className={styles.statusText}>{order.status_display}</span>
      </header>
      <div className={styles.amount}>{order.total_amount}</div>
      {/* ... */}
    </div>
  );
}
```

### Barrel export

```typescript
// src/components/features/OrderDetail/index.ts
export { OrderDetail } from './OrderDetail';
export type { OrderDetailProps } from './OrderDetail';
```

---

## 📱 Mobile-First Responsive

CSS uses `@media (min-width: 769px)` to **add** desktop styles on top of mobile defaults.

```css
/* src/components/features/OrderDetail/OrderDetail.module.css */

.container {
  /* Mobile defaults — single column, full width */
  display: flex;
  flex-direction: column;
  padding: var(--spacing-lg);
  gap: var(--spacing-md);
}

@media (min-width: 769px) {
  .container {
    /* Desktop — two columns, more breathing room */
    display: grid;
    grid-template-columns: 2fr 1fr;
    padding: var(--spacing-3xl);
    gap: var(--spacing-2xl);
  }
}
```

### Mobile vs Desktop swaps

| Element | Mobile (≤768px) | Desktop (≥769px) |
|---------|-----------------|------------------|
| Modal | `<BottomModal>` (slides from bottom) | `<Modal>` (centered) |
| Buttons | Full width | Auto width |
| Page header | Often hidden | Always visible |
| Tabs/filters | Horizontal scroll | Inline row |
| Detail layout | Single column | Sidebar + content |

When a UI primitive has both forms, expose a single component that branches internally:

```typescript
// src/components/ui/ResponsiveModal/ResponsiveModal.tsx
'use client';
import { useMediaQuery } from '@/src/hooks/shared/useMediaQuery';
import { BottomModal } from './BottomModal';
import { Modal } from './Modal';

export function ResponsiveModal(props: ResponsiveModalProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <BottomModal {...props} /> : <Modal {...props} />;
}
```

---

## 🎨 Icon System

```
Component file uses string  →  <Icon name="trash" />
                                    ↓
                                getIcon(name)
                                    ↓
                            iconMapper.ts resolves
                              [aliases → library lookup → fallback]
```

### Single source of FA imports

```typescript
// src/lib/iconMapper.ts
import { library, IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faStar, faTrash, faPencil, faChevronRight, faPlus, faXmark,
  /* ...register every icon used in the app */
} from '@fortawesome/free-solid-svg-icons';

library.add(faStar, faTrash, faPencil, faChevronRight, faPlus, faXmark);

const aliasMap: Record<string, string> = {
  // FA5 → FA6 renames
  'pencil-alt': 'pencil',
  'times': 'xmark',
  // semantic aliases
  'edit': 'pencil',
  'remove': 'trash',
};

export function resolveIconName(name: string): string {
  return aliasMap[name] ?? name;
}
```

### Icon component

```typescript
// src/components/ui/Icon/Icon.tsx
'use client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { resolveIconName } from '@/src/lib/iconMapper';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

export function Icon({ name, size = 16, color, className }: IconProps) {
  return (
    <FontAwesomeIcon
      icon={['fas', resolveIconName(name)] as never}
      style={{ fontSize: size, color }}
      className={className}
    />
  );
}
```

Usage:
```typescript
import { Icon } from '@/src/components/ui/Icon';
import { ICON_NAMES } from '@/src/constants/icons';

<Icon name={ICON_NAMES.trash} size={20} />
```

Never import FA icons directly inside a feature — only `iconMapper.ts` knows about FA.

---

## 🛣️ ROUTES Constant

```typescript
// src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  ORDER: (id: number) => `/orders/${id}`,
  ORDERS: '/orders',
  PROFILE: '/profile',
} as const;
```

Always use `ROUTES.ORDER(id)`, never raw `/orders/${id}`. Renaming a route becomes a one-file change.

---

## 💾 Storage Adapter

```typescript
// src/lib/storage.ts
const isClient = typeof window !== 'undefined';

export const storage = {
  get: (key: string) => (isClient ? localStorage.getItem(key) : null),
  set: (key: string, value: string) => { if (isClient) localStorage.setItem(key, value); },
  remove: (key: string) => { if (isClient) localStorage.removeItem(key); },
  clear: () => { if (isClient) localStorage.clear(); },
};
```

Used by `auth.ts` to store JWT tokens. Never call `localStorage` directly.

---

## ❌ Error Handling

```typescript
// src/lib/errors.ts
import { isAxiosError } from 'axios';
import { STRINGS } from '@/src/constants/strings';

export function getErrorMessage(err: unknown): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string') return data;
    if (data?.detail) return data.detail;
    if (data && typeof data === 'object') {
      const first = Object.values(data)[0];
      return Array.isArray(first) ? first[0] : String(first);
    }
  }
  return STRINGS.errors.generic;
}
```

---

## 🚦 Pre-merge Frontend Checklist

- [ ] No raw `fetch` / `axios` calls outside `src/services/`?
- [ ] No `useState` for fetched data inside a component (only inside hooks)?
- [ ] No hardcoded text in JSX (everything via `STRINGS`)?
- [ ] No Tailwind classes (only `.module.css` + CSS Variables)?
- [ ] Component has its own folder with `Component.tsx` + `Component.module.css` + `index.ts`?
- [ ] CSS uses `var(--token)` for colors, spacing, fonts, radii, shadows?
- [ ] Mobile-first CSS (default = mobile, `@media (min-width: 769px)` adds desktop)?
- [ ] New strings added to both `pt-BR.ts` AND `en.ts`?
- [ ] New icons registered in `iconMapper.ts`?
- [ ] New routes added to `ROUTES` constant?
- [ ] Domain types in `src/types/{domain}/` (not local)?
