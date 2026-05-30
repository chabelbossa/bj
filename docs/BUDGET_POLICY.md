# Budget Policy

## Défaut Gratuit Ou Local

Le projet doit démarrer avec :

- données seedées et fixtures de test ;
- provider IA mock ;
- pas de base cloud ;
- pas de vector DB externe ;
- pas d'OCR payant ;
- pas de paiement réel.

## Providers Payants

Les providers payants sont optionnels et activés uniquement par variables d'environnement :

- `AI_PROVIDER`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_BASE_URL`
- `ENABLE_VECTOR_SEARCH`
- `PAYMENTS_PROVIDER`
- `PAYMENTS_ENABLED`

## Coûts IA

- Limiter les appels IA réels.
- Mettre en cache les réponses non sensibles quand possible.
- Tester les policies sans API.
- Privilégier retrieval déterministe et réponses structurées.

## Stockage Et Recherche

Commencer par PostgreSQL et recherche keyword/simple. Ajouter embeddings ou vector DB seulement si le volume et la valeur utilisateur le justifient.

## Paiement

Le paiement manuel peut suffire au début pour valider la demande premium avant une intégration réelle.
