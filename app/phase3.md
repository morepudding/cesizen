# Cahier de tests et Procédure de validation – CesiZen

## Table des matières
1. Introduction
2. Cahier de tests détaillé
   - 2.1 Comptes utilisateurs
   - 2.2 Informations
   - 2.3 Jardin Zen (optionnel)
   - 2.4 Sécurité
   - 2.5 Accessibilité & Mobile
   - 2.6 Performance
   - 2.7 Synthèse
3. Procédure de validation détaillée
4. Modèle de PV de recette
5. Annexes (exemples, jeux de données, conseils)

---

## 1. Introduction
Ce document décrit l’ensemble des tests à réaliser pour valider l’application CesiZen, ainsi que la procédure de validation et le modèle de procès-verbal de recette. Il couvre les modules obligatoires (comptes utilisateurs, informations), un module optionnel (Jardin Zen), la sécurité, l’accessibilité, la compatibilité mobile et la performance.

---

## 2. Cahier de tests détaillé

### Structure du tableau de test
| Test ID | Module | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|---------|--------|----------------|---------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|

### 2.1. Comptes utilisateurs
| Test ID | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|--------|----------------|--------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|
| CU-01 | Inscription | Aucun compte existant | 1. Aller sur /signup<br>2. Remplir tous les champs<br>3. Valider | nom: "Test", email: "test@ex.com", mdp: "Test1234!" | Compte créé, email envoyé | Email reçu, accès dashboard | OK/KO | |
| CU-02 | Inscription email déjà utilisé | Compte existe | 1. Aller sur /signup<br>2. Saisir email déjà utilisé<br>3. Valider | email: "test@ex.com" | Message d’erreur | Message explicite | OK/KO | |
| CU-03 | Connexion valide | Compte activé | 1. Aller sur /login<br>2. Saisir identifiants<br>3. Valider | email: "test@ex.com", mdp: "Test1234!" | Accès personnel | Redirection dashboard | OK/KO | |
| CU-04 | Connexion invalide | Compte existe | 1. Aller sur /login<br>2. Saisir mauvais mdp<br>3. Valider | email: "test@ex.com", mdp: "fauxmdp" | Message d’erreur | Accès refusé | OK/KO | |
| CU-05 | Mot de passe oublié | Compte existe | 1. Aller sur /forgot-password<br>2. Saisir email<br>3. Valider | email: "test@ex.com" | Email de réinitialisation | Email reçu | OK/KO | |
| CU-06 | Réinitialisation mdp | Email reçu | 1. Cliquer sur le lien<br>2. Saisir nouveau mdp<br>3. Valider | mdp: "Nouveau123!" | Mdp modifié, connexion possible | Connexion OK | OK/KO | |
| CU-07 | Modification profil | Utilisateur connecté | 1. Aller sur /profil<br>2. Modifier infos<br>3. Valider | nom: "Test2" | Infos mises à jour | Message succès | OK/KO | |
| CU-08 | Suppression compte | Utilisateur connecté | 1. Aller sur /profil<br>2. Supprimer compte<br>3. Confirmer | - | Compte supprimé | Déconnexion | OK/KO | |
| CU-09 | Déconnexion | Utilisateur connecté | 1. Cliquer sur "Déconnexion" | - | Retour page login | Session fermée | OK/KO | |
| CU-10 | Tentative accès admin sans droits | Utilisateur non admin | 1. Aller sur /admin | - | Accès refusé | Message explicite | OK/KO | |

### 2.2. Informations
| Test ID | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|--------|----------------|--------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|
| INF-01 | Accès page infos | Aucun | 1. Aller sur /informations | - | Page affichée | Contenu visible | OK/KO | |
| INF-02 | Accès restreint | Non connecté | 1. Aller sur /profil | - | Redirection login | Sécurité respectée | OK/KO | |
| INF-03 | FAQ interactive | Aucun | 1. Aller sur /faq<br>2. Cliquer question | - | Réponse affichée | Animation jouée | OK/KO | |
| INF-04 | Recherche info | Aucun | 1. Aller sur /informations<br>2. Utiliser recherche | mot-clé: "stress" | Résultats pertinents | Infos filtrées | OK/KO | |
| INF-05 | Erreur chargement | API HS | 1. Aller sur /informations | - | Message d’erreur | Gestion propre | OK/KO | |

### 2.3. Jardin Zen (optionnel)
| Test ID | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|--------|----------------|--------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|
| JZ-01 | Affichage jardin | Aucun | 1. Aller sur accueil | - | Image fond, éléments interactifs | Présence visuelle | OK/KO | |
| JZ-02 | Interaction bassin | Aucun | 1. Cliquer bassin | - | Animation/popup | Feedback visuel | OK/KO | |
| JZ-03 | Interaction lanterne | Aucun | 1. Cliquer lanterne | - | Animation/popup | Feedback visuel | OK/KO | |
| JZ-04 | Interaction pont | Aucun | 1. Cliquer pont | - | Animation/popup | Feedback visuel | OK/KO | |
| JZ-05 | Sauvegarde jardin | Jardin modifié | 1. Cliquer "Sauvegarder"<br>2. Recharger page | - | Jardin restauré | Persistance OK | OK/KO | |
| JZ-06 | Erreur chargement éléments | API HS | 1. Aller sur accueil | - | Message d’erreur | Gestion propre | OK/KO | |

### 2.4. Sécurité
| Test ID | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|--------|----------------|--------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|
| SEC-01 | SQL Injection | Aucun | 1. Saisir ' OR '1'='1 dans login | - | Requête bloquée | Message/code erreur | OK/KO | |
| SEC-02 | XSS | Aucun | 1. Saisir <script>alert('XSS')</script> | - | Input rejeté | Pas d’exécution JS | OK/KO | |
| SEC-03 | Headers sécurité | Aucun | 1. Vérifier headers HTTP | - | Headers présents | Sécurité conforme | OK/KO | |
| SEC-04 | Brute force | Aucun | 1. Tenter connexions rapides | - | Blocage temporaire | Message/limite | OK/KO | |
| SEC-05 | Accès API non autorisé | Non authentifié | 1. Appeler API privée | - | Refus accès | Code 401/403 | OK/KO | |

### 2.5. Accessibilité & Mobile
| Test ID | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|--------|----------------|--------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|
| ACC-01 | Navigation clavier | Aucun | 1. Naviguer avec Tab | - | Accès à tous éléments | Focus visible | OK/KO | |
| ACC-02 | Contraste couleurs | Aucun | 1. Vérifier contraste | - | Contraste suffisant | Norme WCAG | OK/KO | |
| ACC-03 | Lecteur d’écran | Aucun | 1. Utiliser NVDA/VoiceOver | - | Infos lues correctement | Accessibilité OK | OK/KO | |
| MOB-01 | Responsive mobile | Aucun | 1. Ouvrir sur mobile | - | Affichage adapté | Pas de bug d’affichage | OK/KO | |
| MOB-02 | Responsive tablette | Aucun | 1. Ouvrir sur tablette | - | Affichage adapté | Pas de bug d’affichage | OK/KO | |

### 2.6. Performance
| Test ID | Fonctionnalité | Préconditions | Étapes détaillées | Données de test | Résultat attendu | Critère d’acceptation | Statut | Commentaire |
|--------|----------------|--------------|-------------------|-----------------|------------------|-----------------------|--------|-------------|
| PERF-01 | Temps de chargement | Aucun | 1. Mesurer chargement accueil | - | < 2s | Page rapide | OK/KO | |
| PERF-02 | Temps de réponse API | Aucun | 1. Appeler API | - | < 500ms | Réponse rapide | OK/KO | |
| PERF-03 | Test charge | Aucun | 1. Simuler 50 utilisateurs | - | Pas de crash | Stabilité | OK/KO | |

### 2.7. Synthèse
- Tous les tests doivent être passés (OK) pour valider la livraison.
- Les tests automatisés (Jest, React Testing Library, Playwright) doivent couvrir au moins 80% des composants critiques.
- Les tests de sécurité peuvent être lancés via le script `npm run security-test` ou `manual-security-test.sh`.
- Les tests d’accessibilité peuvent être réalisés avec axe, Lighthouse, etc.
- Les tests de performance peuvent être réalisés avec Lighthouse, k6, etc.

---

## 3. Procédure de validation détaillée

### 3.1 Préparation
- Déployer la version à valider sur un environnement de test isolé.
- Réinitialiser la base de données (script de reset, jeu de données de test).
- Vérifier que tous les services externes (email, stockage, API) sont fonctionnels.
- Préparer les comptes de test (admin, utilisateur standard, etc.).
- Préparer les outils de test (navigateur, mobile, outils accessibilité, scripts de charge).

### 3.2 Exécution des tests
- Suivre le cahier de tests ligne par ligne.
- Pour chaque test :
  - Noter la date, l’environnement, le testeur.
  - Documenter les données utilisées.
  - Capturer des captures d’écran en cas d’échec.
  - Remplir la colonne "Statut" et "Commentaire".
- Pour les tests automatisés, générer le rapport de couverture.
- Pour les tests de sécurité, joindre le rapport du script.

### 3.3 Correction
- En cas de KO, ouvrir un ticket (Jira, GitHub, etc.) avec :
  - Description du bug, étapes pour reproduire, logs éventuels, capture d’écran.
- Corriger le bug, déployer la correction sur l’environnement de test.
- Rejouer le(s) test(s) concerné(s) jusqu’à obtention d’un OK.

### 3.4 Validation finale
- Vérifier que tous les tests sont OK.
- Compiler le PV de recette (voir ci-dessous).
- Faire signer le PV par le responsable projet et le client/enseignant.
- Archiver les rapports de tests, captures d’écran, tickets, etc.

---

## 4. Modèle de PV de recette

```markdown
Procès-Verbal de Recette

Projet : CesiZen
Date : [JJ/MM/AAAA]
Version validée : [vX.Y.Z]
Environnement : [Test / Préprod / Prod]
Testeurs : [Noms]

Tests réalisés : [nombre]
Tests OK : [nombre]
Tests KO : [nombre, détail en annexe]
Bugs ouverts : [nombre, liens vers tickets]
Bugs bloquants restants : [oui/non, détail]

Décision :
☑ Application validée pour livraison
☐ Application non validée (voir remarques)

Remarques / Points d’attention :
- [Liste des points à surveiller, limitations connues, etc.]

Signatures :
- Responsable projet : ___________________
- Client/enseignant : ____________________
```

---

## 5. Annexes et conseils pratiques

### Exemples de jeux de données
- Utilisateur test : nom: "Test", email: "test@ex.com", mdp: "Test1234!"
- Utilisateur admin : nom: "Admin", email: "admin@ex.com", mdp: "Admin1234!"
- Données FAQ : question: "Comment gérer le stress ?", réponse: "Voir la section respiration."

### Conseils pour la rédaction et l’exécution
- Ajouter des captures d’écran pour illustrer les tests.
- Pour les tests automatisés, joindre le rapport de couverture (coverage).
- Pour la sécurité, joindre le rapport du script de test.
- Pour l’accessibilité, utiliser axe, Lighthouse, NVDA, etc.
- Pour la performance, utiliser Lighthouse, k6, etc.
- Pour la compatibilité mobile, tester sur plusieurs appareils et navigateurs.

### Ressources complémentaires dans le projet
- app/phase3.md : structure de base du cahier de tests et PV de recette.
- docs/SECURITY_PROTECTION.md : exemples de tests de sécurité automatisés et manuels.
- docs/INSTALLATION_GUIDE.md : section "Tests de Validation" avec scripts shell pour automatiser certains tests.
- diagrammes_cas_utilisation.md : pour lister tous les cas d’utilisation à tester.
- diagrammes_complementaires.md, temp_diagrams/ : diagrammes pour comprendre les flux à valider.
- seed.cjs, security/manual-security-test.sh : scripts de seed et de test manuel.

---

**N’hésite pas à dupliquer les tableaux pour chaque module, à ajouter des variantes d’erreur, et à compléter avec tes propres scénarios !**