# Architecture

## Vue D'ensemble

DossierBJ utilise un monorepo pnpm simple et frugal. L'objectif est de pouvoir lancer le MVP localement sans base distante ni API payante, tout en préparant les points d'extension vers PostgreSQL, un vrai moteur RAG, des paiements et des modules premium.

```text
apps/web
  Application Next.js App Router, UI mobile-first en français.

packages/core
  Schémas domaine, types, données seedées, helpers.

packages/rag
  CivicRAG mocké : retrievers, grounding policy, providers IA.

packages/db
  Schéma Drizzle pour PostgreSQL futur.

packages/ui
  Future base OpenCivic Kit.
```

## Flux De Données MVP

1. `packages/core/src/seed` expose des procédures demo et des procédures partiellement vérifiées.
2. `apps/web` lit ces données via `@dossierbj/core`.
3. Les pages affichent badges de statut, sources, faits vérifiables et avertissement indépendant.
4. `/api/assistant` appelle `@dossierbj/rag` en mode mock.
5. CivicRAG retourne un `GroundedAnswer` structuré.

## Flux D'ingestion Manuelle

```text
Source candidate
  -> sourceRegistry.ts
  -> revue humaine datée
  -> OfficialSource / SourceDocument
  -> SourceReference
  -> ProcedureFact, pièces, étapes
  -> tests
  -> affichage public
```

Ce flux reste volontairement fichier-based pour éviter une base obligatoire au MVP.

## Flux RAG

```text
Question utilisateur
  -> retriever keyword/mock
  -> résultats avec chunks et sourceRefs
  -> grounding policy
  -> provider IA mock
  -> GroundedAnswer avec citations, confiance et limites
```

Le provider IA réel doit rester derrière une interface. `AI_PROVIDER=mock` est le défaut.

## Séparation Mock / Production

- `DATA_MODE=mock` : seed local, aucun Postgres.
- `DATA_MODE=postgres` : future lecture via Drizzle et `DATABASE_URL`.
- `AI_PROVIDER=mock` : réponses contrôlées sans coût.
- Provider réel : uniquement si clé API disponible et tests isolés.

## Futures Intégrations

- PostgreSQL avec Drizzle.
- Stockage objet pour documents sources.
- Embeddings locaux ou provider optionnel.
- Paiements manuels puis provider réel.
- Auth légère si nécessaire.
- AO Radar via `Opportunity`.

## Principes

- Monolithe modulaire avant microservices.
- Données sourcées avant automatisation.
- Interfaces abstraites avant services payants.
- Tests locaux avant intégrations externes.
