# DossierBJ Platform

DossierBJ Platform est une base de plateforme documentaire civique et économique. Le MVP, **DossierBJ Core**, aide à comprendre, préparer et suivre des démarches à partir de sources vérifiables. Le moteur documentaire prévu s'appelle **CivicRAG**.

> DossierBJ est un assistant indépendant. Il ne remplace pas les plateformes officielles. Les données actuelles sont des données de démonstration non officielles.

## Statut

MVP DossierBJ Core en mode frugal : monorepo pnpm, app web Next.js, recherche locale de démarches, fiches partiellement sourcées, checklist personnalisée, assistant CivicRAG mock/keyword, page sources à vérifier et tests unitaires sans API externe.

Audit critique initial effectué : le dépôt démarre en mode mock sans API payante, les seeds demo utilisent des URLs réservées non officielles, `AI_PROVIDER=mock` est résolu explicitement, et `DATA_MODE=mock` est testé sans `DATABASE_URL`.

Sprint Core concret ajouté : la création d'entreprise, le casier judiciaire et l'extrait RCCM disposent maintenant de sources connectées manuellement, de statuts `partially_verified`, et d'une matrice "affirmation -> source". Les autres fiches restent explicitement demo non officielles.

## Stack

- TypeScript strict
- Next.js App Router
- React
- Tailwind CSS
- pnpm workspace
- Zod
- Drizzle ORM préparé pour PostgreSQL
- Vitest
- ESLint et Prettier

## Installation

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Ouvrir ensuite [http://localhost:3000](http://localhost:3000).

## Commandes

```bash
pnpm dev
pnpm build
pnpm lint
pnpm typecheck
pnpm test
```

## Architecture

```text
apps/web        Application Next.js mobile-first
packages/core   Schémas domaine, recherche, checklists, sources demo, helpers
packages/rag    CivicRAG mocké, retrievers, policies, providers
packages/db     Schéma Drizzle préparé pour PostgreSQL
packages/ui     Future couche OpenCivic Kit, non branchée dans l'app MVP
docs            Vision, architecture, politiques et roadmap
```

## Surfaces MVP

- `/demarches` : recherche keyword locale, filtres par catégorie, profil et statut.
- `/demarches/[slug]` : fiche démarche avec besoin utilisateur, faits sourcés, points à vérifier, sources par pièce/étape, avertissements et checklist interactive.
- `/assistant` : assistant mock/keyword avec citations, confiance et informations manquantes.
- `/sources` : mini back-office fichier-based pour les sources connectées ou à vérifier.
- `/api/health` et `/api/assistant` : endpoints locaux sans appel externe.

## Mode Mock

Le mode par défaut ne dépend d'aucune API payante :

```env
DATA_MODE="mock"
AI_PROVIDER="mock"
ENABLE_VECTOR_SEARCH="false"
PAYMENTS_ENABLED="false"
ENABLE_AUTH="false"
```

Les pages et l'API `/api/assistant` utilisent des données seedées marquées comme non officielles.

`AI_PROVIDER=mock` est le seul provider activé dans le MVP. Un provider réel comme OpenAI doit être ajouté via un adapter explicite avant utilisation ; il ne sera pas appelé silencieusement.

`DATA_MODE=mock` ne crée aucun client base de données et ne demande pas `DATABASE_URL`. `DATA_MODE=postgres` est préparé mais volontairement hors chemin critique.

## Gestion Locale Des Sources

Le MVP ne scrape pas. Les sources sont ajoutées par revue humaine et gérées dans :

```text
packages/core/src/seed/sourceRegistry.ts
```

La page `/sources` affiche cette file de revue et le workflow d'ingestion manuelle. Une source ne doit devenir vérifiée qu'après revue humaine, rattachement aux `SourceReference`, et tests mis à jour.

Sources connectées manuellement au 2026-05-19 :

- MonEntreprise.bj pour création d'entreprise, coûts/délais, pièces et certificats.
- Portail du Numérique pour le service casier judiciaire et l'extrait RCCM.
- URLs service-public.bj liées depuis le Portail du Numérique, encore en revue humaine pour les détails opérationnels.

## Variables D'environnement

Voir `.env.example`. Les clés réelles ne doivent jamais être committées. PostgreSQL, provider IA, paiements et auth sont prévus mais désactivés par défaut.

## Roadmap Courte

1. Extraire les pièces par forme juridique pour la création d'entreprise.
2. Compléter la revue humaine service-public.bj pour casier judiciaire et extrait RCCM.
3. Ajouter un historique de changement des sources et dates de dernière consultation.
4. Brancher PostgreSQL en mode optionnel.
5. Enrichir CivicRAG avec un retrieval local indexé avant toute vector DB externe.

## Limites Connues

- Certaines fiches restent des placeholders demo, pas des informations administratives.
- Les sources officielles connectées sont encore un corpus manuel minimal, pas une ingestion complète.
- Les informations partiellement vérifiées doivent être revérifiées sur les plateformes officielles avant toute décision.
- Pas d'authentification, paiement, OCR, embeddings ou base distante obligatoire.
- OpenCivic Kit existe comme package préparatoire, mais n'est pas encore publié ni consommé par l'app.
- AO Radar est limité au modèle `Opportunity` et à la documentation.

## Stratégie Open Source

OpenCivic Kit pourra exposer des composants UI, types TypeScript publics, helpers de citation/checklist et documentation. Le corpus enrichi, les prompts critiques, workflows premium, scoring et analytics business restent propriétaires.

## Documents À Lire

- `docs/PROJECT_BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/RAG_POLICY.md`
- `docs/DEV_SETUP.md`
