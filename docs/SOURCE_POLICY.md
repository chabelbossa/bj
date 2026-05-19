# Source Policy

## Types De Sources

- Officielles : plateformes gouvernementales, ministères, agences publiques, journaux officiels.
- Semi-officielles : communiqués institutionnels, partenaires mandatés, organismes publics associés.
- Partenaires : cabinets, ONG, organisations ou consultants identifiés.
- Démonstration : données fictives ou placeholders, jamais officielles.

## Statut De Vérification

Chaque source ou document doit indiquer :

- statut ;
- date de dernière consultation ;
- institution ;
- pays ;
- URL ;
- version ou checksum si disponible.

## Versioning

Les documents sources doivent garder une trace de version. Si une page change, la nouvelle version doit pouvoir être comparée ou horodatée.

## Ingestion Manuelle MVP

Le MVP utilise une ingestion manuelle fichier-based :

1. Ajouter une entrée dans `packages/core/src/seed/sourceRegistry.ts`.
2. Confirmer l'autorité, le pays, l'URL et le statut.
3. Lire la source sans scraping agressif.
4. Créer ou mettre à jour les `OfficialSource`, `SourceDocument` et `SourceReference`.
5. Relier chaque affirmation importante à une citation.
6. Ajouter un test avant de passer une source en `verified`.

Une URL service-public ou gouvernementale peut être `pending_review` si la page est identifiée mais que ses détails n'ont pas encore été extraits humainement.

## Règles De Collecte

- Pas de scraping agressif.
- Respecter robots.txt et conditions d'utilisation.
- Préférer saisie manuelle contrôlée, exports officiels ou APIs publiques.
- Ne pas contourner les protections techniques.

## Affichage

L'UI doit distinguer source officielle, source à vérifier et donnée demo non officielle.
Les fiches doivent afficher les citations au niveau de la fiche, mais aussi au niveau des pièces, étapes et affirmations sensibles quand elles existent.
