# Contributing

Merci de vouloir contribuer à DossierBJ. Le projet avance avec une règle simple : aucune affirmation administrative sensible sans source vérifiable et sans avertissement clair quand l'information peut changer.

## Démarrer

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Le mode par défaut est local, mocké et sans API payante :

```env
DATA_MODE="mock"
AI_PROVIDER="mock"
ENABLE_VECTOR_SEARCH="false"
PAYMENTS_ENABLED="false"
ENABLE_AUTH="false"
```

## Avant Une Pull Request

Lancer au minimum :

```bash
pnpm format
pnpm lint
pnpm typecheck
pnpm test
pnpm build
pnpm test:e2e
```

Si la contribution touche PostgreSQL, lancer aussi :

```bash
pnpm db:reset:dev
pnpm test:postgres
pnpm test:e2e:postgres
```

## Règles Produit

- Ne jamais présenter une donnée demo comme information officielle.
- Ajouter une `SourceReference` pour tout frais, délai, pièce, condition ou étape sensible.
- Si une donnée vient d'une page officielle qui peut changer, garder une note de revérification avant paiement ou dépôt.
- Ne pas collecter ni committer de documents personnels, numéros d'identité ou secrets.
- Préférer une fiche prudente et incomplète à une fiche complète mais non sourcée.

## Où Contribuer

- `packages/core/src/seed/procedures.ts` : fiches démarches, pièces, étapes, faits vérifiés.
- `packages/core/src/seed/sources.ts` : sources officielles, documents et citations.
- `packages/core/src/seed/sourceRegistry.ts` : file de revue éditoriale.
- `apps/web/src/app/` : pages Next.js.
- `docs/` : architecture, roadmap, politiques et décisions.

## Pull Requests

Décrivez :

- le problème résolu ;
- les sources consultées ;
- les commandes de vérification lancées ;
- les limites restantes.

Les changements qui ajoutent des sources officielles doivent inclure un test ou renforcer `pnpm validate:sources`.
