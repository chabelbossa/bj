# AGENTS.md - packages/db

## Rôle

`packages/db` prépare la future base PostgreSQL avec Drizzle.

## Règles

- La base ne doit pas être obligatoire pour lancer le MVP.
- `DATA_MODE=mock` reste le défaut.
- Migrations prudentes et explicites.
- Schéma extensible, sans microservices prématurés.
- Ne pas stocker de données sensibles inutiles.
- Prévoir `audit_logs` pour actions sensibles futures.
- Les tables sources doivent conserver références, statuts de vérification et dates.
- Ne jamais committer de secrets ou URL de base réelle.
