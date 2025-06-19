# Diagrammes d'Architecture et MCD pour CesiZen

Ce document présente trois diagrammes complémentaires pour CesiZen : une architecture technique détaillée, une architecture fonctionnelle conceptuelle et un modèle conceptuel de données.

## 1. Architecture Technique Détaillée (Version Claire)

```mermaid
flowchart LR
    %% Styles et couleurs
    classDef frontend fill:#e1f5fe,stroke:#0288d1,stroke-width:1px,color:#01579b
    classDef backend fill:#fff3e0,stroke:#ff9800,stroke-width:1px,color:#e65100
    classDef hosting fill:#f9fbe7,stroke:#558b2f,stroke-width:1px,color:#33691e
    classDef database fill:#e8f5e9,stroke:#388e3c,stroke-width:1px,color:#1b5e20
    classDef auth fill:#f3e5f5,stroke:#8e24aa,stroke-width:1px,color:#4a148c
    classDef monitoring fill:#fce4ec,stroke:#d81b60,stroke-width:1px,color:#880e4f
    classDef user fill:#e8eaf6,stroke:#3949ab,stroke-width:1px,color:#1a237e
    
    %% Utilisateurs
    User((Utilisateurs)):::user
    
    %% Frontend
    subgraph Frontend["Frontend"]
        NextJS["Next.js\n(Framework React)"]:::frontend
        Tailwind["Tailwind CSS\n(Styles)"]:::frontend
        React["ReactJS\n(UI Components)"]:::frontend
        NextJS --> React
        NextJS --> Tailwind
    end
    
    %% Backend
    subgraph Backend["Backend"]
        NextAPIRoutes["Next.js API Routes\n(Endpoints)"]:::backend
        PrismaORM["Prisma ORM\n(Data Access)"]:::backend
        NextAPIRoutes --> PrismaORM
    end
    
    %% Base de données
    subgraph Database["Base de données"]
        PostgreSQL[("PostgreSQL\n(Données app)")]:::database
        PrismaORM --> PostgreSQL
    end
    
    %% Authentification
    subgraph Auth["Authentification"]
        NextAuthJS["NextAuth.js"]:::auth
        OAuth["OAuth 2.0\nProviders"]:::auth
        JWT["JWT Tokens"]:::auth
        NextAuthJS --> OAuth
        NextAuthJS --> JWT
    end
    
    %% Déploiement & CI/CD
    subgraph Hosting["Hébergement & Déploiement"]
        GitHub["GitHub\n(Source Control)"]:::hosting
        Vercel["Vercel\n(Hosting)"]:::hosting
        GitHub --> Vercel
    end
    
    %% Monitoring
    subgraph Monitoring["Monitoring"]
        Sentry["Sentry\n(Error Tracking)"]:::monitoring
    end
    
    %% Relations entre composants
    User --> NextJS
    NextJS --> NextAPIRoutes
    NextJS -- "Authentification" --> NextAuthJS
    NextJS -- "Reporting erreurs" --> Sentry
    Backend -- "Reporting erreurs" --> Sentry
    
    %% Flux de déploiement
    GitHub -- "CI/CD" --> Vercel
    Vercel -- "Déploiement" --> NextJS
```

## 2. Architecture Fonctionnelle Conceptuelle (Version Sombre)

```mermaid
flowchart TD
    %% Styles et couleurs (version sombre)
    classDef user fill:#283593,stroke:#1a237e,stroke-width:1px,color:#ffffff
    classDef ui fill:#37474f,stroke:#263238,stroke-width:1px,color:#eceff1
    classDef api fill:#424242,stroke:#212121,stroke-width:1px,color:#f5f5f5
    classDef data fill:#455a64,stroke:#37474f,stroke-width:1px,color:#eceff1
    classDef monitor fill:#4e342e,stroke:#3e2723,stroke-width:1px,color:#efebe9
    classDef deploy fill:#263238,stroke:#263238,stroke-width:1px,color:#eceff1
    
    %% Utilisateurs et rôles
    Visitor(["Visiteur"]):::user
    User(["Utilisateur"]):::user
    Admin(["Administrateur"]):::user
    
    %% Interface utilisateur
    subgraph Interface["Interface Utilisateur"]
        Pages["Pages Publiques\net Protégées"]:::ui
        Dashboard["Tableau de Bord\nUtilisateur"]:::ui
        AdminPanel["Panneau\nAdministration"]:::ui
    end
    
    %% API et logique métier
    subgraph API["Endpoints API"]
        AuthAPI["Authentification\nJWT & Sessions"]:::api
        PublicAPI["API\nPubliques"]:::api
        ProtectedAPI["API\nProtégées"]:::api
        AdminAPI["API\nAdmin"]:::api
    end
    
    %% Base de données
    subgraph Database["Base de données"]
        UserData["Données\nUtilisateurs"]:::data
        ContentData["Contenu\nApplication"]:::data
        SystemData["Données\nSystème"]:::data
    end
    
    %% Déploiement et monitoring
    Deployment["Déploiement\nFront/Back"]:::deploy
    Monitoring["Erreurs\n& Logs"]:::monitor
    
    %% Relations entre composants
    Visitor --> Pages
    Visitor --> PublicAPI
    
    User --> Pages
    User --> Dashboard
    User --> PublicAPI
    User --> ProtectedAPI
    User -- "Authentification" --> AuthAPI
    
    Admin --> Pages
    Admin --> Dashboard
    Admin --> AdminPanel
    Admin --> PublicAPI
    Admin --> ProtectedAPI
    Admin --> AdminAPI
    Admin -- "Authentification" --> AuthAPI
    
    Pages -- "Requêtes API JSON" --> PublicAPI
    Dashboard -- "Requêtes API JSON" --> ProtectedAPI
    AdminPanel -- "Requêtes API JSON" --> AdminAPI
    
    AuthAPI --> UserData
    PublicAPI --> ContentData
    ProtectedAPI --> UserData
    ProtectedAPI --> ContentData
    AdminAPI --> UserData
    AdminAPI --> ContentData
    AdminAPI --> SystemData
    
    Interface -- "Erreurs client" --> Monitoring
    API -- "Erreurs serveur" --> Monitoring
    
    Deployment --> Interface
    Deployment --> API
```

## 3. Modèle Conceptuel de Données (MCD)

```mermaid
Flowchart td
    User {
        int id PK
        string name
        string email UK
        datetime emailVerified
        string image
        string password
        enum role
        datetime createdAt
        datetime updatedAt
        boolean isActive
        string resetToken
        datetime resetTokenExpires
    }
    
    Emotion {
        int id PK
        int userId FK
        int emotionId FK
        datetime date
        string comment
    }
    
    EmotionType {
        int id PK
        string name UK
        int level
        int parentId FK
        string color
        string bgColor
    }
    
    Activity {
        int id PK
        string title UK
        string description
        enum category
        string duration
        string level
        string location
        string equipment
        boolean isActive
        datetime createdAt
        datetime updatedAt
    }
    
    Favorite {
        int id PK
        int userId FK
        int activityId FK
        datetime createdAt
    }
    
    StressQuestion {
        int id PK
        string event UK
        int points
    }
    
    StressResult {
        int id PK
        int userId FK
        int totalScore
        datetime createdAt
    }
    
    PageContent {
        int id PK
        string page UK
        string title
        string content
        datetime updatedAt
    }
    
    User ||--o{ Favorite : "possède"
    User ||--o{ StressResult : "obtient"
    User ||--o{ Emotion : "enregistre"
    
    Activity ||--o{ Favorite : "est dans"
    
    EmotionType ||--o{ Emotion : "est de type"
    EmotionType ||--o{ EmotionType : "parent de"
```

Ces diagrammes offrent différentes vues de l'application CesiZen:
- Le premier diagramme présente la pile technologique détaillée avec tous les composants techniques.
- Le deuxième diagramme adopte une approche plus conceptuelle axée sur les rôles utilisateurs et les grandes fonctionnalités.
- Le troisième diagramme présente la structure de la base de données avec les entités et leurs relations.
