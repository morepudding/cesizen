gantt
    %% -----------------------------------------------------
    %% Paramètres généraux du diagramme
    %% -----------------------------------------------------
    title Plan de Projet Avancé (Durée ~6 mois)
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m/%y
    excludes    weekends  %% Pour masquer les weekends dans la timeline

    %% [Optionnel] Configuration du style global
    %% Mermaid peut personnaliser les couleurs et styles via 'classDef'.
    %% Voir en fin de code l'exemple d'usage.
    
    %% -----------------------------------------------------
    %% Début du Projet
    %% -----------------------------------------------------
    %% On suppose que le projet démarre le 01/03/2025
    %% Libre à toi de changer pour coller à ta planification réelle.
    
    %% =========================
    %%       PHASE 1
    %% =========================
    section Phase 1 : Analyse & Spécifications
    Recueil et Analyse du Besoin       :a1, 2025-03-01, 10d
    Rédaction Cahier des Charges       :a2, after a1, 7d
    Validation Cahier des Charges      :milestone, m1, after a2, 0d

    %% Sous-Phase: Modélisation
    section Sous-Phase : Modélisation
    Conception UML (Cas d'Utilisation):b1, after m1, 7d
    MCD (Modèle Conceptuel de Données) :b2, after b1, 7d
    Validation Analyse et Modélisation :milestone, m2, after b2, 0d
    
    %% =========================
    %%       PHASE 2
    %% =========================
    section Phase 2 : Conception & Prototypage
    Wireframes / Mockups              :c1, after m2, 14d
    Architecture Système (MVC)        :c2, after c1, 14d
    Validation UI/UX                  :milestone, m3, after c2, 0d

    %% =========================
    %%       PHASE 3
    %% =========================
    section Phase 3 : Développement (Sprint 1)
    Authentification & Gestion Comptes:d1, after m3, 30d
    Base de Données (Implémentation)  :d2, after d1, 14d
    Intégration Modules Principaux     :d3, after d2, 14d
    Démo version Alpha                :milestone, m4, after d3, 0d

    %% =========================
    %%       PHASE 4
    %% =========================
    section Phase 4 : Développement (Sprint 2)
    Module Tracker d’Émotions         :e1, after m4, 30d
    Questionnaire de Stress           :e2, after e1, 14d
    Tests Unitaires & Régression      :e3, after e2, 14d
    Version Beta                      :milestone, m5, after e3, 0d

    %% =========================
    %%       PHASE 5
    %% =========================
    section Phase 5 : Tests & Corrections
    Tests Fonctionnels (global)       :f1, after m5, 14d
    Vérifications Sécurité & RGPD     :f2, after f1, 7d
    Validation Finale                 :milestone, m6, after f2, 0d

    section Déploiement & Mise en Production
    Hébergement & Infrastructure      :g1, after m6, 14d
    Monitoring & Documentation        :g2, after g1, 7d
    Lancement en Production           :milestone, m7, after g2, 0d

    %% =========================
    %%   Exemples de style
    %% =========================
    classDef milestoneClass fill:#f67c92,stroke:#f67c92,stroke-width:2px,color:#fff
    class m1,m2,m3,m4,m5,m6,m7 milestoneClass
