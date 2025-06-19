# Diagrammes Complémentaires pour CesiZen

Ce document présente quatre diagrammes complémentaires pour l'application CesiZen : un diagramme de classes, un diagramme d'états, un diagramme de déploiement et un diagramme d'activité.

## 1. Diagramme de Classes

Ce diagramme montre les principales classes de l'application CesiZen et leurs relations.

```mermaid
classDiagram
    %% Classes utilisateur et authentification
    class User {
        +id: int
        +name: string
        +email: string
        +password: string
        +role: Role
        +isActive: boolean
        +createdAt: datetime
        +updatePassword(password: string): boolean
        +validateCredentials(email: string, password: string): boolean
        +toggleActiveStatus(): void
    }
    
    class Role {
        <<enumeration>>
        USER
        ADMIN
    }

    %% Classes liées aux émotions
    class Emotion {
        +id: int
        +userId: int
        +emotionId: int
        +date: datetime
        +comment: string
        +addComment(text: string): void
    }
    
    class EmotionType {
        +id: int
        +name: string
        +level: int
        +parentId: int
        +color: string
        +bgColor: string
        +getChildren(): EmotionType[]
    }

    %% Classes liées aux activités
    class Activity {
        +id: int
        +title: string
        +description: string
        +category: ActivityCategory
        +duration: string
        +level: string
        +location: string
        +equipment: string
        +isActive: boolean
        +createdAt: datetime
        +updatedAt: datetime
        +toggleActiveStatus(): void
    }
    
    class ActivityCategory {
        <<enumeration>>
        BIEN_ETRE
        SPORT
        ART
        AVENTURE
    }
    
    class Favorite {
        +id: int
        +userId: int
        +activityId: int
        +createdAt: datetime
        +remove(): void
    }

    %% Classes liées au stress
    class StressQuestion {
        +id: int
        +event: string
        +points: int
        +calculateScore(selected: boolean): int
    }
    
    class StressResult {
        +id: int
        +userId: int
        +totalScore: int
        +createdAt: datetime
        +getStressLevel(): string
        +generateRecommendations(): Activity[]
    }

    %% Classes liées au jardin zen
    class Garden {
        +id: string
        +userId: int
        +elements: GardenElement[]
        +addElement(element: GardenElement): void
        +removeElement(elementId: string): void
        +moveElement(elementId: string, x: int, y: int): void
        +save(): void
        +load(): void
    }
    
    class GardenElement {
        +id: string
        +type: string
        +x: int
        +y: int
        +render(): JSX.Element
    }
    
    class CommandManager {
        -commands: Command[]
        -currentIndex: int
        +execute(command: Command): void
        +undo(): void
        +redo(): void
    }
    
    class Command {
        <<interface>>
        +execute(): void
        +undo(): void
    }
    
    class MoveElementCommand {
        -element: GardenElement
        -oldX: int
        -oldY: int
        -newX: int
        -newY: int
        +execute(): void
        +undo(): void
    }

    %% Classes liées au contenu
    class PageContent {
        +id: int
        +page: string
        +title: string
        +content: string
        +updatedAt: datetime
        +update(title: string, content: string): void
    }
    
    %% Relations
    User "1" -- "0..*" Favorite : possède
    User "1" -- "0..*" Emotion : enregistre
    User "1" -- "0..*" StressResult : obtient
    User "1" -- "1" Garden : possède
    
    Emotion "*" -- "1" EmotionType : est de type
    EmotionType "0..1" -- "*" EmotionType : parent de
    
    Favorite "*" -- "1" Activity : référence
    Activity "1" -- "1" ActivityCategory : appartient à
    
    Garden "1" -- "*" GardenElement : contient
    Garden -- CommandManager : utilise
    CommandManager "1" -- "*" Command : gère
    Command <|-- MoveElementCommand : implémente
    
    StressResult ..> Activity : recommande
```

## 2. Diagramme d'États - Compte Utilisateur

Ce diagramme illustre les différents états possibles pour un compte utilisateur CesiZen.

```mermaid
stateDiagram-v2
    [*] --> NonInscrit: Accès initial
    
    NonInscrit --> EnAttente: S'inscrire
    NonInscrit --> Connecté: Se connecter (compte existant)
    
    EnAttente --> NonValidé: Email envoyé
    NonValidé --> Actif: Cliquer sur lien de validation
    NonValidé --> Expiré: Délai de validation dépassé
    
    Expiré --> NonValidé: Demander nouvel email
    
    Actif --> Connecté: Se connecter
    Actif --> MdpOublié: Demander réinitialisation
    
    MdpOublié --> EnRéinitialisation: Email envoyé
    EnRéinitialisation --> Actif: Nouveau mot de passe défini
    EnRéinitialisation --> Expiré: Délai dépassé
    
    Connecté --> Actif: Se déconnecter
    Connecté --> ModificationProfil: Modifier informations
    ModificationProfil --> Connecté: Modifications enregistrées
    
    Actif --> Désactivé: Désactiver compte
    Désactivé --> Actif: Réactiver compte
    
    Actif --> Supprimé: Supprimer définitivement
    Désactivé --> Supprimé: Supprimer définitivement
    Expiré --> Supprimé: Nettoyage automatique
    
    Supprimé --> [*]
```

## 3. Diagramme de Déploiement

Ce diagramme détaille l'infrastructure physique de déploiement de l'application CesiZen.

```mermaid
flowchart TB
    %% Styles
    classDef client fill:#f9f0ff,stroke:#9c27b0,stroke-width:2px
    classDef server fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    classDef database fill:#e8f5e9,stroke:#388e3c,stroke-width:2px
    classDef cdn fill:#fff3e0,stroke:#ff9800,stroke-width:2px
    classDef service fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px

    %% Appareils clients
    subgraph "Terminaux Clients"
        Browser["Navigateur Web\n(Chrome, Firefox, Safari, Edge)"]:::client
        Mobile["Applications Mobiles\n(PWA)"]:::client
    end

    %% Infrastructure Vercel
    subgraph "Plateforme Vercel"
        VercelEdge["Vercel Edge Network\n(CDN Global)"]:::cdn
        
        subgraph "Vercel Serverless Functions"
            NextJSApp["Next.js App\n(Frontend SSR + API Routes)"]:::server
            NextAuth["NextAuth.js\n(Authentification)"]:::service
        end
        
        ImageOptimization["Optimisation d'Images\nAutomatique"]:::service
    end

    %% Base de données
    subgraph "Infrastructure de Données"
        PlanetScale["PlanetScale\n(MySQL Serverless)"]:::database
        
        subgraph "Monitoring et Observabilité"
            Sentry["Sentry\n(Error Tracking)"]:::service
            VercelAnalytics["Vercel Analytics\n(Performances)"]:::service
        end
    end

    %% Services externes
    subgraph "Services Externes"
        EmailService["Service Email\n(Resend.com)"]:::service
        BlobStorage["Stockage Objets\n(Vercel Blob)"]:::service
    end
    
    %% CI/CD Pipeline
    subgraph "CI/CD"
        GitHub["GitHub\n(Source Control)"]:::service
        GitHubActions["GitHub Actions\n(Tests Automatisés)"]:::service
    end
    
    %% Relations
    Browser --> VercelEdge
    Mobile --> VercelEdge
    
    VercelEdge --> NextJSApp
    NextJSApp --> NextAuth
    NextJSApp --> PlanetScale
    NextAuth --> PlanetScale
    
    NextJSApp --> EmailService
    NextJSApp --> BlobStorage
    
    NextJSApp --> Sentry
    NextJSApp --> VercelAnalytics
    
    GitHub --> GitHubActions
    GitHubActions --> VercelEdge
```

## 4. Diagramme d'Activité - Processus d'Évaluation du Stress

Ce diagramme illustre le processus d'évaluation du niveau de stress et de recommandation d'activités.

```mermaid
flowchart TB
    %% Styles
    classDef start fill:#d1c4e9,stroke:#673ab7,stroke-width:2px
    classDef process fill:#e1bee7,stroke:#8e24aa,stroke-width:1px
    classDef decision fill:#f3e5f5,stroke:#9c27b0,stroke-width:1px,shape:diamond
    classDef ending fill:#ede7f6,stroke:#673ab7,stroke-width:2px

    %% Phases du processus
    start((Début)):::start --> AccessTest[Utilisateur accède au test de stress]:::process
    AccessTest --> LoadQuestions[Chargement des questions de stress]:::process
    LoadQuestions --> DisplayQuestionnaire[Affichage du questionnaire]:::process
    
    DisplayQuestionnaire --> SelectEvents[Utilisateur sélectionne les événements vécus]:::process
    SelectEvents --> NoEvents{Événements sélectionnés?}:::decision
    
    NoEvents -- Non --> DisplayError[Afficher message d'erreur]:::process
    DisplayError --> DisplayQuestionnaire
    
    NoEvents -- Oui --> CalculateScore[Calcul du score total]:::process
    CalculateScore --> SaveResults[Enregistrement du résultat]:::process
    
    SaveResults --> IsUserAuthenticated{Utilisateur connecté?}:::decision
    IsUserAuthenticated -- Oui --> AssociateWithUser[Association au profil utilisateur]:::process
    IsUserAuthenticated -- Non --> AnonymousResult[Résultat anonyme]:::process
    
    AssociateWithUser --> DetermineLevel[Détermination du niveau de stress]:::process
    AnonymousResult --> DetermineLevel
    
    DetermineLevel --> StressLevel{Niveau de stress}:::decision
    StressLevel -- "Faible\n(<150)" --> LowStressRecommendations[Recommandations légères]:::process
    StressLevel -- "Modéré\n(150-300)" --> MediumStressRecommendations[Recommandations modérées]:::process
    StressLevel -- "Élevé\n(>300)" --> HighStressRecommendations[Recommandations intensives]:::process
    
    LowStressRecommendations --> FindRelatedActivities[Recherche d'activités adaptées]:::process
    MediumStressRecommendations --> FindRelatedActivities
    HighStressRecommendations --> FindRelatedActivities
    
    FindRelatedActivities --> DisplayResults[Affichage des résultats et recommandations]:::process
    
    DisplayResults --> ViewHistory{Voir historique?}:::decision    ViewHistory -- Oui --> IsUserAuthenticated2{Utilisateur connecté?}:::decision
    ViewHistory -- Non --> end1((Fin)):::ending
    
    IsUserAuthenticated2 -- Non --> LoginPrompt[Inviter à se connecter]:::process
    IsUserAuthenticated2 -- Oui --> LoadHistory[Chargement de l'historique]:::process
    
    LoginPrompt --> end1
    LoadHistory --> AnalyzeTrends[Analyse des tendances]:::process
    AnalyzeTrends --> DisplayTrends[Affichage des graphiques de tendance]:::process
    DisplayTrends --> end1
```

Ces diagrammes complètent la documentation technique de CesiZen en présentant différentes vues du système : la structure des classes et leurs relations, les états possibles d'un compte utilisateur, l'infrastructure de déploiement et le processus métier d'évaluation du stress.
