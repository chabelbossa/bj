# Roadmap

## Phase 0 - Fondation

- Initialiser le monorepo.
- Créer docs, AGENTS.md, schémas domaine et RAG mocké.
- Lancer une app web locale.
- Ajouter tests unitaires sans dépendance externe.
- Vérifier que `DATA_MODE=mock` ne demande pas `DATABASE_URL`.
- Vérifier que `AI_PROVIDER=mock` est le seul provider actif.
- Vérifier que toutes les données demo restent non officielles.
- Supprimer les assets et dépendances non utilisés du scaffold.

### Critères De Sortie Phase 0

- `pnpm lint`, `pnpm typecheck`, `pnpm test` et `pnpm build` passent.
- `/api/health` retourne `dataMode: "mock"` et `aiProvider: "mock"` sans secret.
- `/api/assistant` retourne toujours `answer`, `citations`, `confidence`, `missingInfo`, `disclaimer` et `suggestedOfficialVerification`.
- Aucune vraie URL officielle ne sert de placeholder demo.
- AO Radar reste limité au modèle et à la préparation documentaire.

## Phase 1 - DossierBJ Core

- Ingestion manuelle de sources officielles prioritaires.
- Remplacer les URLs `example.org` par des sources officielles vérifiées seulement après validation humaine.
- Fiches démarches vérifiées.
- Checklists personnalisées.
- Assistant CivicRAG sourcé.
- Recherche et filtres.
- Première stratégie SEO sobre.
- PostgreSQL optionnel pour les procédures, sources, chunks RAG et requêtes assistant.

### État MVP Core Actuel

- Recherche keyword locale pondérée par titre, alias, catégorie, public et points à vérifier.
- Fiches démarches enrichies avec besoin utilisateur, résultat attendu, points à vérifier et préparation prudente.
- Création d'entreprise, casier judiciaire et extrait RCCM sont passés en `partially_verified` avec sources connectées manuellement.
- Casier judiciaire et extrait RCCM incluent maintenant les coûts, délais, pièces et étapes principales extraits depuis `service-public.bj` le 2026-05-30.
- Les fiches partiellement vérifiées affichent une matrice "affirmation -> source" pour éviter les affirmations implicites.
- Checklist interactive générée localement à partir de la fiche et du profil utilisateur.
- Checklist sauvegardée dans `localStorage` et imprimable via la page démarche.
- Assistant CivicRAG mock/keyword avec citations, confiance moyenne sur fiches partiellement sourcées et confiance faible sur données demo.
- `DATA_MODE=postgres` lit les procédures, sources, documents, chunks et enregistre les requêtes assistant.
- Migration Drizzle initiale, seed Postgres idempotent et test d'intégration `pnpm test:postgres`.
- Page `/sources` pour suivre les sources candidates, les sources connectées, les erreurs de validation et la checklist d'ingestion manuelle.
- Page `/sources/[id]` pour inspecter une revue source, son historique, sa checklist, les démarches liées et les claims associés.
- Page `/sources/claims` pour prioriser les claims à revoir, filtrer par fiche/type/statut et annoter localement le travail éditorial.
- Page `/sources/nouvelle` pour générer un brouillon local de source candidate sans auth, scraping ou base obligatoire.
- Page `/methode-verification` pour expliquer la revue humaine, les citations et les niveaux de confiance.
- Table `procedure_claims` et modèle `ProcedureClaim` pour sortir les affirmations vérifiées du JSON des fiches.
- Résumé de couverture des claims par fiche, statut et type d'affirmation sur `/sources`.
- Script e2e HTTP `pnpm test:e2e` pour vérifier les routes critiques, `/api/health` et `/api/assistant` en mode mock.
- Registre fichier-based dans `packages/core/src/seed/sourceRegistry.ts` et workflow dans `packages/core/src/sources/manualIngestion.ts`.
- Workflow CI GitHub avec validation mock, build, smoke e2e, puis job PostgreSQL avec migration, seed et smoke e2e.
- Fichiers publics de contribution : licence MIT, guide de contribution, code de conduite, politique sécurité, templates issues/PR et Dependabot.

### Prochain Critère De Sortie Phase 1

- Création d'entreprise : séparer les pièces, coûts et conditions par forme juridique.
- Casier judiciaire : surveiller les changements de coût, délai et pièces sur service-public.bj.
- Extrait RCCM : surveiller les changements de coût, délai, pièces et critères sur service-public.bj.
- Chaque frais, délai, pièce et étape affiché avec `SourceReference`.
- Persistance optionnelle des notes claims et brouillons source côté Postgres quand un vrai back-office sera justifié.
- Tests navigateur Playwright si le projet accepte cette dépendance ; le smoke e2e HTTP couvre déjà les routes critiques en frugal.
- Revue responsive visuelle des nouvelles pages éditoriales sur mobile réel.

### Sources Connectées Manuellement

- MonEntreprise.bj : guide, processus, coûts/délais, pièces requises et certificats.
- Portail du Numérique : repérage des services casier judiciaire et extrait RCCM.
- Service-public.bj : fiches casier judiciaire et extrait RCCM connectées avec coût, délai, pièces et étapes principales au 2026-05-30.

## Phase 2 - AO Radar / TenderCopilot

- Modèle `Opportunity`.
- Sources vérifiées d'appels d'offres.
- Alertes simples.
- Checklists de soumission.
- Préparation à la génération de réponses.
- Ne pas automatiser d'ingestion massive tant que la politique source et les premiers flux Core ne sont pas validés.
- Réutiliser les mêmes abstractions `SourceReference`, revue humaine et repository, sans implémenter AO Radar dans le Core.

## Phase 3 - Diaspora Desk / RootsTrip

- Démarches diaspora.
- Guides voyage et documents utiles.
- eVisa et parcours de préparation.
- Contenus sourcés pour My Afro Origins.

## Phase 4 - ExportReady Africa

- Documents export.
- Fiches produits.
- Factures pro forma.
- Emails commerciaux.
- Conformité documentaire PME.

## Phase 5 - FieldOps AI / NGO Reporter

- Formulaires terrain.
- Preuves et indicateurs.
- Génération de rapports bailleurs.
- Workflows d'organisation.

## Exclu Du MVP

- Auth complète.
- Paiement réel obligatoire.
- OCR payant.
- Vector DB externe.
- Scraping agressif.
- Dashboard admin complexe.
- App mobile native.
- Microservices.
