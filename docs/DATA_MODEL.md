# Data Model

## OfficialSource

Source institutionnelle ou partenaire : pays, institution, URL, type, fiabilité, statut et date de dernière consultation.

## SourceDocument

Document ou page récupérée depuis une source : titre, URL, type de contenu, version, checksum optionnel et statut.

## SourceChunk

Segment exploitable par CivicRAG. Chaque chunk doit conserver ses `sourceRefs`.

## Procedure

Démarche administrative ou économique : titre, slug, pays, catégorie, utilisateurs cibles, résumé, URL officielle optionnelle, durée/coût officiels optionnels, pièces, étapes, avertissements, sources, faits vérifiés et statut de vérification.

## ProcedureFact

Affirmation traçable affichée dans la fiche : libellé, valeur, statut (`verified`, `partially_verified`, `unverified`, `not_applicable`), note et `SourceReference`. Sert à éviter qu'une fiche partielle soit lue comme une vérité complète.

## RequiredDocument

Pièce à fournir, avec description, caractère obligatoire, condition éventuelle et références sources.

## ProcedureStep

Étape ordonnée avec description et références sources.

## Checklist / ChecklistItem

Checklist générée ou préparée pour une démarche. Chaque item peut pointer vers une pièce ou une source.

## Citation

Référence affichable dans l'assistant ou l'UI. Elle doit permettre à l'utilisateur de remonter à la source.

## AssistantAnswer

Réponse structurée : texte, citations, confiance, informations manquantes et notice de prudence.

## Opportunity

Modèle futur pour AO Radar : titre, autorité, pays, secteur, deadline, résumé, documents requis, éligibilité et statut.

## AuditLog

Journal futur pour actions sensibles : acteur, action, cible, métadonnées minimales et horodatage.
