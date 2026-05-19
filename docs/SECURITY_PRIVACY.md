# Security And Privacy

## Principes MVP

- Ne pas demander de documents personnels.
- Ne pas stocker de fichiers sensibles.
- Ne pas demander de numéro d'identité.
- Ne pas demander de pièce d'identité.
- Ne pas collecter de données personnelles inutiles.
- Pas d'auth obligatoire.
- Pas de paiement réel obligatoire.
- Pas de tracking agressif.

## Secrets

- Les secrets vivent uniquement dans les variables d'environnement.
- `.env.example` documente les variables sans valeur sensible.
- Les clés IA, base de données, paiement et auth ne doivent jamais être committées.

## Données

Le mode mock ne stocke rien de sensible. Les futures versions avec compte utilisateur devront appliquer la minimisation des données, la séparation public/premium et des durées de rétention claires.

## Audit Logs

Prévoir des logs d'audit pour :

- modifications de sources ;
- changements de statut de vérification ;
- actions premium sensibles ;
- génération ou téléchargement de documents.

Ces logs ne doivent pas contenir plus de données personnelles que nécessaire.
