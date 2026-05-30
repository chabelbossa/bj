# DossierBJ Platform

DossierBJ Platform est une base de plateforme documentaire civique et économique. Le MVP, **DossierBJ Core**, aide à comprendre, préparer et suivre des démarches à partir de sources vérifiables. Le moteur documentaire prévu s'appelle **CivicRAG**.

> DossierBJ est un assistant indépendant. Il ne remplace pas les plateformes officielles. Les informations critiques restent rattachées à des sources et doivent être revérifiées avant usage administratif.

## Statut

Beta Core DossierBJ en mode frugal : monorepo pnpm, app web Next.js, recherche locale de démarches, cinq fiches partiellement sourcées, checklist personnalisée sauvegardée dans le navigateur, assistant CivicRAG mock/keyword, page sources à vérifier, revue éditoriale locale des claims, Digital Pulse, pilote AO Radar, OpenCivic Kit consommé par l'app et tests sans API payante.

Audit critique initial effectué : le dépôt démarre en mode mock sans API payante, `AI_PROVIDER=mock` est résolu explicitement, et `DATA_MODE=mock` est testé sans `DATABASE_URL`.

Sprint Core concret ajouté : création d'entreprise, casier judiciaire, extrait RCCM, certificat d'identification personnelle et attestation de régularité fiscale foncière disposent maintenant de sources connectées, de statuts `partially_verified`, et d'une matrice "affirmation -> source". Les fiches `service-public.bj` incluent les coûts, délais, publics et pièces visibles au 2026-05-30.

PostgreSQL est optionnel mais fonctionnel : `DATA_MODE=mock` reste le défaut, tandis que `DATA_MODE=postgres` lit les procédures, sources, claims, opportunités AO Radar, chunks RAG et requêtes assistant depuis la base après migration et seed. Les notes de claims et brouillons source passent par les audit logs quand PostgreSQL est activé.

Le dépôt est prêt pour contribution publique : licence MIT, guide de contribution, code de conduite, politique sécurité, templates GitHub, Dependabot et workflow CI mock/PostgreSQL.

## Stack

- TypeScript strict
- Next.js App Router
- React
- Tailwind CSS
- pnpm workspace
- Zod
- Drizzle ORM avec PostgreSQL optionnel
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
pnpm monitor:sources
pnpm validate:sources
pnpm test:postgres
pnpm test:e2e
pnpm test:e2e:postgres
pnpm db:reset:dev
pnpm db:seed
```

`pnpm test:postgres`, `pnpm test:e2e:postgres` et `pnpm db:reset:dev` supposent une base de développement jetable dans `DATABASE_URL`.

## Vérification Locale

Dernière vérification complète effectuée le 2026-05-30 en mode mock et PostgreSQL local :

```bash
pnpm format
pnpm test
pnpm typecheck
pnpm lint
pnpm validate:sources
pnpm monitor:sources
pnpm build
pnpm test:e2e
pnpm test:postgres
pnpm test:e2e:postgres
```

Résultats observés :

- Tests unitaires/domaines : 52 tests passés, 2 tests ignorés volontairement.
- Tests PostgreSQL : 2 tests d'intégration passés sur la base locale `bj`.
- Smoke e2e mock et PostgreSQL : `/api/health`, `/demarches`, `/demarches/creation-entreprise`, `/sources`, `/sources/claims`, `/sources/nouvelle`, `/sources/source-review-business-creation`, `/pulse`, `/ao-radar`, `/open-civic-kit`, `/api/assistant`, `/api/source-candidates` et `/api/claim-review-notes` répondent en `200`.
- Build Next.js production : réussi avec 20 routes app générées, dont `/ao-radar`, `/pulse`, `/open-civic-kit` et les deux API éditoriales.
- Validation sources : 0 erreur, 0 avertissement.
- Moniteur sources : 4 services `service-public.bj` contrôlés, 0 changement détecté.
- Captures navigateur intégrées prises depuis le serveur local en mode mock, avec contrôle responsive mobile sur les nouveaux écrans et correction du débordement horizontal de `/sources/claims`.

Captures de référence :

![Accueil DossierBJ](docs/screenshots/home-final.png)

![Démarches DossierBJ](docs/screenshots/demarches-final.png)

![AO Radar](docs/screenshots/ao-radar-final.png)

![Digital Pulse](docs/screenshots/pulse-final.png)

![Back-office sources](docs/screenshots/sources-final.png)

![Claims mobile](docs/screenshots/claims-mobile-final.png)

## Architecture

```text
apps/web        Application Next.js mobile-first
packages/core   Schémas domaine, recherche, checklists, sources, moniteur et helpers
packages/rag    CivicRAG mocké, retrievers, policies, providers
packages/db     Schéma Drizzle, migrations, seed et repositories mock/postgres
packages/ui     OpenCivic Kit MVP consommé par l'app web
docs            Vision, architecture, politiques et roadmap
```

## Surfaces MVP

- `/demarches` : recherche keyword locale, filtres par catégorie, profil et statut.
- `/demarches/[slug]` : fiche démarche avec besoin utilisateur, faits sourcés, registre de claims, points à vérifier, sources par pièce/étape, avertissements et checklist interactive.
- `/assistant` : assistant mock/keyword avec citations, confiance et informations manquantes.
- `/sources` : mini back-office versionné pour les sources connectées, la validation et la couverture des claims.
- `/sources/[id]` : détail de revue source avec checklist, historique, démarches liées et claims associés.
- `/sources/claims` : cockpit éditorial pour prioriser les claims à revoir, noter localement et synchroniser en audit logs PostgreSQL quand disponible.
- `/sources/nouvelle` : formulaire `localStorage` + API optionnelle pour préparer une source candidate sans auth, scraping ou DB obligatoire.
- `/methode-verification` : méthode de revue humaine, citations et niveaux de confiance.
- `/pulse` : métriques locales du corpus et liste des snapshots `service-public.bj` surveillés.
- `/ao-radar` : pilote appels d'offres avec source officielle `gouv.bj`, dates à revérifier et checklist de pré-soumission.
- `/open-civic-kit` : manifest du package `@dossierbj/ui` réellement consommé par l'application.
- `/api/health` : indique le mode actif et l'état DB.
- `/api/assistant` : endpoint local sans provider IA payant.
- `/api/source-candidates` et `/api/claim-review-notes` : persistance éditoriale optionnelle via audit logs PostgreSQL.

## Mode Mock

Le mode par défaut ne dépend d'aucune API payante :

```env
DATA_MODE="mock"
AI_PROVIDER="mock"
ENABLE_VECTOR_SEARCH="false"
PAYMENTS_ENABLED="false"
ENABLE_AUTH="false"
```

Les pages et l'API `/api/assistant` utilisent le corpus seedé et conservent les réserves de vérification sur les informations sensibles.

`AI_PROVIDER=mock` est le seul provider activé dans le MVP. Un provider réel comme OpenAI doit être ajouté via un adapter explicite avant utilisation ; il ne sera pas appelé silencieusement.

`DATA_MODE=mock` ne crée aucun client base de données et ne demande pas `DATABASE_URL`.

## Mode Postgres Optionnel

Pour tester la persistance réelle :

```env
DATA_MODE="postgres"
DATABASE_URL="postgresql://..."
AI_PROVIDER="mock"
```

Commandes utiles :

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:reset:dev
pnpm test:postgres
pnpm test:e2e:postgres
```

Le seed est idempotent et alimente les sources, documents, procédures, pièces, étapes, claims, références, chunks RAG, opportunités AO Radar et événements de revue. Les tests Postgres sont séparés du test standard pour préserver un démarrage sans base.

## Gestion Locale Des Sources

Le MVP ne scrape pas. Les sources sont ajoutées par revue humaine et gérées dans :

```text
packages/core/src/seed/sourceRegistry.ts
```

La page `/sources` affiche cette file de revue, les sources exposées, les documents, la couverture des claims, l'état de validation et le workflow d'ingestion manuelle. Une source ne doit devenir vérifiée qu'après revue contrôlée, rattachement aux `SourceReference`, et tests mis à jour.

La page `/sources/claims` crée une file de travail éditoriale : priorité critique/haute/moyenne/basse, filtres par fiche/type/statut, notes locales, export JSON et synchronisation audit-log quand `DATA_MODE=postgres`. Elle ne modifie pas le corpus ; elle prépare la revue humaine avant édition des seeds.

La page `/sources/nouvelle` génère un brouillon local en JSON à partir d'un formulaire. Ce brouillon reste dans le navigateur et peut aussi être conservé en audit log PostgreSQL ; il ne rend aucune information officielle sans revue contrôlée.

Sources connectées :

- MonEntreprise.bj pour création d'entreprise, coûts/délais, pièces et certificats.
- Portail du Numérique pour le service casier judiciaire et l'extrait RCCM.
- Service-public.bj pour les fiches casier judiciaire, extrait RCCM, CIP et attestation de régularité fiscale foncière, avec extraction prudente du coût, délai, public cible, pièces et étapes principales le 2026-05-30.
- Gouv.bj pour le pilote AO Radar et les opportunités de marchés publics à revérifier.

Surveillance gratuite :

```bash
pnpm monitor:sources
```

La commande interroge l'API publique `service-public.bj` pour les services connectés et signale les changements de statut, frais, délais ou pièces.

## Variables D'environnement

Voir `.env.example`. Les clés réelles ne doivent jamais être committées. PostgreSQL, provider IA, paiements et auth sont prévus mais désactivés par défaut.

## Roadmap Courte

1. Extraire les pièces par forme juridique pour la création d'entreprise.
2. Étendre le moniteur source à plus de services officiels quand le corpus grandit.
3. Ajouter de vrais tests navigateur quand le budget de dépendances Playwright est accepté.
4. Enrichir CivicRAG avec un retrieval local indexé avant toute vector DB externe.
5. Transformer AO Radar en ingestion contrôlée après revue juridique et commerciale.

## Frontières MVP Volontaires

- Les sources officielles connectées forment un corpus manuel prioritaire, pas une ingestion complète du pays.
- Les informations partiellement vérifiées doivent être revérifiées sur les plateformes officielles avant toute décision.
- Pas d'authentification, paiement, OCR, embeddings ou base distante obligatoire : ce sont des choix frugaux, pas des dépendances manquantes.
- Les claims sont explicites, persistés, résumés par couverture et revus dans un cockpit, mais le corpus public reste modifié par pull request.
- OpenCivic Kit est consommé en workspace ; sa publication npm reste une étape communautaire future.
- AO Radar est un pilote sourcé, pas encore une ingestion automatisée d'appels d'offres.

## Stratégie Open Source

OpenCivic Kit expose déjà des helpers publics (`cn`, `formatFcfa`, `verificationTone`) consommés par l'app. Le corpus enrichi, les prompts critiques, workflows premium, scoring et analytics business restent propriétaires.

## Contribution

- Lire `CONTRIBUTING.md` avant d'ouvrir une pull request.
- Utiliser les templates GitHub pour bugs, sources et demandes de fonctionnalité.
- Lancer `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm validate:sources`, `pnpm monitor:sources`, `pnpm build` et `pnpm test:e2e` avant publication.
- Pour les changements de données PostgreSQL : lancer aussi `pnpm db:reset:dev`, `pnpm test:postgres` et `pnpm test:e2e:postgres`.
- Ne jamais ajouter de donnée personnelle, secret ou affirmation administrative non citée.

## Partage Public

Pitch court : DossierBJ est un MVP civictech open source pour préparer des démarches au Bénin avec sources, citations, checklists, assistant CivicRAG mock, Digital Pulse et pilote AO Radar, sans API payante obligatoire.

Lien GitHub : `https://github.com/chabelbossa/bj`

## Documents À Lire

- `docs/PROJECT_BRIEF.md`
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `docs/RAG_POLICY.md`
- `docs/DEV_SETUP.md`
