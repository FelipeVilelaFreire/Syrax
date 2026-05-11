# New Screen Prompt — Add a screen following the 3-layer pattern

> Use this when adding a route that needs to fetch data and render a feature.

---

## The Prompt

```
Add a new screen: {{SCREEN_NAME}} at route {{ROUTE_PATH}}.

What it shows: {{ONE_PARAGRAPH_DESCRIPTION}}

Data source: {{API_ENDPOINT_OR_HOOK_NAME}}

Mobile layout: {{MOBILE_DESCRIPTION}}
Desktop layout: {{DESKTOP_DESCRIPTION}}

Follow CLAUDE.md, ARCHITECTURE.md, FRONTEND.md, and DESIGN.md.

Steps IN THIS ORDER:

1. CHECK existing types, services, hooks — reuse before creating.

2. LAYER 1 — app/{{ROUTE_PATH}}/page.tsx (~5 lines, zero logic)

3. LAYER 2 — web/src/screens/{{ScreenName}}/
   Calls hook → renders Skeleton / ErrorState / Feature
   Plus barrel index.ts

4. LAYER 3 — web/src/components/features/{{FeatureName}}/
   Pure UI. Props in. No fetch. No router.
   .module.css mobile-first, CSS Variables only.

5. STRINGS — every visible text from STRINGS.{domain}.{key}

6. ROUTES — add to web/src/constants/routes.ts
```
