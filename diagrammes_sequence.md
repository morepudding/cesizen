# Diagrammes de Séquence pour CesiZen

Ce document présente les diagrammes de séquence pour les principales fonctionnalités de l'application CesiZen. Ces diagrammes montrent les interactions chronologiques entre les acteurs et le système.

## 1. Diagramme de séquence - Authentification et gestion de profil

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant Auth as Système d'Authentification
    participant DB as Base de Données
    participant Email as Système Email

    %% Inscription
    User->>Auth: S'inscrire (email, mot de passe)
    Auth->>Auth: Valider les données
    Auth->>DB: Vérifier si l'email existe déjà
    DB-->>Auth: Email disponible
    Auth->>Auth: Hasher le mot de passe
    Auth->>DB: Créer un nouvel utilisateur
    Auth->>Email: Envoyer email de confirmation
    Email-->>User: Email de confirmation
    Auth-->>User: Confirmation d'inscription

    %% Connexion
    User->>Auth: Se connecter (email, mot de passe)
    Auth->>DB: Vérifier les identifiants
    DB-->>Auth: Identifiants valides
    Auth->>Auth: Générer token de session
    Auth-->>User: Token de session + redirection

    %% Modification du profil
    User->>Auth: Modifier le profil
    Auth->>Auth: Vérifier l'authentification
    Auth->>DB: Mettre à jour les informations
    DB-->>Auth: Confirmation de mise à jour
    Auth-->>User: Profil mis à jour
```

## 2. Diagramme de séquence - Test de stress et recommandations

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant App as Application
    participant API as API Stress
    participant DB as Base de Données
    participant Rec as Système de Recommandation

    %% Répondre au questionnaire
    User->>App: Accéder au test de stress
    App->>API: Demander les questions
    API->>DB: Récupérer les questions
    DB-->>API: Liste des questions
    API-->>App: Questions de stress
    App-->>User: Afficher les questions
    
    %% Soumettre les réponses
    User->>App: Soumettre les réponses
    App->>API: Envoyer les réponses
    API->>API: Calculer le score de stress
    API->>DB: Enregistrer le résultat
    DB-->>API: Confirmation d'enregistrement
    
    %% Obtenir des recommandations
    API->>Rec: Demander des recommandations
    Rec->>DB: Récupérer activités adaptées
    DB-->>Rec: Liste d'activités
    Rec-->>API: Recommandations personnalisées
    API-->>App: Score et recommandations
    App-->>User: Afficher résultats et recommandations
    
    %% Consulter l'historique
    User->>App: Demander l'historique
    App->>API: Récupérer l'historique
    API->>DB: Requête historique utilisateur
    DB-->>API: Données historiques
    API->>API: Analyser tendances
    API-->>App: Historique et tendances
    App-->>User: Afficher graphiques et tendances
```

## 3. Diagramme de séquence - Tracker d'émotions

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant App as Application
    participant API as API Émotions
    participant DB as Base de Données
    
    %% Consulter les types d'émotions
    User->>App: Accéder au tracker d'émotions
    App->>API: Demander types d'émotions
    API->>DB: Récupérer hiérarchie d'émotions
    DB-->>API: Types d'émotions (niveau 1 et 2)
    API-->>App: Données émotions
    App-->>User: Afficher roue des émotions
    
    %% Ajouter une émotion
    User->>App: Sélectionner une émotion
    User->>App: Ajouter un commentaire (optionnel)
    App->>API: Enregistrer l'émotion
    API->>API: Vérifier les données
    API->>API: Horodater l'entrée
    API->>DB: Stocker l'émotion
    DB-->>API: Confirmation d'enregistrement
    API-->>App: Statut de l'opération
    App-->>User: Confirmation visuelle
    
    %% Consulter l'historique des émotions
    User->>App: Demander l'historique
    App->>API: Récupérer données émotionnelles
    API->>DB: Requête historique
    DB-->>API: Historique des émotions
    API->>API: Analyser tendances
    API-->>App: Données formatées
    App-->>User: Afficher visualisations et tendances
    
    %% Supprimer une émotion
    User->>App: Demander suppression d'une émotion
    App->>API: Requête de suppression
    API->>DB: Supprimer l'entrée
    DB-->>API: Confirmation
    API-->>App: Statut de l'opération
    App-->>User: Confirmation visuelle
```

## 4. Diagramme de séquence - Jardin Zen et exercices de respiration

```mermaid
sequenceDiagram
    participant User as Utilisateur
    participant App as Application
    participant Storage as Stockage Local
    participant DB as Base de Données
    
    %% Exercices de respiration
    User->>App: Accéder aux exercices
    App->>DB: Récupérer liste d'exercices
    DB-->>App: Exercices disponibles
    App-->>User: Afficher les exercices
    User->>App: Sélectionner un exercice
    User->>App: Personnaliser paramètres (durée)
    App-->>User: Démarrer l'exercice
    
    %% Jardin Zen - Chargement
    User->>App: Accéder au Jardin Zen
    App->>Storage: Récupérer état sauvegardé
    Storage-->>App: État du jardin
    App-->>User: Afficher le jardin zen
    
    %% Jardin Zen - Interactions
    User->>App: Ajouter un élément
    App->>App: Créer élément
    App-->>User: Élément placé
    
    User->>App: Déplacer un élément
    App->>App: Mettre à jour position
    App-->>User: Élément déplacé
    
    User->>App: Supprimer un élément
    App->>App: Retirer élément
    App-->>User: Élément supprimé
    
    %% Jardin Zen - Sauvegarde
    User->>App: Sauvegarder le jardin
    App->>Storage: Enregistrer l'état
    Storage-->>App: Confirmation
    App-->>User: Jardin sauvegardé
    
    %% Exercice de pleine conscience
    User->>App: Démarrer méditation
    App-->>User: Afficher directives
    App->>App: Démarrer minuteur
    Note over App,User: Session de méditation
    App-->>User: Fin de session
```

Chaque diagramme montre clairement la séquence chronologique des interactions entre les différents acteurs et composants du système, mettant en évidence le flux de données et le comportement attendu pour chaque fonctionnalité principale de CesiZen.
