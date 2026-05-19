# AGENTS.md - packages/core

## Rôle

`packages/core` contient les schémas domaine, types, helpers et données seedées.

## Règles

- Validation Zod obligatoire pour les modèles structurants.
- Les données seedées doivent être marquées demo/non officielles.
- Ne pas introduire de fausses informations officielles.
- Toute affirmation importante doit pouvoir porter des `sourceRefs`.
- Les champs optionnels de coût, délai ou URL officielle ne doivent pas être remplis avec des suppositions.
- Préférer des noms de fichiers et types en anglais.

## Données Demo

Utiliser des placeholders prudents :

- "À vérifier sur la plateforme officielle"
- "Information non encore vérifiée"
- "Source officielle à connecter"
