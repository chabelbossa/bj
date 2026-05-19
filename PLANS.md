# PLANS.md - DossierBJ Platform

Ce fichier sert de fil conducteur pour les prochains agents. Le but est de construire progressivement une plateforme documentaire fiable, frugale et sourcée, sans transformer le MVP en plateforme trop large.

## Priorités Actuelles

1. Stabiliser la fondation monorepo, les schémas domaine et le RAG mocké.
2. Remplacer progressivement les données demo par des sources officielles vérifiées.
3. Construire DossierBJ Core autour des démarches, checklists, citations et assistant sourcé.
4. Ajouter Digital Pulse et CivicUX Lab en modules légers d'observation, sans back-office complexe.
5. Préparer AO Radar par les modèles et interfaces, sans ingestion massive au départ.

## Décisions Fondatrices

- Le mode par défaut est local et mocké.
- La base PostgreSQL est préparée, mais jamais obligatoire pour lancer le MVP.
- Le provider IA par défaut est un mock provider.
- Les coûts doivent rester bas tant que les sources, le parcours et la valeur utilisateur ne sont pas validés.
- Le corpus enrichi, les workflows premium et les prompts critiques peuvent rester propriétaires.
- OpenCivic Kit peut accueillir des composants UI, types publics et helpers civictech.

## Prochaines Phases

### Phase 0 - Fondation

- Monorepo pnpm.
- App web Next.js.
- Packages `core`, `rag`, `db`, `ui`.
- Données demo non officielles.
- Tests unitaires sans API externe.

### Phase 1 - DossierBJ Core

- Ingestion manuelle de premières sources officielles.
- Pages démarches plus riches.
- Assistant CivicRAG sourcé.
- Checklists personnalisables.
- UX mobile-first.

### Phase 2 - AO Radar

- Modèle `Opportunity`.
- Sources d'appels d'offres vérifiées.
- Alertes simples.
- Checklists de soumission.

### Phase 3 - Diaspora Desk

- Démarches diaspora.
- Préparation de voyage et documents utiles.
- Guides sourcés.

### Phase 4 - ExportReady Africa

- Fiches export.
- Pro forma.
- Dossiers PME.

### Phase 5 - FieldOps AI

- Rapports ONG.
- Indicateurs terrain.
- Preuves et formulaires.

## Hors MVP

- Authentification complète.
- Paiements réels obligatoires.
- OCR payant.
- Scraping agressif.
- Vector database externe.
- App mobile native.
- Microservices.
