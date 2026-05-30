# Dev Setup

## Prérequis

- Node.js compatible avec Next.js 16.
- pnpm 10.x.

## Installation

```bash
pnpm install
cp .env.example .env.local
```

## Lancer

```bash
pnpm dev
```

Ouvrir `http://localhost:3000`.

## Tester

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm monitor:sources
pnpm test:e2e
```

Test optionnel avec une base Postgres de développement :

```bash
pnpm db:reset:dev
pnpm test:postgres
pnpm test:e2e:postgres
```

Ces commandes supposent que `DATABASE_URL` pointe vers une base jetable.

## Variables D'environnement

Le mode par défaut est :

```env
DATA_MODE="mock"
AI_PROVIDER="mock"
OPENAI_API_KEY=""
OPENAI_MODEL="gpt-5.4-mini"
ENABLE_VECTOR_SEARCH="false"
PAYMENTS_PROVIDER="manual"
PAYMENTS_ENABLED="false"
ENABLE_AUTH="false"
```

## Mode Postgres Optionnel

Pour activer PostgreSQL localement :

```env
DATA_MODE="postgres"
DATABASE_URL="postgresql://..."
AI_PROVIDER="mock"
```

## Provider IA Optionnel

Le provider gratuit/local reste `AI_PROVIDER=mock`. Pour tester une vraie génération IA sourcée :

```env
AI_PROVIDER="openai"
OPENAI_API_KEY="sk-..."
OPENAI_MODEL="gpt-5.4-mini"
```

L'API `/api/assistant` continue de récupérer les chunks depuis le repository actif, puis demande une réponse JSON structurée. Les tests automatisés simulent `fetch` et ne consomment aucune API externe.

Commandes DB :

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:reset:dev
```

`DATA_MODE=mock` reste le mode par défaut et ne doit jamais exiger cette configuration.

`pnpm db:reset:dev` supprime aussi le schéma interne `drizzle` afin que les migrations soient
rejouées proprement sur une base de développement jetable.

## Brouillons De Sources

La page `/sources/nouvelle` stocke les brouillons dans le navigateur avec la clé
`dossierbj:source-candidates:v1`. En mode Postgres, l'API `/api/source-candidates` conserve aussi
ces brouillons dans `audit_logs`. Ces données ne prouvent rien officiellement et doivent être revues
manuellement avant d'être ajoutées à
`packages/core/src/seed/sourceRegistry.ts`.

## Revue Locale Des Claims

La page `/sources/claims` stocke les notes de revue dans le navigateur avec la clé
`dossierbj:claim-review-notes:v1`. En mode Postgres, `/api/claim-review-notes` conserve aussi les
notes dans `audit_logs`. Pour publier une correction, éditer les fiches ou le registre source, puis
relancer :

```bash
pnpm validate:sources
pnpm monitor:sources
pnpm test
pnpm test:e2e
```

## Surveillance Des Sources

`pnpm monitor:sources` interroge les fiches publiques `service-public.bj` surveillées et échoue si
statut, frais, délais ou pièces ne correspondent plus au snapshot attendu. Le test standard ne
dépend pas de ce réseau externe.

## E2E Léger

`pnpm test:e2e` démarre un serveur Next local sur `127.0.0.1:3107`, vérifie les pages critiques et
poste une question à `/api/assistant`. Il ne dépend d'aucun navigateur, provider IA externe ou
service payant. Pour changer de port :

```bash
E2E_PORT=3111 pnpm test:e2e
```

## Troubleshooting

- Si `pnpm install` échoue, vérifier le réseau puis relancer.
- Si Next signale des types de route, lancer `pnpm --filter @dossierbj/web dev` ou `pnpm --filter @dossierbj/web build` pour régénérer les types.
- Si l'assistant ne répond pas, vérifier `/api/health`, puis `AI_PROVIDER`. Avec `AI_PROVIDER=openai`, `OPENAI_API_KEY` doit être défini.
- Si Drizzle signale une URL invalide, vérifier que `.env.local` contient seulement `DATABASE_URL="postgresql://..."` et pas une valeur imbriquée du type `DATABASE_URL="DATABASE_URL=..."`.
