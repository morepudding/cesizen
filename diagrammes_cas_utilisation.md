# Diagrammes de Cas d'Utilisation pour CesiZen

## Vue d'ensemble du système CesiZen

CesiZen est une application de gestion du stress et du bien-être mental qui offre aux utilisateurs plusieurs fonctionnalités:
- Gestion de profil utilisateur
- Test et suivi du niveau de stress
- Tracker d'émotions personnalisé
- Activités de bien-être et détente
- Exercices de respiration
- Jardin Zen interactif
- Administration et reporting

## Diagramme global des cas d'utilisation

```mermaid
flowchart TD
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef extend fill:#fdedec,stroke:#e74c3c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Définition des acteurs
    User((Utilisateur)):::actor
    Admin((Administrateur)):::actor
    System((Système)):::actor
    
    %% Cas d'utilisation principaux
    UC1["S'authentifier"]:::usecase
    UC2[Gérer son profil]:::usecase
    UC3[Mesurer son niveau de stress]:::usecase
    UC4[Suivre ses émotions]:::usecase
    UC5[Consulter les activités]:::usecase
    UC6[Pratiquer des exercices de respiration]:::usecase
    UC7[Interagir avec le jardin zen]:::usecase
    UC8[Gérer les utilisateurs]:::usecase
    UC9[Administrer le contenu]:::usecase
    UC10[Analyser les statistiques]:::usecase
    UC11[Envoyer des notifications]:::usecase
    
    %% Relations utilisateur standard
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    
    %% Relations administrateur
    Admin --> UC1
    Admin --> UC8
    Admin --> UC9
    Admin --> UC10
    
    %% Relation système
    System --> UC11
    
    %% Relations d'inclusion
    UC1 -.-> |<<include>>| UC1_1[Vérifier les identifiants]:::include
    UC3 -.-> |<<include>>| UC3_1[Calculer le score de stress]:::include
    UC5 -.-> |<<include>>| UC5_1[Filtrer les activités]:::include
    
    %% Relations d'extension
    UC5 -.-> |<<extend>>| UC5_2[Ajouter aux favoris]:::extend
    UC4 -.-> |<<extend>>| UC4_1[Ajouter un commentaire]:::extend
    UC7 -.-> |<<extend>>| UC7_1[Pratiquer la pleine conscience]:::extend
```

## Diagramme détaillé - Gestion du profil et authentification

```mermaid
flowchart LR
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Acteurs
    User((Utilisateur)):::actor
    Admin((Administrateur)):::actor
    
    %% Cas d'utilisation
    UC1["S'inscrire"]:::usecase
    UC2[Se connecter]:::usecase
    UC3[Se déconnecter]:::usecase
    UC4[Modifier son profil]:::usecase
    UC5[Réinitialiser mot de passe]:::usecase
    UC6[Supprimer son compte]:::usecase
    
    %% Cas d'inclusion
    UC_V[Vérifier les identifiants]:::include
    UC_E[Envoyer email de confirmation]:::include
    
    %% Relations utilisateur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    
    %% Relation admin
    Admin --> UC2
    Admin --> UC3
    
    %% Relations d'inclusion
    UC1 -.-> |<<include>>| UC_E
    UC2 -.-> |<<include>>| UC_V
    UC5 -.-> |<<include>>| UC_E
```

## Diagramme détaillé - Gestion du stress

```mermaid
flowchart TD
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef extend fill:#fdedec,stroke:#e74c3c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Acteurs
    User((Utilisateur)):::actor
    Admin((Administrateur)):::actor
    
    %% Cas d'utilisation
    UC1[Répondre au questionnaire de stress]:::usecase
    UC2[Consulter son score de stress]:::usecase
    UC3["Visualiser l'historique des résultats"]:::usecase
    UC4[Recevoir des recommandations]:::usecase
    UC5[Gérer les questions de stress]:::usecase
    UC6[Configurer les niveaux de stress]:::usecase
    UC7[Consulter les statistiques globales]:::usecase
    
    %% Cas d'inclusion et d'extension
    UC_C[Calculer le score total]:::include
    UC_A[Analyser les tendances]:::include
    UC_R[Recommander des activités]:::extend
    
    %% Relations utilisateur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    
    %% Relations admin
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    
    %% Inclusion/Extension
    UC1 -.-> |<<include>>| UC_C
    UC3 -.-> |<<include>>| UC_A
    UC2 -.-> |<<extend>>| UC_R
```

## Diagramme détaillé - Tracker d'émotions

```mermaid
flowchart TD
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef extend fill:#fdedec,stroke:#e74c3c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Acteurs
    User((Utilisateur)):::actor
    Admin((Administrateur)):::actor
    
    %% Cas d'utilisation
    UC1[Ajouter une émotion]:::usecase
    UC2["Consulter l'historique des émotions"]:::usecase
    UC3[Supprimer une émotion]:::usecase
    UC4[Commenter une émotion]:::usecase
    UC5[Analyser les tendances émotionnelles]:::usecase
    UC6["Gérer les types d'émotions"]:::usecase
    
    %% Cas d'inclusion
    UC_S["Sélectionner le type d'émotion"]:::include
    UC_H["Horodater l'entrée"]:::include
    UC_A[Associer au profil utilisateur]:::include
    
    %% Relations utilisateur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    
    %% Relations admin
    Admin --> UC6
    
    %% Relations d'inclusion
    UC1 -.-> |<<include>>| UC_S
    UC1 -.-> |<<include>>| UC_H
    UC1 -.-> |<<include>>| UC_A
```

## Diagramme détaillé - Gestion des activités

```mermaid
flowchart TD
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef extend fill:#fdedec,stroke:#e74c3c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Acteurs
    User((Utilisateur)):::actor
    Admin((Administrateur)):::actor
    
    %% Cas d'utilisation
    UC1[Consulter la liste des activités]:::usecase
    UC2[Filtrer les activités]:::usecase
    UC3[Ajouter une activité aux favoris]:::usecase
    UC4[Gérer ses favoris]:::usecase
    UC5[Créer une activité]:::usecase
    UC6[Modifier une activité]:::usecase
    UC7[Désactiver une activité]:::usecase
    
    %% Cas d'inclusion/extension
    UC_F[Filtrer par catégorie]:::include
    UC_N[Filtrer par niveau]:::include
    UC_D[Filtrer par durée]:::include
    UC_S[Rechercher par mot-clé]:::extend
    
    %% Relations utilisateur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    
    %% Relations admin
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    
    %% Relations d'inclusion/extension
    UC2 -.-> |<<include>>| UC_F
    UC2 -.-> |<<include>>| UC_N
    UC2 -.-> |<<include>>| UC_D
    UC1 -.-> |<<extend>>| UC_S
```

## Diagramme détaillé - Exercices de respiration et jardin zen

```mermaid
flowchart TD
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef extend fill:#fdedec,stroke:#e74c3c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Acteurs
    User((Utilisateur)):::actor
    
    %% Cas d'utilisation
    UC1[Sélectionner un exercice de respiration]:::usecase
    UC2[Suivre un exercice guidé]:::usecase
    UC3[Personnaliser les paramètres]:::usecase
    UC4[Accéder au jardin zen]:::usecase
    UC5[Placer des éléments]:::usecase
    UC6[Déplacer des éléments]:::usecase
    UC7[Supprimer des éléments]:::usecase
    UC8[Sauvegarder son jardin]:::usecase
    
    %% Cas d'inclusion/extension
    UC_A[Ajuster la durée]:::include
    UC_T[Suivre le timer visuel]:::include
    UC_M[Méditer en pleine conscience]:::extend
    
    %% Relations utilisateur
    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    
    %% Relations d'inclusion/extension
    UC2 -.-> |<<include>>| UC_T
    UC3 -.-> |<<include>>| UC_A
    UC2 -.-> |<<extend>>| UC_M
    UC4 -.-> |<<extend>>| UC2
```

## Diagramme détaillé - Administration du système

```mermaid
flowchart TD
    %% Style des acteurs et cas d'utilisation
    classDef actor fill:#f9f,stroke:#333,stroke-width:2px,color:black
    classDef usecase fill:#e4f2ff,stroke:#2980b9,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef include fill:#d5f5e3,stroke:#1abc9c,stroke-width:1px,rx:8px,ry:8px,color:black
    classDef extend fill:#fdedec,stroke:#e74c3c,stroke-width:1px,rx:8px,ry:8px,color:black

    %% Acteurs
    Admin((Administrateur)):::actor
    System((Système)):::actor
    
    %% Cas d'utilisation
    UC1[Consulter le tableau de bord]:::usecase
    UC2[Gérer les utilisateurs]:::usecase
    UC3[Gérer les activités]:::usecase
    UC4[Gérer les questions de stress]:::usecase
    UC5["Gérer les types d'émotions"]:::usecase
    UC6[Gérer le contenu du site]:::usecase
    UC7[Générer des rapports]:::usecase
    UC8[Envoyer des notifications]:::usecase
    UC9[Effectuer des sauvegardes]:::usecase
    
    %% Cas d'inclusion/extension
    UC_A[Activer/Désactiver un utilisateur]:::include
    UC_R[Réinitialiser un mot de passe]:::include
    UC_S["Consulter les statistiques d'utilisation"]:::include
    
    %% Relations admin
    Admin --> UC1
    Admin --> UC2
    Admin --> UC3
    Admin --> UC4
    Admin --> UC5
    Admin --> UC6
    Admin --> UC7
    
    %% Relations système
    System --> UC8
    System --> UC9
    
    %% Relations d'inclusion
    UC2 -.-> |<<include>>| UC_A
    UC2 -.-> |<<include>>| UC_R
    UC1 -.-> |<<include>>| UC_S
```

## Légende et conventions

- **Acteur** : entité externe qui interagit avec le système (représenté par un cercle)
- **Cas d'utilisation** : fonctionnalité ou service offert par le système (représenté par une ellipse)
- **Relation simple** : indique qu'un acteur participe à un cas d'utilisation (ligne pleine)
- **Relation d'inclusion** : indique qu'un cas d'utilisation en inclut obligatoirement un autre (ligne pointillée avec <<include>>)
- **Relation d'extension** : indique qu'un cas d'utilisation peut en étendre un autre sous certaines conditions (ligne pointillée avec <<extend>>)

## Couleurs utilisées

- **Acteurs** : fond rose
- **Cas d'utilisation standard** : fond bleu clair
- **Cas d'inclusion** : fond vert clair
- **Cas d'extension** : fond rouge clair
