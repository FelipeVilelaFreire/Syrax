# Bootstrap Prompt — Start a New Project

> Use this when initializing a brand-new project from scratch with the template.

---

## How to use

1. Copy this entire file content.
2. Open Claude Code in the empty project folder.
3. Paste, replacing `{{IDEA}}` with one sentence describing your app.
4. Answer the 5 questions Claude asks.
5. Claude scaffolds backend, frontend, and i18n.

---

## The Prompt

```
I want to build {{IDEA}}.

This project follows the rules in CLAUDE.md, ARCHITECTURE.md, BACKEND.md,
FRONTEND.md, and DESIGN.md (already in /docs).

Please ask me 5 short questions to clarify the domain before scaffolding.
After my answers:

1. Fill the placeholders in CLAUDE.md ({{PROJECT_NAME}}, {{ENTITIES}},
   {{USER_ROLES}}, {{INTEGRATIONS}}, {{PRIMARY_COLOR}}).
2. Scaffold backend/:
   - Django project with config/settings split (base/dev/prod)
   - apps/core/ with SoftDeleteModel
   - apps/users/ with custom User (email login) + JWT
   - One app per entity, with model + serializer + viewset + urls + admin
   - requirements.txt
   - .env.example
3. Scaffold web/:
   - Next.js 16 App Router project (TypeScript, no Tailwind)
   - src/ folder structure (components, screens, hooks, services, types,
     constants, lib, theme)
   - theme/globals.css with CSS Variables from DESIGN.md
   - constants/strings/{pt-BR,en,types,index}.ts with actions namespace
   - constants/routes.ts and constants/icons.ts
   - lib/storage.ts and lib/iconMapper.ts
   - services/api.ts (axios with JWT interceptors)
   - One feature folder per entity (with .module.css)
   - One screen per entity following the 3-layer pattern
4. Do NOT run npm install or python migrate — just scaffold the code.
5. End with a summary: list every file created and the next 3 commands
   I should run to get the system live (db setup, deps install, dev server).

Follow every rule strictly. No Tailwind. No hardcoded text. No raw fetch.
Mobile-first CSS. BFF philosophy.
```

---

## The 5 questions Claude will ask

1. **Project name** — short slug (kebab-case) for folder names, and a display name.
2. **Domain in one paragraph** — what does the app do, who is the user, what is the core action?
3. **Entities** — list 2-5 main domain entities with their key fields and relationships.
4. **User roles** — who can do what?
5. **Brand color** — primary accent (hex). If unsure, default to `#0066ff`.

---

## Next 3 commands after scaffold

```
1. cd backend && cp .env.example .env && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
2. createdb syrax_db && python manage.py migrate && python manage.py createsuperuser
3. cd ../web && npm install && npm run dev
```
