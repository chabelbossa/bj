# AGENTS.md - apps/web

## Rôle

`apps/web` est l'application PWA web de DossierBJ. Elle doit rester mobile-first, claire, sobre et utile dès le premier écran.

## UI/UX

- Français par défaut.
- Ton clair, rassurant, professionnel et non officiel.
- Toujours afficher que DossierBJ est indépendant et que les informations critiques doivent être vérifiées auprès des plateformes officielles.
- Design sobre, crédible, institutionnel mais moderne.
- Pas d'UI tape-à-l'oeil, pas de dashboard complexe, pas d'effets décoratifs inutiles.
- Mobile-first et accessible : titres hiérarchiques, contrastes lisibles, zones tactiles confortables.
- Préférer composants simples faits maison.
- Ne pas masquer le statut de vérification des données.

## Next.js

- Lire `node_modules/next/dist/docs/` avant de modifier une API Next.
- App Router uniquement.
- Server Components par défaut.
- Client Components uniquement pour formulaires, état local ou interactions navigateur.
- Les routes API ne doivent pas appeler de service externe par défaut.

## Données

- Les données demo doivent afficher "Données de démonstration non officielles".
- Ne jamais présenter un coût, délai ou document comme officiel sans source validée.
- Les pages doivent rester utiles même avec `DATA_MODE=mock`.
