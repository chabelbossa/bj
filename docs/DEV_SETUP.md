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
```

## Variables D'environnement

Le mode par défaut est :

```env
DATA_MODE="mock"
AI_PROVIDER="mock"
ENABLE_VECTOR_SEARCH="false"
PAYMENTS_PROVIDER="manual"
PAYMENTS_ENABLED="false"
ENABLE_AUTH="false"
```

## Mode Postgres Futur

Pour préparer PostgreSQL :

```env
DATA_MODE="postgres"
DATABASE_URL="postgres://..."
```

Le MVP ne doit pas exiger cette configuration.

## Troubleshooting

- Si `pnpm install` échoue, vérifier le réseau puis relancer.
- Si Next signale des types de route, lancer `pnpm --filter @dossierbj/web dev` ou `pnpm --filter @dossierbj/web build` pour régénérer les types.
- Si l'assistant ne répond pas, vérifier que `AI_PROVIDER=mock` et que l'API `/api/health` retourne OK.
