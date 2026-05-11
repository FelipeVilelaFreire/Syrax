# SYRAX

> Plataforma B2B (SaaS) de inteligência de vendas focada em **recuperação de receita** para infoprodutores e e-commerces. Escuta webhooks de Kiwify e Hotmart, cria Leads automaticamente quando pagamentos são abandonados e apoia operadores a recuperar receita via WhatsApp.

---

## 🏗️ Arquitetura — 3 projetos

```
Syrax/
├── backend/     # Django 5 + DRF + SQLite (MVP) / PostgreSQL (prod)   :8001
├── web/         # Next.js 16 — app dos clientes (multi-tenant)         :3000
└── admin/       # Vite + React 19 — painel da equipe SYRAX             :5173
```

| Quem | Onde | Como acessa |
|------|------|-------------|
| **Equipe SYRAX** | `admin/` (`:5173`) | Login com `is_superuser=True`. Cria empresas, usuários, vê tudo. |
| **Admin do cliente** | `web/` (`:3000`) | Login com credenciais criadas pelo admin. Vê dados da Company dele. |
| **Operador do cliente** | `web/` (`:3000`) | Acesso reduzido — só telas operacionais. |

Modelo **white-glove**: clientes não se auto-cadastram. A SYRAX provisiona empresa + usuários pelo painel admin.

---

## 🚀 Setup rápido

**Requisitos:** Python 3.12 (via Conda), Node.js 20+, Windows Terminal.

```bash
# Clona o projeto e roda o setup
git clone https://github.com/FelipeVilelaFreire/Syrax.git
cd Syrax
setup.bat
```

O `setup.bat`:
1. Cria env Conda `syrax` com Python 3.12
2. Instala deps do backend, web e admin
3. Roda migrations (gera `db.sqlite3` automaticamente)
4. Pede pra criar o **super-admin** (email + nome + senha)
5. Abre o Windows Terminal com os 3 servidores rodando

Depois, pra desenvolver no dia-a-dia:

```bash
syrax.bat
```

Abre 1 aba Claude + 1 aba com 3 painéis (backend · web · admin).

---

## 🧱 Stack

| Camada | Stack |
|--------|-------|
| Backend | Django 5 · DRF · SimpleJWT · drf-spectacular · django-filter · psycopg2 |
| Banco | SQLite (MVP, default) → PostgreSQL (toggle `USE_POSTGRES=True`) |
| Web (cliente) | Next.js 16 (App Router) · React 19 · CSS Modules · Recharts · axios · FontAwesome |
| Admin (SYRAX) | Vite 6 · React 19 · React Router 7 · CSS Modules · axios · FontAwesome |
| i18n | `STRINGS` em `pt-BR.ts` + `en.ts` (TypeScript valida shape) |

---

## 📐 Princípios

```
backend    = SOURCE OF TRUTH   →  business rules, integridade, authorization em Django
hooks      = BRAIN             →  toda lógica de UI em web/src/hooks/
services   = HTTP LAYER        →  toda chamada de API em web/src/services/
components = RENDER ONLY       →  JSX + CSS. Zero lógica. Zero valores hardcoded.
```

Detalhes completos em [`CLAUDE.md`](./CLAUDE.md).

---

## 📂 Domínio

**Entidades principais:**
- **Company** (Tenant): workspace isolado. CNPJ, setor, `webhook_token` único.
- **User**: email login. Roles: `admin` ou `operator`. Flag `is_superuser` para a equipe SYRAX.
- **Lead**: cliente que abandonou compra. `status` (novo · em_contato · convertido · perdido), `score` (0-100), `abandon_type` (pix · boleto · cart).
- **Interaction**: cada ação registrada num Lead (msg enviada, nota, mudança de status).
- **Integration**: conexão com Kiwify, Hotmart, WhatsApp.

**Fluxo principal:**
```
Cliente abandona pagamento na Kiwify
    ↓ webhook POST /api/webhooks/kiwify/{token}/
SYRAX cria Lead automaticamente (status: novo)
    ↓
Operador clica "Acionar IA" → wa.me deep link + Interaction registrada
    ↓
Cliente paga → Lead vira convertido → KPI de Recuperações sobe
```

---

## 🌐 Endpoints principais

| Método | URL | Descrição |
|--------|-----|-----------|
| `POST` | `/api/users/login/` | Login (qualquer usuário) |
| `GET`  | `/api/users/me/` | Perfil atual |
| `GET`  | `/api/leads/` | Lista leads do tenant (filtra por `request.company`) |
| `POST` | `/api/leads/{id}/trigger-ai/` | Marca interação WhatsApp + atualiza status |
| `POST` | `/api/webhooks/kiwify/{token}/` | Recebe webhook Kiwify (auth via URL token) |
| `POST` | `/api/webhooks/hotmart/{token}/` | Recebe webhook Hotmart |
| `*`    | `/api/admin/companies/` | CRUD de Companies (super-admin only) |
| `*`    | `/api/admin/users/` | CRUD de Users (super-admin only) |

Docs OpenAPI: `http://localhost:8001/api/docs/`

---

## 📚 Documentação

| Doc | Conteúdo |
|-----|----------|
| [`CLAUDE.md`](./CLAUDE.md) | Regras do projeto, princípios, checklists pré-merge |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Arquitetura deep-dive (BFF, layers, hooks) |
| [`docs/BACKEND.md`](./docs/BACKEND.md) | Padrões Django (models, serializers, views, JWT) |
| [`docs/FRONTEND.md`](./docs/FRONTEND.md) | Padrões Next.js (routing, hooks, i18n) |
| [`docs/DESIGN.md`](./docs/DESIGN.md) | Design system (tokens, paleta, componentes) |

---

## 🎨 Brand

- **Cor primária:** `#B8901E` (gold antigo, refinado — não o gold brilhante padrão)
- **Background dark:** `#0A0A0A`
- **Tipografia:** Manrope (display) · Inter (body)

---

## 📝 Licença

Proprietário — todos os direitos reservados.
