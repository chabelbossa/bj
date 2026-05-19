<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AGENTS.md - DossierBJ Platform

## Vision

DossierBJ Platform est une plateforme documentaire civique et économique pour aider les citoyens, entrepreneurs, PME, consultants, organisations et membres de la diaspora à comprendre, préparer et suivre des démarches importantes à partir de sources officielles vérifiables.

Le MVP est **DossierBJ Core**. Le moteur documentaire s'appelle **CivicRAG**. La couche open source prévue s'appelle **OpenCivic Kit**. Les extensions futures sont AO Radar / TenderCopilot, Diaspora Desk / RootsTrip, Digital Pulse, CivicUX Lab, ExportReady Africa et FieldOps AI / NGO Reporter.

## Règles Produit

- Le produit ne remplace jamais les plateformes officielles.
- L'interface doit rappeler que DossierBJ est indépendant et que les informations critiques doivent être vérifiées auprès des plateformes officielles.
- Toute donnée de démonstration doit être explicitement marquée comme non officielle.
- Ne jamais inventer des frais, délais, pièces à fournir, conditions d'éligibilité, étapes administratives ou liens officiels.
- Si une information n'est pas confirmée par une source fiable, afficher un fallback clair : "Information non encore vérifiée" ou "À vérifier sur la plateforme officielle".
- Les placeholders demo ne doivent pas pointer vers une vraie URL officielle non vérifiée ; utiliser une URL réservée de type `example.org` tant que la source n'est pas connectée.
- Le MVP reste concentré sur DossierBJ Core, Digital Pulse léger et CivicUX Lab léger. AO Radar doit rester préparé, pas construit en entier.

## Règles Techniques

- TypeScript strict partout.
- Next.js avec App Router pour l'application web. Lire les guides locaux dans `node_modules/next/dist/docs/` avant toute modification Next.
- React Server Components par défaut. Ajouter `"use client"` uniquement pour une interaction réelle côté navigateur.
- pnpm workspace obligatoire.
- Zod pour valider les schémas domaine.
- Drizzle prépare la future base PostgreSQL, mais l'app doit démarrer sans base.
- Les intégrations externes passent par des interfaces abstraites.
- Les services payants doivent être optionnels et activés uniquement via variables d'environnement.
- Les tests ne doivent jamais dépendre d'une API externe.

## Règles Budget

- Mode local/mock par défaut.
- Ne pas rendre obligatoires Clerk, Twilio, Pinecone, Algolia, OCR payant, WhatsApp Business API, vector database externe ou base cloud.
- `DATA_MODE=mock` est le défaut.
- `AI_PROVIDER=mock` est le défaut.
- Tout provider IA non implémenté doit échouer explicitement plutôt que basculer silencieusement vers un service payant.
- Les appels IA réels ne sont autorisés que si une clé explicite est fournie.
- Préférer caching, données seedées et petits modules simples avant toute infrastructure coûteuse.

## Règles RAG et Citations

- CivicRAG doit séparer retrieval, policy/grounding et provider IA.
- Toute réponse qui affirme une information administrative doit inclure des citations.
- Le score de confiance doit être explicite : `low`, `medium` ou `high`.
- Si aucune source pertinente n'est trouvée, répondre que l'information n'est pas disponible dans les sources connectées.
- Ajouter systématiquement : "Cette plateforme est indépendante et ne remplace pas les plateformes officielles."
- Les citations doivent pointer vers une source, un document ou une URL vérifiable quand disponible.

## Sécurité et Confidentialité

- Ne pas collecter de documents personnels dans le MVP.
- Ne pas demander de numéro d'identité, pièce d'identité, passeport ou données sensibles.
- Ne jamais committer de secrets.
- Minimiser les données stockées.
- Prévoir `audit_logs` pour les futures actions sensibles.
- Garder claire la séparation future entre espace public, premium et B2B.

## Documentation

- Toute fonctionnalité structurante doit être documentée dans `docs/`.
- Les décisions d'architecture doivent être lisibles par un futur agent IA.
- Les prochaines sessions Codex doivent commencer par lire :
  - `README.md`
  - `docs/PROJECT_BRIEF.md`
  - `docs/ARCHITECTURE.md`
  - `docs/ROADMAP.md`
  - `docs/RAG_POLICY.md`

## Tests

- Ajouter ou maintenir des tests pour les schémas Zod, la policy RAG, les retrievers, les citations et les helpers critiques.
- `pnpm lint`, `pnpm typecheck` et `pnpm test` doivent rester configurés.
- Aucun test ne doit appeler une API externe.

## Commit Mental

Avant de considérer une tâche terminée :

1. Vérifier que le mode mock fonctionne.
2. Vérifier qu'aucune donnée demo n'est présentée comme officielle.
3. Vérifier que les sources/citations restent visibles.
4. Vérifier que les fichiers AGENTS et docs restent à jour.
5. Lister clairement les limites restantes.
