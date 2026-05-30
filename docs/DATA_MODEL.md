# Data Model

## OfficialSource

Source institutionnelle ou partenaire : pays, institution, URL, type, fiabilité, statut et date de dernière consultation.

## SourceDocument

Document ou page récupérée depuis une source : titre, URL, type de contenu, version, checksum optionnel et statut.

## SourceChunk

Segment exploitable par CivicRAG. Chaque chunk doit conserver ses `sourceRefs`.

## SourceReviewItem / SourceReviewEvent

File de revue humaine pour les sources candidates : URL candidate, autorité, priorité, statut,
notes, démarches liées et historique minimal daté. Une source ne passe en `verified` qu'après revue
humaine et rattachement aux citations.

## Procedure

Démarche administrative ou économique : titre, slug, pays, catégorie, utilisateurs cibles, résumé, URL officielle optionnelle, durée/coût officiels optionnels, pièces, étapes, avertissements, sources, faits vérifiés et statut de vérification.

## ProcedureFact

Affirmation traçable affichée dans la fiche : libellé, valeur, statut (`verified`, `partially_verified`, `unverified`, `not_applicable`), note et `SourceReference`. Sert à éviter qu'une fiche partielle soit lue comme une vérité complète.

## ProcedureClaim

Affirmation normalisée et persistable : démarche, type (`cost`, `duration`,
`required_document`, `procedure_step`, etc.), libellé, valeur, statut, champ source et
`SourceReference`. Les claims sont utilisés pour auditer les fiches, préparer l'index RAG et éviter
que frais, délais ou pièces restent seulement dans un bloc JSON.

## ClaimReviewItem

Vue de travail dérivée d'un `ProcedureClaim` : priorité (`critical`, `high`, `medium`, `low`),
raison, prochaine action, besoin de citation et besoin de revue humaine. Elle alimente le cockpit
`/sources/claims` sans créer une nouvelle vérité métier persistée.

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

## AssistantQuery

Trace optionnelle en mode Postgres : question, réponse structurée, niveau de confiance, citations et
date de création. Le mode mock ne persiste rien.

## Opportunity

Modèle AO Radar pilote : titre, autorité, pays, secteur, deadline, résumé, documents requis,
éligibilité et statut. Les opportunités restent reliées à une source officielle et doivent être
revérifiées avant réponse commerciale.

## AuditLog

Journal pour actions éditoriales optionnelles en mode Postgres : brouillons de sources, notes de
claims, acteur, action, cible, métadonnées minimales et horodatage.
