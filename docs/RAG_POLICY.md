# RAG Policy - CivicRAG

## Règles De Grounding

- Une réponse administrative doit s'appuyer sur des sources.
- Les frais, délais, pièces à fournir, étapes et conditions ne doivent jamais être inventés.
- Quand les sources sont insuffisantes, l'assistant doit refuser de conclure et expliquer ce qui manque.
- Les données de test ou insuffisamment sourcées doivent rester identifiées comme non officielles.

## Citations

Chaque affirmation importante doit pouvoir être reliée à une `SourceReference` :

- `sourceId`
- `documentId` si disponible
- `url`
- `title`
- `excerpt` si disponible
- `retrievedAt`

## Score De Confiance

- `high` : source officielle connectée et récente, information directe.
- `medium` : source officielle ou semi-officielle, information partielle.
- `low` : source absente, donnée de test, source ancienne ou information insuffisante.

Le MVP retourne `low` sur les données de test et peut retourner `medium` sur une fiche `partially_verified` si les citations sont présentes. `high` reste réservé à une future fiche exhaustive, revue humainement et maintenue à jour.

## Matrice Des Affirmations

Chaque fiche peut exposer `verifiedFacts`. CivicRAG doit privilégier ces faits quand ils existent, car ils indiquent explicitement :

- l'affirmation ;
- son statut ;
- les citations ;
- les limites ou notes de prudence.

Une réponse ne doit pas transformer une fiche partiellement vérifiée en certitude complète.

## Refus Et Fallback

Si aucune source pertinente n'est trouvée :

- dire que l'information n'est pas disponible dans les sources connectées ;
- proposer de vérifier sur les plateformes officielles ;
- ne pas produire de checklist précise.

## Logs

Les futures versions devront journaliser les requêtes assistant, sources utilisées, scores de confiance et refus, sans stocker de données personnelles inutiles.

## Vérification Humaine

Toute source administrative ajoutée au corpus doit pouvoir être vérifiée humainement avant d'être présentée comme officielle.
