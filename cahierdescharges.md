CAHIER DES CHARGES 

PROJET CESIZen 

Développement d'une plateforme de gestion du stress et du bien-être mental 
�� Auteur : Romain BOTTERO 
�� Date : Février 2025 
�� Formation : Concepteur Développeur d’Applications 

Résumé : 
Ce document présente les spécifications fonctionnelles et techniques du projet CESIZen, une application visant à améliorer la gestion du stress et la santé mentale à travers des outils interactifs et un design intuitif. 
Table des matières 
1. Introduction 1 1.1 Contexte 1 1.2 Objectifs 1 1.3 Présentation générale 2 
2. Présentation du Projet 2 2.1 Origine et vision 2
2.2 Périmètre fonctionnel 3 2.3 Roadmap de Développement 3 3. Acteurs et Rôles 5 3.1 Visiteurs anonymes 5 3.2 Utilisateurs connectés 5 3.3 Administrateurs 6 4. Fonctionnalités 7 4.1 Gestion des comptes 7 4.2 Tracker d’émotions 7 4.3 Tests de stress et diagnostics 8 4.4 Exercices de respiration 8 4.5 Gestion des activités 8 4.6 Administration et gestion des contenus 9 5. Contraintes et Normes 9 5.1 Contraintes techniques 9 5.2 Contraintes réglementaires (RGPD, sécurité) 10 5.3 Standards de qualité 10 5.4 Contraintes Budgétaire 11 5.1 Approche Mobile First 13 5.2 Technologies et bonnes pratiques 13 5.3 Contraintes spécifiques aux mobiles 13 5.4 Tests et validation mobile 14 6. Risques et Mesures d’Atténuation 14 6.1 Sécurité des données 14 6.2 Conformité et accessibilité 15 6.3 Adoption par les utilisateurs 15 6.4 Gestion des Données Personnelles et Conformité RGPD 16 7. Cahier des Charges Techniques 17 7.1 Technologies utilisées 17 7.1.1 Technologies du Front-End 17 7.1.2 Technologies du Back-End 17 7.1.3 Hébergement et Déploiement 18 7.2 Architecture logicielle 19 7.2.1 Organisation du projet 19 7.2.2 Principe de fonctionnement 19 7.3 Base de données 19 8. Déploiement et Maintenance 22 8.1 Plan de déploiement 22 8.2 Maintenance corrective et évolutive 22 8.3 Planification des Ressources humaines 23 9. Livrables 24 9.1 Documentation projet 24 1

9.2 Code source et manuel d’installation 24 9.3 Cahier de tests et validation 24 ● 10. Annexes 26 

1. Introduction 
1.1 Contexte 
Dans un monde où le stress et les troubles liés à la santé mentale prennent une place croissante dans la vie quotidienne, il devient essentiel de fournir des outils accessibles pour aider chacun à mieux gérer son bien-être émotionnel. Le projet CESIZen s’inscrit dans cette démarche en proposant une plateforme numérique dédiée à la gestion du stress et à la santé mentale, offrant des ressources interactives adaptées au grand public. 
Ce projet est conçu comme une simulation d’une initiative qui pourrait être portée par le Ministère de la Santé et de la Prévention, visant à sensibiliser les utilisateurs aux facteurs de stress, à leur permettre de suivre leurs émotions et à proposer des exercices pratiques de relaxation. 
Grâce à une approche moderne et digitale, CESIZen apporte une réponse aux défis posés par le stress chronique et l’impact qu’il peut avoir sur la santé mentale et physique. 
1.2 Objectifs 
Objectif général 
L’objectif principal de CESIZen est de créer une plateforme intuitive et interactive permettant aux utilisateurs d’évaluer leur niveau de stress, de suivre l’évolution de leurs émotions et d’accéder à des exercices personnalisés pour améliorer leur bien-être mental. 
Objectifs spécifiques 
● Offrir un diagnostic interactif basé sur des questionnaires scientifiques pour évaluer le stress. 
● Mettre à disposition des exercices de relaxation comme la cohérence cardiaque et la respiration guidée. 
● Fournir un outil de suivi des émotions permettant aux utilisateurs de visualiser leur état 2

psychologique au fil du temps. 
● Garantir un accès sécurisé et confidentiel aux données des utilisateurs en respectant les normes RGPD. 
● Développer une interface ergonomique et accessible en responsive design, adaptée aussi bien aux ordinateurs qu’aux mobiles. 
CESIZen ne se limite pas à un simple outil d’auto-évaluation, mais ambitionne de devenir un véritable accompagnateur numérique pour la gestion du stress et la promotion du bien-être psychologique. 
1.3 Présentation générale 
CESIZen est une application web développée avec Next.js pour le front-end, Prisma pour la gestion des données et NextAuth pour l’authentification sécurisée. Elle est conçue pour offrir : 
Une expérience utilisateur fluide et intuitive grâce à une interface soignée et des animations interactives. 
Des fonctionnalités modulaires comprenant un suivi des émotions, des exercices de respiration et des questionnaires de stress. 
Un espace administrateur permettant la gestion des contenus et des utilisateurs. Une accessibilité optimisée, avec un design responsive adapté aux écrans mobiles et une compatibilité avec les principaux navigateurs. 
Une sécurité renforcée, assurant la protection des données personnelles via le chiffrement et les bonnes pratiques en matière de cybersécurité. 
Le développement de CESIZen repose sur une approche agile, permettant d’adapter et d’améliorer progressivement les fonctionnalités en fonction des besoins des utilisateurs. 
L’application est pensée pour évoluer et intégrer, à terme, d’autres fonctionnalités comme des rapports personnalisés, des conseils adaptés au profil de l’utilisateur, et une intelligence artificielle capable d’analyser l’évolution du bien-être des utilisateurs. 

3

2. Présentation du Projet 
2.1 Origine et vision 
Le projet CESIZen est né d’une volonté de proposer une solution numérique accessible pour aider à mieux gérer le stress et améliorer la santé mentale. Dans un contexte où le stress devient un facteur de risque majeur pour la santé, cette plateforme vise à offrir un outil d’accompagnement quotidien, apportant des solutions simples et efficaces aux utilisateurs. 
Bien que ce projet soit une simulation académique, il s’inspire des initiatives du Ministère de la Santé et de la Prévention, qui met en avant l’importance du bien-être mental à travers des campagnes de sensibilisation et des outils numériques. CESIZen se positionne ainsi comme une réponse innovante aux besoins croissants en matière de gestion du stress et de suivi émotionnel. 
L’objectif est de proposer une approche alliant simplicité, efficacité et accessibilité, en mettant à disposition des fonctionnalités interactives basées sur des méthodes éprouvées de relaxation et de suivi du bien-être mental. 
2.2 Périmètre fonctionnel 
L’application CESIZen couvre plusieurs domaines clés liés à la gestion du stress et à la santé mentale : Fonctionnalités principales 
● Gestion des comptes et authentification : inscription, connexion et gestion des profils utilisateurs. 
● Tracker d’émotions : suivi de l’évolution du bien-être mental au fil du temps. ● Test de stress : questionnaire basé sur l’échelle de Holmes et Rahe. 
● Exercices de relaxation : techniques de respiration et de cohérence cardiaque. ● Catalogue d’activités bien-être : proposition d’activités favorisant la détente. ● Espace administrateur : gestion des contenus, des utilisateurs et des exercices. Public cible 
L’application est destinée à un large public, incluant toute personne souhaitant mieux comprendre et gérer son stress, ainsi que des professionnels cherchant des outils pour accompagner leurs patients. 
Portée du projet 
Le projet est conçu pour être accessible en ligne, avec une interface responsive adaptée aux ordinateurs et aux appareils mobiles. Il respecte les standards de sécurité et de protection des données (RGPD) pour assurer la confidentialité des informations des utilisateurs. 
4

2.3 Roadmap de Développement 
La roadmap suivante illustre les grandes étapes du projet CESIZen, depuis l’analyse des besoins jusqu’à la mise en production. Elle permet de visualiser l’ordre des tâches, les jalons clés et la progression des différentes phases. 
Description des Phases : 
● Analyse : Recueil des besoins, modélisation des données et rédaction du cahier des charges. ● Conception & Prototypage : Création des wireframes et de l’architecture logicielle. ● Développement : Implémentation des fonctionnalités principales en plusieurs sprints. ● Tests et corrections : Vérification fonctionnelle et optimisation avant mise en production. ● Déploiement : Mise en ligne et lancement officiel. 
Chaque phase inclut des points de validation garantissant la qualité et la progression du projet. 
5

Légendes du diagramme de GANT : 
�� Carré gris : Tâche principale en cours 
�� Losange bleu : Validation d’une phase clé 
⬜ Fond coloré : Phase du projet 
�� Ligne verticale : Jalon temporel marquant le début d’une nouvelle phase 
6


3. Acteurs et Rôles 
3.1 Visiteurs anonymes 
Les visiteurs anonymes sont des utilisateurs qui accèdent à l’application sans inscription ni authentification. Leur accès est limité aux fonctionnalités publiques, leur permettant de découvrir les outils proposés par CESIZen sans engagement. 
Droits et fonctionnalités accessibles : 
● Accès aux contenus informatifs : possibilité de consulter les pages dédiées à la gestion du stress, aux bienfaits des exercices de respiration et aux recommandations générales sur la santé mentale. 
● Participation au test de stress : les visiteurs peuvent remplir le questionnaire d’auto-évaluation et visualiser un résultat instantané, mais ne peuvent pas sauvegarder leurs réponses pour un suivi ultérieur. 
● Utilisation des exercices de respiration : accès aux exercices interactifs de cohérence cardiaque, configurables selon les préférences de l’utilisateur. 
● Exploration du catalogue d’activités : possibilité de consulter et filtrer les différentes activités proposées pour la détente et la gestion du stress. 
Limitations des visiteurs anonymes : 
● Pas de suivi personnalisé : les réponses aux questionnaires et l’historique des exercices ne sont pas enregistrés. 
● Pas d’accès au tracker d’émotions : le journal de bord émotionnel est réservé aux utilisateurs authentifiés. 
● Pas d’interaction avancée : impossibilité de sauvegarder des activités en favoris ou de configurer des exercices personnalisés. 
L’objectif de ce profil est d’offrir un premier niveau d’engagement tout en incitant les visiteurs à créer un compte pour bénéficier d’un suivi personnalisé. 
3.2 Utilisateurs connectés 
Les utilisateurs connectés disposent d’un compte personnel leur permettant d’accéder à des fonctionnalités avancées et de sauvegarder leurs données sur l’application. 
Fonctionnalités disponibles pour les utilisateurs connectés : 
7

● Gestion du compte utilisateur : possibilité de mettre à jour ses informations personnelles, changer son mot de passe et gérer ses préférences. 
● Accès au tracker d’émotions : journal permettant d’enregistrer et d’analyser l’évolution de son état émotionnel sur différentes périodes. 
● Sauvegarde et suivi des tests de stress : conservation des résultats pour observer les variations de stress dans le temps. 
● Personnalisation des exercices de respiration : ajustement des durées d’inspiration, d’expiration et d’apnée selon les préférences. 
● Gestion des favoris : possibilité d’enregistrer des activités préférées pour un accès rapide. 
● Rapports et analyses : génération de statistiques sur l’évolution des émotions et du niveau de stress. 
Limitations des utilisateurs connectés : 
● Pas d’accès à la gestion des contenus : les utilisateurs ne peuvent pas modifier les pages d’information ou les exercices proposés. 
● Accès limité aux données : ils ne peuvent voir que leurs propres données et ne disposent d’aucun accès aux informations des autres utilisateurs. 
En s’inscrivant, l’utilisateur bénéficie d’un suivi personnalisé et interactif, renforçant l’efficacité des outils proposés par CESIZen. 
3.3 Administrateurs 
Les administrateurs sont responsables de la gestion et de la supervision de l’application. Ils disposent d’un accès privilégié à plusieurs fonctionnalités permettant de maintenir la qualité et la pertinence des contenus. 
Fonctionnalités disponibles pour les administrateurs : 
● Gestion des utilisateurs : création, modification et suppression des comptes utilisateurs et administrateurs. 
● Administration des contenus : mise à jour des pages d’information et des menus. ● Gestion du test de stress : personnalisation des questions et des résultats affichés. 
● Configuration du tracker d’émotions : ajout, modification et suppression des catégories d’émotions disponibles. 
● Gestion des activités de détente : ajout de nouvelles activités, suppression ou modification des propositions existantes. 
● Surveillance et sécurité : accès aux journaux de connexion et aux statistiques d’utilisation pour détecter d’éventuelles anomalies. 
8

Rôle stratégique des administrateurs : 
● Veiller à la conformité des données en assurant le respect du RGPD et en protégeant la confidentialité des utilisateurs. 
● Assurer la pertinence des outils et contenus pour garantir un service toujours adapté aux besoins des utilisateurs. 
● Maintenir un environnement sécurisé en appliquant des mises à jour et en surveillant les risques liés à la cybersécurité. 
Les administrateurs jouent un rôle essentiel dans la pérennité et l’évolution de CESIZen, garantissant une expérience fluide et sécurisée pour tous les utilisateurs. 
4. Fonctionnalités 
4.1 Gestion des comptes 
L’application permet aux utilisateurs de créer un compte afin d’accéder à des fonctionnalités avancées et de sauvegarder leurs données. 
Fonctionnalités associées : 
● Création et authentification des comptes utilisateurs. 
● Modification des informations personnelles. 
● Réinitialisation du mot de passe. 
● Gestion des comptes utilisateurs et administrateurs. 
● Désactivation et suppression de comptes par les administrateurs. 
9

4.2 Tracker d’émotions 
Le tracker d’émotions permet aux utilisateurs connectés de suivre l’évolution de leur état émotionnel et d’identifier des tendances sur différentes périodes. 
Fonctionnalités associées : 
● Ajout, modification et suppression d’entrées dans le journal émotionnel. ● Visualisation de l’historique des émotions enregistrées. 
● Génération de rapports d’émotions sur différentes périodes (semaine, mois, trimestre, année). 
● Configuration des émotions disponibles par les administrateurs. 
4.3 Tests de stress et diagnostics 
L’application propose un questionnaire basé sur l’échelle de Holmes et Rahe afin d’évaluer le niveau de stress des utilisateurs. 
Fonctionnalités associées : 
● Affichage et déroulement du questionnaire de stress. 
● Sauvegarde et consultation des résultats pour les utilisateurs connectés. 
● Configuration des questions et des seuils de stress par les administrateurs. ● Personnalisation des pages de résultats et des recommandations. 
4.4 Exercices de respiration 
Des exercices guidés de respiration et de cohérence cardiaque sont mis à disposition pour aider à la relaxation et à la gestion du stress. 
Fonctionnalités associées : 
● Lancement des exercices de respiration par tous les utilisateurs (connectés ou anonymes). 
● Configuration des exercices (durée d’inspiration, d’expiration, d’apnée) par les administrateurs. 
4.5 Gestion des activités 
L’application propose un catalogue d’activités de détente pour aider les utilisateurs à réduire leur 10

niveau de stress. 
Fonctionnalités associées : 
● Consultation et filtrage des activités disponibles. 
● Accès aux descriptions détaillées des activités. 
● Enregistrement d’activités en favoris pour les utilisateurs connectés. 
● Ajout, modification et suppression des activités par les administrateurs. 
4.6 Administration et gestion des contenus 
Un espace administrateur permet la gestion des utilisateurs, des contenus et des paramètres de l’application. 
Fonctionnalités associées : 
● Gestion des comptes utilisateurs et administrateurs. 
● Modification des contenus des pages d’information et des menus. 
● Configuration des tests de stress et des exercices de respiration. 
● Supervision et ajustement du tracker d’émotions. 
● Gestion des activités de détente disponibles sur la plateforme. 
5. Contraintes et Normes 
5.1 Contraintes techniques 
L’application CESIZen repose sur une architecture moderne garantissant des performances optimales et une bonne maintenabilité. 
Contraintes techniques principales : 
● Technologies utilisées : 
�� Front-end : Next.js avec Tailwind CSS pour un rendu réactif et ergonomique. �� Back-end : API Next.js avec Prisma pour la gestion des données. 
�� Base de données : MySQL ou PostgreSQL pour un stockage structuré et sécurisé. 
11

● Authentification et sécurité : Utilisation de NextAuth avec JSON Web Tokens (JWT) pour sécuriser les accès. 
● Accessibilité et compatibilité : L’application doit être responsive, compatible avec les navigateurs modernes (Chrome, Firefox, Edge, Safari) et conforme aux bonnes pratiques UX/UI. 
● Hébergement et déploiement : L’application sera déployée sur Vercel ou un service cloud adapté, avec une automatisation via CI/CD pour faciliter les mises à jour. 
5.2 Contraintes réglementaires (RGPD, sécurité) 
L’application manipule des données personnelles sensibles, impliquant le respect strict des normes de protection des données. 
Principales exigences réglementaires : 
● Conformité RGPD : 
�� Collecte minimale des données utilisateurs. 
�� Possibilité pour l’utilisateur de consulter, modifier et supprimer ses données. 
�� Hébergement des données sur des serveurs situés en Europe. 
● Sécurisation des données : 
�� Chiffrement des mots de passe et des informations sensibles. 
�� Utilisation du protocole HTTPS pour toutes les communications. 
�� Protection contre les injections SQL et attaques XSS. 
● Confidentialité : 
�� L’application ne partage aucune donnée avec des tiers sans consentement explicite. �� Implémentation d’un protocole de notification en cas de faille de sécurité. 
5.3 Standards de qualité 
Afin d’assurer un produit fiable et performant, CESIZen suit des normes de qualité strictes. Standards appliqués : 
● Code propre et modulaire : Respect des principes SOLID et de l’architecture MVC. 12

● Tests et validation : 
�� Mise en place de tests unitaires et fonctionnels. 
�� Validation de chaque mise à jour via une phase de tests de non-régression. ● Expérience utilisateur (UX/UI) : 
�� Interface fluide et intuitive, pensée pour être accessible au plus grand nombre. 
�� Prise en compte des critères d’accessibilité (RGAA) pour les utilisateurs en situation de handicap. 
● Documentation technique et utilisateur : 
�� Guide d’installation et d’utilisation de l’application. 
�� Documentation des API et des fonctionnalités principales. 
5.4 Contraintes Budgétaire 
Le budget alloué pour le développement de CESIZen est fixé à 75 000€. Il couvre les ressources humaines, l’infrastructure technique, les outils de développement, ainsi que la communication et la formation. 
La répartition des dépenses a été pensée de manière à optimiser les coûts tout en garantissant un produit performant et sécurisé. L’essentiel du budget est consacré aux salaires des développeurs pour assurer un développement robuste, suivi des coûts d’hébergement et d’outils techniques nécessaires au bon fonctionnement de l’application. 
Une marge d’imprévus est également intégrée afin d’anticiper d’éventuels ajustements en cours de projet. Ce budget pourra être réajusté selon les besoins futurs et l’évolution du développement. 
Le tableau ci-dessous détaille la répartition du budget en fonction des différentes catégories de dépenses. 
Catégorie DétailCoût unitaire 
13

Quantité / Durée 
Montant HT (€) 
Montant TTC (€) 
% du 
budget 
�� Ressources Humaines 
Développeurs 
Full-Stack 
UX/UI Designer 
Support & 
Maintenance 
�� Infrastructure & Hébergement 
Hébergement & serveurs 
3 devs expérimentés (React, Next.js, 
Prisma) 
Conception 
maquettes et 
ergonomie 
Corrections et mises à jour 
post-lancement 
Vercel, Supabase, Railway 
3 000 € / 
mois5 mois 45 000 € 54 000 € 60 % 
350 € / 
jour10 jours 3 500 € 4 200 € 4,7 % 
500 € / 
mois5 mois 2 500 € 3 000 € 3,3 % 
500 € / 
mois12 mois 6 000 € 7 200 € 8 % 
Stockage & BackupSauvegarde base de données et fichiers 
�� Outils & 
Licences 
Prisma, NextAuth, 
250 € / 
mois12 mois 3 000 € 3 600 € 4 % Moyenne 
Outils de test & QA 
�� Communication & Marketing 
Postman, 
BrowserStack Création contenu, 
150 € / 
outil 
Campagn 
5 outils 7 500 € 9 000 € 10 % 
Publicité & SEO 
�� Formation & UX Research 
Ads Google & réseaux 
es5 mois 5 000 € 6 000 € 6,7 % 
Études utilisateursAccessibilité & tests d’ergonomie 
�� Coûts ImprévusMarge pour ajustements 

Experts 
en UX2 études 5 000 € 6 000 € 6,7 % 
2 % du 
budget- 1 500 € 1 800 € 2 % 14

5.4 Responsive Design et Mobile First 
L’expérience utilisateur est au cœur du projet CESIZen, et l’accessibilité mobile est une priorité. L’application devra être entièrement fonctionnelle sur mobile, non pas comme une simple adaptation du site desktop, mais avec une approche Mobile First, garantissant une navigation intuitive, fluide et rapide sur smartphone. 
5.1 Approche Mobile First 
L’application est conçue dès le départ pour être optimisée sur les appareils mobiles, en tenant compte des contraintes spécifiques aux petits écrans : 
● Navigation simplifiée : menus accessibles via des boutons adaptés (ex. : icônes burger menu). 
● Affichage optimisé : priorisation des contenus essentiels, suppression des éléments non nécessaires sur mobile. 
● Chargement rapide : optimisation des médias et des scripts pour une consommation minimale de données mobiles. 
15

5.2 Technologies et bonnes pratiques 
Le développement de CESIZen intègre des technologies et des pratiques favorisant un Responsive Design efficace : 
● Utilisation de Flexbox et Grid CSS : permet un agencement fluide et adaptable selon la taille de l’écran. 
● Tailwind CSS : framework facilitant la gestion du Responsive Design avec des classes dédiées (sm:, md:, lg:). 
● Gestion des images dynamiques avec Next.js : réduction de la bande passante consommée (<Image /> pour un chargement optimisé). 
● Animations légères et transition CSS : améliore l’expérience sans alourdir les performances. 
● Désactivation des éléments superflus sur mobile : ajustement des animations et des effets trop lourds pour un affichage mobile fluide. 
5.3 Contraintes spécifiques aux mobiles 
L’application doit répondre aux exigences d’ergonomie propres aux interfaces mobiles : ● Boutons et zones interactives suffisamment larges pour éviter les erreurs de clic. 
● Formulaires optimisés avec clavier adapté (ex. : clavier numérique pour les champs numériques). 
● Accessibilité mobile : compatibilité avec les lecteurs d’écran et options d’agrandissement du texte. 
● Dark Mode et réglages d’accessibilité pour une meilleure lisibilité selon les préférences utilisateur. 
5.4 Tests et validation mobile 
Pour garantir une expérience utilisateur cohérente sur tous les écrans, des tests spécifiques seront réalisés : 
● Test multi-résolutions avec Chrome DevTools et des outils comme BrowserStack. ● Tests UX sur mobile avec des utilisateurs pour valider l’ergonomie. 
● Audit Lighthouse pour vérifier la performance et l’accessibilité. 
16


6. Risques et Mesures d’Atténuation 
6.1 Sécurité des données 
La manipulation de données personnelles implique des risques de cyberattaques et de violations de la confidentialité. 
Risques identifiés : 
● Attaques par injection SQL, XSS ou CSRF. 
● Vol de données en cas de faille de sécurité. 
● Perte de données due à une panne serveur ou un bug critique. 
Mesures d’atténuation : 
● Utilisation de NextAuth avec JWT pour sécuriser l’authentification. 
● Chiffrement des données sensibles (mots de passe, informations utilisateurs). ● Utilisation de HTTPS et d’une politique stricte de gestion des accès. 
● Mise en place de sauvegardes régulières et de plans de récupération en cas de panne. 
6.2 Conformité et accessibilité 
L’application doit être conforme aux réglementations en vigueur et accessible à tous les utilisateurs. Risques identifiés : 
● Non-conformité avec le RGPD pouvant entraîner des sanctions. 
● Interface utilisateur non adaptée aux personnes en situation de handicap. Mesures d’atténuation : 
● Application des principes du RGPD : consentement des utilisateurs, droit à l’oubli, accès aux données personnelles. 
● Conformité avec le RGAA pour garantir une accessibilité aux utilisateurs en situation de handicap. 
● Audit régulier des pratiques de gestion des données et de l’ergonomie de l’interface. 
17

6.3 Adoption par les utilisateurs 
L’engagement des utilisateurs est essentiel pour le succès de l’application. 
Risques identifiés : 
● Faible taux d’adoption dû à une interface peu intuitive ou un manque de contenu. ● Abandon des utilisateurs après une courte période d’utilisation. 
Mesures d’atténuation : 
● Interface pensée pour être ergonomique et intuitive. 
● Contenus pédagogiques et interactifs pour sensibiliser les utilisateurs à la gestion du stress. ● Collecte des retours des utilisateurs et mises à jour régulières pour améliorer l’expérience. 
18

6.4 Gestion des Données Personnelles et Conformité RGPD 
L’application CESIZen traite des données sensibles liées aux utilisateurs, notamment leur informations personnelles et leurs résultats de test de stress. Pour assurer la conformité avec le RGPD, nous avons mis en place plusieurs mesures de protection des données et de gestion des risques. 
19

7. Cahier des Charges Techniques 
7.1 Technologies utilisées 
Le choix des technologies utilisées pour CESIZen repose sur des critères de performance, évolutivité, sécurité et accessibilité. L’application suit une architecture moderne, modulaire et optimisée pour le web, garantissant une expérience utilisateur fluide tout en assurant la confidentialité des données. 
7.1.1 Technologies du Front-End 
Le Front-End repose sur Next.js, un framework React permettant une rendu serveur (SSR) et génération statique (SSG) pour optimiser la rapidité et le référencement naturel (SEO). 
● Framework : Next.js 14 (avec App Router pour une meilleure gestion des pages et des API). 
● Langage principal : TypeScript, garantissant une meilleure détection des erreurs et une maintenabilité accrue. 
● Styling : 
�� Tailwind CSS pour une conception rapide et fluide de l’interface. 
�� CSS Modules pour les styles spécifiques aux composants. 
● State Management : Utilisation du Context API et de Zustand pour gérer les états de l’application de manière performante. 
�� Pourquoi ce choix ? 
Next.js permet un chargement rapide des pages grâce à la gestion dynamique des routes. Tailwind CSS réduit la taille des fichiers CSS et améliore les performances. 
TypeScript offre une meilleure détection des erreurs et sécurité du code. 

7.1.2 Technologies du Back-End 
Le Back-End est conçu pour être scalable, sécurisé et optimisé pour des échanges rapides de données. 
● Framework : API Routes de Next.js, permettant une gestion efficace des appels API sans serveur dédié. 
● Base de données : PostgreSQL avec Prisma ORM, assurant une manipulation simplifiée et sécurisée 20
des données. 
● Gestion des requêtes API : 
�� RESTful API pour l’interaction avec le Front-End. 
�� Protection avec middleware d’authentification et validation des entrées utilisateurs. ● Sécurité : 
�� NextAuth pour la gestion des sessions et JWT pour sécuriser les accès. 
�� Bcrypt pour le hachage des mots de passe. 
�� Helmet.js pour ajouter des protections contre les attaques web (XSS, CSRF). 
Pourquoi ce choix ? 
Next.js API Routes simplifie la gestion Back-End sans nécessiter de serveur externe. PostgreSQL est robuste, sécurisé et performant pour le traitement de données complexes. NextAuth + JWT garantit une authentification sécurisée et scalable. 

7.1.3 Hébergement et Déploiement 
L’application doit être hautement disponible et capable de supporter un grand nombre d’utilisateurs sans perte de performances. 
● Déploiement via Vercel, qui offre un hébergement optimisé pour Next.js et une intégration CI/CD native. 
● Base de données hébergée sur Railway ou Supabase, offrant des performances optimales avec une scalabilité automatique. 
● Stockage sécurisé des fichiers sur un bucket S3 ou une alternative comme Firebase Storage. 
● Gestion du versioning avec GitHub Actions, permettant un suivi des mises à jour et des corrections de bugs en continu. 
Pourquoi ce choix ? 
Vercel offre un déploiement en quelques secondes avec CI/CD intégré. 
Railway/Supabase garantissent un hébergement fiable et sécurisé des bases de données. GitHub Actions facilite l’automatisation des tests et des mises à jour. 
21
7.2 Architecture logicielle 
L’application suit une architecture modulaire basée sur le design pattern MVC (Model-View-Controller). 
7.2.1 Organisation du projet 
Le projet est structuré en plusieurs modules permettant une clarté du code et une maintenance efficace : 
/app/ – Gestion des pages et des API Routes (Next.js 14). 
/components/ – Composants réutilisables pour la mise en page. 
/lib/ – Fonctions utilitaires (authentification, base de données). 
/prisma/ – Schéma et migrations de la base de données. 
/public/ – Ressources statiques (logos, images, icônes). 
/styles/ – Feuilles de style globales et modules CSS. 
7.2.2 Principe de fonctionnement 
● Le Front-End envoie des requêtes API aux routes définies dans Next.js API Routes. 
● Le Back-End gère l’authentification, interroge la base de données via Prisma et renvoie les informations demandées. 
● Les réponses sont optimisées via la gestion des caches pour limiter les appels API inutiles et accélérer le rendu des pages. 
Pourquoi ce choix ? 
Une séparation claire entre la logique métier et l’affichage. 
Une meilleure organisation du projet facilitant la scalabilité. 
Des performances accrues grâce au cache et aux API optimisées. 

7.3 Base de données 
La base de données est un élément central du projet, structurant les différentes informations nécessaires au fonctionnement de CESIZen. 
Modèle conceptuel des données (MCD) 
La base est modélisée selon une approche relationnelle, avec des tables interconnectées : ● Utilisateur : stocke les informations personnelles et les préférences. 
● Sessions : gère les connexions et permissions des utilisateurs. 
● Émotions : enregistre les entrées du tracker d’émotions. 
● Tests de stress : stocke les réponses et les résultats des diagnostics. 
22
● Activités : référence les activités bien-être disponibles. 
● Paramètres administratifs : stocke les configurations et modifications des administrateurs. 
Sécurisation des données 
La sécurité des données est une priorité absolue. Plusieurs niveaux de protection sont mis en place : 1. Chiffrement des données sensibles (mots de passe avec bcrypt, données utilisateurs). 2. Protocole HTTPS obligatoire pour toutes les communications. 
3. Rôles et permissions strictes : 
�� Un utilisateur ne peut accéder qu’à ses propres données. 
�� Les administrateurs ont un accès restreint aux configurations critiques. 
4. Sauvegardes automatiques et monitoring des requêtes pour éviter toute perte d’information. 
Pourquoi ce choix ? 
Protection optimale des données personnelles. 
Sécurisation des accès avec une gestion granulaire des permissions. 
Prévention des failles de sécurité grâce à des audits réguliers 
23
Diagramme d’architecture 
24
8. Déploiement et Maintenance 
8.1 Plan de déploiement 
Le déploiement de l’application CESIZen repose sur une approche automatisée et sécurisée pour garantir une mise en production fiable et fluide. 
Environnements de déploiement : 
● Développement : environnement local utilisé pour le codage et les tests unitaires. 
● Préproduction : version intermédiaire permettant de valider les nouvelles fonctionnalités avant leur mise en production. 
● Production : version finale accessible aux utilisateurs. 
Méthodologie de déploiement : 
● Utilisation de Vercel pour un déploiement automatisé et scalable. 
● Intégration continue (CI/CD) avec des tests automatisés pour éviter les régressions. 
● Versioning du code via Git pour assurer un suivi des mises à jour et une gestion efficace des correctifs. 
8.2 Maintenance corrective et évolutive 
L’application doit être maintenue régulièrement pour assurer sa stabilité et son évolution en fonction des besoins des utilisateurs. 
Maintenance corrective 
● Surveillance des logs d’erreurs et détection des bugs via un outil de monitoring. ● Correction rapide des incidents bloquants et critiques. 
● Application de mises à jour de sécurité pour protéger les données utilisateurs. Maintenance évolutive 
● Ajout progressif de nouvelles fonctionnalités en fonction des retours des utilisateurs. ● Amélioration continue de l’ergonomie et de l’expérience utilisateur. 
● Veille technologique pour assurer la compatibilité avec les nouvelles versions des outils utilisés (Next.js, Prisma, NextAuth, etc.).
8.3 Planification des Ressources humaines 

Ce graphique illustre la répartition des jours-hommes pour chaque rôle au sein de l’équipe sur les 8 mois de développement du projet CESIZen. Bien que nous soyons une équipe restreinte de trois développeurs, notre approche agile permet à chacun d’assumer plusieurs responsabilités en fonction des besoins du projet. 
Flexibilité des rôles : 
● Le chef de projet (bleu) ne se limite pas à la gestion, il contribue également à l’analyse et au développement. 
● Le développeur back-end (rouge) peut intervenir ponctuellement sur le front-end si 
nécessaire. 
● Le développeur front-end (jaune) participe aussi aux décisions techniques globales. 
Montée en charge progressive : 
● La charge de travail est plus intense en milieu de projet (mois 2 à 6), période clé du 
développement. 
● La phase de tests et validation (vert) prend de l’ampleur en fin de projet pour assurer la qualité du produit avant la mise en production. 
Grâce à cette polyvalence et coordination agile, nous maximisons l’efficacité avec un budget optimisé, tout en garantissant une répartition équilibrée des efforts. 
26
9. Livrables 
9.1 Documentation projet 
Un ensemble de documents sera fourni afin d’assurer la compréhension et la bonne gestion du projet CESIZen. 
Livrables attendus : 
● Cahier des charges détaillant le contexte, les objectifs et les fonctionnalités du projet. 
● Spécifications techniques et fonctionnelles, incluant l’architecture logicielle, la structuration des données et les règles de gestion. 
● Diagrammes UML pour visualiser les cas d'utilisation, les interactions et la structure de l’application. 
9.2 Code source et manuel d’installation 
L’ensemble du code sera mis à disposition avec une documentation technique permettant son installation et sa maintenance. 
Livrables : 
● Dépôt Git contenant le code source versionné. 
● Guide d’installation expliquant la mise en place de l’environnement de développement et de production. 
● Instructions pour les mises à jour et le déploiement via CI/CD. 
9.3 Cahier de tests et validation 
Un document décrivant les scénarios de tests et les résultats obtenus sera fourni pour garantir la qualité et la conformité du projet. 
Contenu du cahier de tests : 
● Tests unitaires : validation des fonctionnalités de chaque module. 
● Tests fonctionnels : vérification du bon déroulement des actions utilisateur. ● Tests de non-régression : contrôle après chaque mise à jour pour éviter les régressions. 
27
● Procédure de validation et critères d’acceptation du projet. 28
● 10. Annexes 
10.1 Diagrammes UML 
29
30
31
32
33
34
35
36
37
10.2 Modèle conceptuel de données 
38
Modèle conceptuelle de données V2 
39
Diagrammed’action 
40
Diagrammedeclasse 
41