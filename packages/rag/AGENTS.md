# AGENTS.md - packages/rag

## Rôle

`packages/rag` contient CivicRAG : retrieval, policies de grounding, providers IA et prompts.

## Règles

- Réponses strictement sourcées.
- Citations obligatoires dès qu'une réponse affirme une information administrative.
- Aucune invention de frais, délais, pièces, conditions ou procédures.
- Si la source manque, répondre que l'information n'est pas disponible dans les sources connectées.
- Inclure un score de confiance : `low`, `medium`, `high`.
- Inclure la prudence : "Cette plateforme est indépendante et ne remplace pas les plateformes officielles."
- Séparer retrieval, grounding policy et génération/provider.
- Le provider IA par défaut est `mockAiProvider`.
- Les tests ne doivent jamais appeler une API externe.

## Intégrations Futures

Tout provider réel doit être optionnel, activé par variable d'environnement et remplaçable en test.
