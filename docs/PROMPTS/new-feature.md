# New Feature Prompt — Add a shared feature

> Use this when adding a feature reused across **2 or more routes**.
> If only 1 route uses it, keep it inline (don't create a feature folder).

---

## The Prompt

```
Add a feature: {{FEATURE_NAME}}.

What it does: {{ONE_PARAGRAPH_DESCRIPTION}}

Where it appears (routes): {{LIST_OF_ROUTES}}

Backend endpoints needed: {{ENDPOINTS_OR_"reuse existing"}}

Follow the rules in CLAUDE.md, ARCHITECTURE.md, FRONTEND.md, and BACKEND.md.

Steps to perform IN THIS ORDER:

1. BACKEND (if endpoints don't exist yet):
   - Create or update model in apps/{{domain}}/models.py
   - Read serializer + Write serializer in serializers.py
   - ViewSet filtering by company=self.request.company
   - Register URL in apps/{{domain}}/urls.py
   - Register in admin.py

2. FRONTEND TYPES — web/src/types/{{domain}}/index.ts

3. FRONTEND SERVICE — web/src/services/{{domain}}Service.ts

4. FRONTEND HOOK — web/src/hooks/{{domain}}/use{{Entity}}Screen.ts
   Standard: { data, loading, error, isSaving, handleSave, handleDelete, refresh }

5. FRONTEND STRINGS — pt-BR.ts AND en.ts (same change)

6. FRONTEND COMPONENT — web/src/components/features/{{Entity}}{{Variant}}/
   Pure render. Props in. No fetch. No router.

7. WIRE INTO ROUTES — screens use the hook, pages stay thin.
```
