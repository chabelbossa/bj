# Tests

Les tests unitaires vivent au plus près du code dans `packages/**/*.test.ts`.

Règles :

- aucun appel API externe ;
- aucune dépendance à PostgreSQL ;
- couvrir les schémas Zod, retrievers, grounding policy et citations ;
- conserver `AI_PROVIDER=mock` pendant les tests.
