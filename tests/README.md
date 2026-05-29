# Tests

Les tests unitaires vivent au plus près du code dans `packages/**/*.test.ts`.

Le smoke e2e frugal vit dans `tests/e2e/smoke.mjs`. Il démarre Next localement, vérifie les pages
critiques et appelle `/api/assistant` sans provider externe.

Règles :

- aucun appel API externe ;
- aucune dépendance à PostgreSQL ;
- couvrir les schémas Zod, retrievers, grounding policy et citations ;
- conserver `AI_PROVIDER=mock` pendant les tests.

Commandes :

```bash
pnpm test
pnpm test:e2e
pnpm test:postgres
pnpm test:e2e:postgres
```

Les deux commandes Postgres supposent une base de développement jetable dans `DATABASE_URL`. Les
tests standards restent indépendants de la base.
