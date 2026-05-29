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
  Schéma Drizzle, migrations, seed et repositories mock/postgres.

packages/ui
  Future base OpenCivic Kit.
```

## Flux De Données MVP

1. `packages/core/src/seed` expose des procédures demo et des procédures partiellement vérifiées.
2. `packages/db/src/repository.ts` fournit une API commune pour le mode mock et le mode Postgres.
3. `apps/web` lit les données via `@dossierbj/db/repository`, pas directement depuis les seeds.
4. Les pages affichent badges de statut, sources, faits vérifiables et avertissement indépendant.
5. `/api/assistant` récupère les chunks via le repository, puis appelle `@dossierbj/rag`.
6. CivicRAG retourne un `GroundedAnswer` structuré et persiste la requête seulement en mode Postgres.

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

La page `/sources/nouvelle` ajoute une couche de saisie locale : elle produit un brouillon JSON en
`localStorage`, sans écrire en base et sans appeler de service externe. Le passage du brouillon au
registre reste manuel pour garder une revue humaine avant toute exposition publique.

En mode Postgres, le seed idempotent transpose ces éléments dans les tables `official_sources`,
`source_documents`, `procedures`, `required_documents`, `procedure_steps`, `source_references`,
`procedure_claims`, `source_chunks`, `source_review_items` et `source_review_events`.

Les `ProcedureClaim` constituent le registre exploitable des affirmations : un coût, un délai, une
pièce, une étape ou un avertissement devient une ligne indépendante avec statut et sources. Cela
prépare l'audit humain, les futures interfaces éditoriales et l'indexation RAG sans ajouter de
service externe.

La page `/sources` agrège aussi la couverture des claims : volume total, pourcentage sourcé,
nombre d'affirmations critiques non vérifiées et répartition par fiche. Cette vue sert de tableau
de bord éditorial avant de construire un vrai back-office.

La page `/sources/claims` ajoute un cockpit local de revue : priorité, filtres, action suivante et
notes `localStorage`. Elle ne modifie pas les seeds ni Postgres ; elle réduit le risque éditorial
avant de créer une interface persistante.

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
- `DATA_MODE=postgres` : lecture via Drizzle et `DATABASE_URL`, avec procédures, sources, claims,
  chunks et requêtes assistant.
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
