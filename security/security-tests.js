#!/usr/bin/env node

/**
 * 🧪 Suite de Tests de Sécurité - CESIZen
 * Tests automatisés pour valider toutes les défenses de sécurité
 * 
 * 🎯 OBJECTIF : Vérifier que l'application résiste aux attaques courantes
 * 
 * 📚 CONCEPTS DE CYBERSÉCURITÉ TESTÉS :
 * 1. Brute Force Attack : Tentatives répétées de connexion pour deviner un mot de passe
 * 2. Rate Limiting : Limitation du nombre de requêtes pour éviter la surcharge
 * 3. SQL Injection : Injection de code SQL malveillant dans les formulaires
 * 4. XSS (Cross-Site Scripting) : Injection de code JavaScript malveillant
 * 5. Security Headers : En-têtes HTTP qui protègent contre diverses attaques
 */

import fetch from 'node-fetch';

class SecurityTester {
    constructor(baseUrl = 'http://localhost:3000') {
        this.baseUrl = baseUrl;
        // 📊 Compteurs de résultats pour chaque type de test
        this.results = {
            bruteForce: { passed: 0, failed: 0 },    // Protection contre les attaques par force brute
            rateLimit: { passed: 0, failed: 0 },     // Limitation du taux de requêtes
            sqlInjection: { passed: 0, failed: 0 },  // Protection contre l'injection SQL
            xss: { passed: 0, failed: 0 },           // Protection contre les attaques XSS
            headers: { passed: 0, failed: 0 }        // Présence des en-têtes de sécurité
        };
    }

    // 🎨 Fonction pour afficher des messages colorés dans le terminal
    log(message, type = 'info') {
        const colors = {
            info: '\x1b[36m',    // Cyan - Information
            success: '\x1b[32m', // Vert - Succès
            error: '\x1b[31m',   // Rouge - Erreur
            warning: '\x1b[33m', // Jaune - Avertissement
            reset: '\x1b[0m'     // Reset - Couleur normale
        };
        console.log(`${colors[type]}${message}${colors.reset}`);
    }

    // ⏳ Fonction utilitaire pour attendre (éviter de surcharger le serveur)
    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }    // 🔧 Test de Connectivité
    /**
     * 🎯 OBJECTIF : Vérifier que l'application est accessible avant de lancer les tests de sécurité
     * 
     * 💡 POURQUOI ? Si l'application n'est pas accessible, tous les autres tests échoueront
     * Il est important de vérifier d'abord que le serveur répond normalement
     */
    async testConnectivity() {
        this.log('\n🔧 Testing Connectivity...', 'info');
        
        try {
            // Tentative de connexion à l'endpoint de test
            const response = await fetch(`${this.baseUrl}/api/test`);
            if (response.ok) {
                this.log('✅ Application accessible', 'success');
                return true;
            } else {
                this.log(`❌ Application non accessible (${response.status})`, 'error');
                return false;
            }
        } catch (error) {
            this.log(`❌ Erreur de connexion: ${error.message}`, 'error');
            this.log('💡 Assurez-vous que l\'application est démarrée avec: npm run dev', 'warning');
            return false;
        }
    }    // 🥊 Test Protection Brute Force
    /**
     * 🎯 QU'EST-CE QU'UNE ATTAQUE BRUTE FORCE ?
     * Une attaque par force brute consiste à essayer de nombreuses combinaisons
     * de mots de passe jusqu'à trouver le bon. C'est comme essayer toutes les clés
     * d'un trousseau jusqu'à trouver celle qui ouvre la porte.
     * 
     * 🛡️ COMMENT SE DÉFENDRE ?
     * - Limiter le nombre de tentatives de connexion par IP/utilisateur
     * - Augmenter le délai entre les tentatives (ralentissement progressif)
     * - Bloquer temporairement ou définitivement après X échecs
     * - Utiliser des CAPTCHA après plusieurs échecs
     * 
     * 🧪 COMMENT ON TESTE ?
     * On simule plusieurs tentatives de connexion échouées rapidement.
     * Si l'application nous bloque (erreur 429), c'est bon signe !
     */
    async testBruteForceProtection() {
        this.log('\n🥊 Testing Brute Force Protection...', 'info');
          try {
            let blocked = false;
            
            // 🔄 SIMULATION D'ATTAQUE : On va essayer 7 fois de s'inscrire avec des données malveillantes
            // Dans un vrai scénario, un attaquant essaierait des milliers de combinaisons
            for (let i = 1; i <= 7; i++) {
                // 💡 ASTUCE : On utilise des données contenant de l'injection SQL pour forcer des échecs
                // Cela simule un attaquant qui essaie de contourner la sécurité
                const response = await fetch(`${this.baseUrl}/api/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: `malicious${i}' OR '1'='1@example.com`, // ⚠️ Injection SQL volontaire pour déclencher des échecs
                        name: 'Test User',
                        password: 'password123'
                    })
                });

                this.log(`  Tentative ${i}: ${response.status}`, 'info');

                // 🛑 PROTECTION DÉTECTÉE : Code 429 = "Too Many Requests"
                // C'est le signal que notre protection anti-brute force fonctionne !
                if (response.status === 429) {
                    blocked = true;
                    this.log(`✅ Brute force bloqué après ${i} tentatives`, 'success');
                    this.results.bruteForce.passed++;
                    break;
                }
                
                await this.sleep(500); // ⏱️ Pause courte pour accumuler les échecs rapidement
            }

            if (!blocked) {
                this.log(`❌ Brute force non bloqué après 7 tentatives`, 'error');
                this.results.bruteForce.failed++;
            }

        } catch (error) {
            this.results.bruteForce.failed++;
            this.log(`❌ Erreur test brute force: ${error.message}`, 'error');
        }
    }    // 🚦 Test Rate Limiting
    /**
     * 🎯 QU'EST-CE QUE LE RATE LIMITING ?
     * Le "rate limiting" limite le nombre de requêtes qu'un utilisateur peut faire
     * dans un certain laps de temps. C'est comme un vigile qui dit "une personne
     * à la fois" ou "pas plus de 10 entrées par minute".
     * 
     * 🛡️ POURQUOI C'EST IMPORTANT ?
     * - Empêche la surcharge du serveur (DoS - Denial of Service)
     * - Limite les tentatives d'attaque automatisées
     * - Protège contre le scraping abusif de données
     * - Améliore l'expérience utilisateur en évitant les ralentissements
     * 
     * 🧪 COMMENT ON TESTE ?
     * On envoie plein de requêtes très rapidement (50 d'un coup).
     * Si certaines sont bloquées (429), la protection fonctionne !
     */
    async testRateLimit() {
        this.log('\n🚦 Testing Rate Limiting...', 'info');
          try {
            const requests = [];
            const maxRequests = 50; // 🔥 ATTAQUE SIMULÉE : 50 requêtes simultanées

            this.log(`  Envoi de ${maxRequests} requêtes simultanées...`, 'info');

            // 🚀 BOMBARDEMENT : On lance toutes les requêtes en même temps
            // Un vrai attaquant DDoS ferait cela avec des milliers de requêtes
            for (let i = 0; i < maxRequests; i++) {
                requests.push(
                    fetch(`${this.baseUrl}/api/test?req=${i}`)
                        .then(response => response.status)
                        .catch(() => 'error')
                );
            }

            // ⏳ ATTENTE DES RÉSULTATS : On attend que toutes les requêtes se terminent
            const responses = await Promise.all(requests);
            const blockedCount = responses.filter(status => status === 429).length; // 🛑 Requêtes bloquées
            const successCount = responses.filter(status => status === 200).length; // ✅ Requêtes réussies

            this.log(`  Résultats: ${successCount} OK, ${blockedCount} bloquées`, 'info');

            // 🎯 ANALYSE : Si des requêtes sont bloquées, notre rate limiter fonctionne !
            if (blockedCount > 0) {
                this.results.rateLimit.passed++;
                this.log(`✅ Rate limiting actif: ${blockedCount} requêtes bloquées`, 'success');
            } else {
                this.results.rateLimit.failed++;
                this.log(`⚠️ Rate limiting: Aucune requête bloquée - Possible problème !`, 'warning');
            }

        } catch (error) {
            this.results.rateLimit.failed++;
            this.log(`❌ Erreur test rate limit: ${error.message}`, 'error');
        }
    }    // 💉 Test SQL Injection
    /**
     * 🎯 QU'EST-CE QU'UNE INJECTION SQL ?
     * L'injection SQL consiste à insérer du code SQL malveillant dans les champs
     * de saisie d'une application. C'est comme glisser une fausse instruction
     * dans un formulaire pour tromper la base de données.
     * 
     * 🔥 EXEMPLES D'ATTAQUES :
     * - "admin'--" : Se connecter en tant qu'admin sans mot de passe
     * - "'; DROP TABLE users; --" : Supprimer toute la table des utilisateurs !
     * - "' OR '1'='1" : Contourner l'authentification (toujours vrai)
     * 
     * 🛡️ COMMENT SE DÉFENDRE ?
     * - Utiliser des requêtes préparées (prepared statements)
     * - Valider et nettoyer les entrées utilisateur
     * - Échapper les caractères spéciaux SQL
     * - Utiliser un ORM qui gère automatiquement ces protections
     * 
     * 🧪 COMMENT ON TESTE ?
     * On envoie des payloads SQL malveillants dans les paramètres.
     * Si l'app renvoie une erreur 400 (Bad Request), elle détecte l'attaque !
     */
    async testSQLInjection() {
        this.log('\n💉 Testing SQL Injection Protection...', 'info');
          // 🔫 ARSENAL D'ATTAQUE : Collection de payloads SQL dangereux
        const sqlPayloads = [
            "' OR '1'='1",              // 🎯 Contournement d'authentification (toujours vrai)
            "'; DROP TABLE users; --",   // 💥 Destruction de données (supprime la table)
            "' UNION SELECT * FROM users --", // 🕵️ Vol de données (récupère tous les utilisateurs)
            "admin'--"                   // 🚪 Connexion sans mot de passe (ignore le reste)
        ];

        let blockedCount = 0;
        let totalTests = sqlPayloads.length;

        // 🎭 SIMULATION D'ATTAQUE : On teste chaque payload un par un
        for (const payload of sqlPayloads) {
            try {
                // 📤 INJECTION : On glisse le code SQL malveillant dans un paramètre
                const response = await fetch(`${this.baseUrl}/api/test?search=${encodeURIComponent(payload)}`);

                // 🛡️ DÉFENSE DÉTECTÉE : Code 400 = "Bad Request" = Attaque bloquée !
                if (response.status === 400) {
                    blockedCount++;
                    this.log(`  ✅ Bloqué: ${payload}`, 'success');
                } else {
                    // 🚨 VULNÉRABILITÉ : L'attaque n'a pas été détectée !
                    this.log(`  ❌ Non bloqué: ${payload} (${response.status})`, 'error');
                }

                await this.sleep(100); // ⏱️ Petite pause entre les attaques

            } catch (error) {
                this.log(`  ❌ Erreur: ${payload} - ${error.message}`, 'error');
            }
        }

        if (blockedCount > 0) {
            this.results.sqlInjection.passed++;
            this.log(`✅ Protection SQL: ${blockedCount}/${totalTests} bloqués`, 'success');
        } else {
            this.results.sqlInjection.failed++;
            this.log(`❌ Protection SQL: Aucun payload bloqué`, 'error');
        }
    }    // 🛡️ Test XSS Protection
    /**
     * 🎯 QU'EST-CE QU'UNE ATTAQUE XSS ?
     * XSS (Cross-Site Scripting) consiste à injecter du code JavaScript malveillant
     * dans une page web. C'est comme cacher un piège dans un commentaire qui se
     * déclenche quand quelqu'un d'autre lit ce commentaire.
     * 
     * 🔥 EXEMPLES D'ATTAQUES :
     * - "<script>alert('XSS')</script>" : Pop-up d'alerte (test basique)
     * - "<img src=x onerror=alert('XSS')>" : Exécution via une image cassée
     * - "javascript:alert('XSS')" : Exécution via un lien malveillant
     * 
     * 🚨 POURQUOI C'EST DANGEREUX ?
     * - Vol de cookies et session utilisateur
     * - Redirection vers des sites malveillants
     * - Modification du contenu de la page
     * - Keylogging (enregistrement des touches tapées)
     * 
     * 🛡️ COMMENT SE DÉFENDRE ?
     * - Échapper/encoder tous les caractères spéciaux HTML
     * - Valider et nettoyer les entrées utilisateur
     * - Utiliser Content Security Policy (CSP)
     * - Ne jamais faire confiance aux données utilisateur
     * 
     * 🧪 COMMENT ON TESTE ?
     * On envoie du code JavaScript dans les champs de saisie.
     * Si l'app renvoie 400, elle détecte et bloque l'attaque !
     */
    async testXSSProtection() {
        this.log('\n🛡️ Testing XSS Protection...', 'info');
          // 🧨 ARSENAL XSS : Collection de scripts malveillants
        const xssPayloads = [
            "<script>alert('XSS')</script>",        // 🎯 Script classique (le plus courant)
            "<img src=x onerror=alert('XSS')>",     // 🖼️ Attaque via image cassée
            "javascript:alert('XSS')"               // 🔗 Attaque via URL JavaScript
        ];

        let blockedCount = 0;
        let totalTests = xssPayloads.length;

        // 🎭 SIMULATION D'ATTAQUE : Test de chaque payload XSS
        for (const payload of xssPayloads) {
            try {
                // 📝 INJECTION : On glisse le script dans un champ de commentaire
                // Dans un vrai site, cela pourrait être un commentaire, un nom d'utilisateur, etc.
                const response = await fetch(`${this.baseUrl}/api/test`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment: payload }) // 💣 Le script malveillant est ici
                });

                // 🛡️ DÉFENSE DÉTECTÉE : Code 400 = Script malveillant détecté !
                if (response.status === 400) {
                    blockedCount++;
                    this.log(`  ✅ Bloqué: ${payload.substring(0, 30)}...`, 'success');
                } else {
                    // 🚨 VULNÉRABILITÉ : Le script n'a pas été détecté !
                    this.log(`  ❌ Non bloqué: ${payload.substring(0, 30)}... (${response.status})`, 'error');
                }

                await this.sleep(100); // ⏱️ Pause entre les tentatives

            } catch (error) {
                this.log(`  ❌ Erreur XSS: ${error.message}`, 'error');
            }
        }

        if (blockedCount > 0) {
            this.results.xss.passed++;
            this.log(`✅ Protection XSS: ${blockedCount}/${totalTests} bloqués`, 'success');
        } else {
            this.results.xss.failed++;
            this.log(`❌ Protection XSS: Aucun script bloqué`, 'error');
        }
    }    // 🔒 Test Security Headers
    /**
     * 🎯 QUE SONT LES HEADERS DE SÉCURITÉ ?
     * Les headers de sécurité sont des instructions envoyées par le serveur au navigateur
     * pour lui dire comment se comporter de manière sécurisée. C'est comme donner des
     * règles de sécurité à un garde du corps.
     * 
     * 🛡️ HEADERS IMPORTANTS :
     * 
     * 🖼️ X-Frame-Options : Empêche l'intégration dans des iframes malveillantes
     *    - Protège contre le "clickjacking" (piéger les clics utilisateur)
     *    - Valeurs : DENY, SAMEORIGIN, ALLOW-FROM
     * 
     * 🎭 X-Content-Type-Options : Force le navigateur à respecter le type de fichier
     *    - Empêche les attaques de "MIME sniffing"
     *    - Valeur : nosniff
     * 
     * ⚔️ X-XSS-Protection : Active la protection XSS intégrée du navigateur
     *    - Protection supplémentaire contre les attaques XSS
     *    - Valeurs : 1; mode=block (recommandé)
     * 
     * 🧪 COMMENT ON TESTE ?
     * On vérifie que la réponse du serveur contient ces headers.
     * Leur présence indique une configuration sécurisée !
     */
    async testSecurityHeaders() {
        this.log('\n🔒 Testing Security Headers...', 'info');
          // 🔍 HEADERS À VÉRIFIER : Liste des protections essentielles
        const requiredHeaders = [
            'x-frame-options',        // 🖼️ Protection anti-clickjacking
            'x-content-type-options', // 🎭 Protection contre MIME sniffing  
            'x-xss-protection'        // ⚔️ Protection XSS du navigateur
        ];

        try {
            // 📡 REQUÊTE DE TEST : On demande une page pour analyser ses headers
            const response = await fetch(`${this.baseUrl}/api/test`);
            let foundHeaders = 0;
            
            // 🔍 INSPECTION : On vérifie la présence de chaque header de sécurité
            for (const header of requiredHeaders) {
                const headerValue = response.headers.get(header);
                if (headerValue) {
                    foundHeaders++;
                    this.log(`  ✅ ${header}: ${headerValue}`, 'success');
                } else {
                    // 🚨 HEADER MANQUANT : Potentiel problème de sécurité
                    this.log(`  ❌ Manquant: ${header}`, 'error');
                }
            }

            // 📊 ÉVALUATION : Plus on a de headers, mieux c'est protégé
            if (foundHeaders > 0) {
                this.results.headers.passed++;
                this.log(`✅ Headers: ${foundHeaders}/${requiredHeaders.length} présents`, 'success');
            } else {
                this.results.headers.failed++;
                this.log(`❌ Headers: Aucun header de sécurité trouvé`, 'error');
            }

        } catch (error) {
            this.results.headers.failed++;
            this.log(`❌ Erreur test headers: ${error.message}`, 'error');
        }
    }    // 📊 Génération du Rapport Final
    /**
     * 🎯 ANALYSE DES RÉSULTATS
     * Cette fonction compile tous les résultats des tests de sécurité
     * et génère un rapport final facile à comprendre.
     * 
     * 📈 MÉTRIQUES ANALYSÉES :
     * - Nombre de protections actives vs inactives
     * - Taux de réussite global (pourcentage)
     * - Recommandations basées sur les résultats
     * 
     * 🎨 CODES COULEUR :
     * - ✅ Vert : Protection active (bon)
     * - ❌ Rouge : Protection inactive (mauvais)
     * - ⚠️ Jaune : Avertissement (à surveiller)
     * 
     * 🏆 NIVEAUX DE SÉCURITÉ :
     * - 90%+ : Excellente sécurité 🛡️
     * - 70-89% : Bonne sécurité ✅
     * - 50-69% : Améliorations nécessaires ⚠️
     * - <50% : Problèmes critiques 🚨
     */
    generateReport() {
        this.log('\n📊 RAPPORT DE SÉCURITÉ', 'info');
        this.log('='.repeat(50), 'info');        let totalPassed = 0;
        let totalFailed = 0;

        // 📋 DÉTAIL PAR CATÉGORIE : Analyse de chaque type de protection
        for (const [category, results] of Object.entries(this.results)) {
            totalPassed += results.passed;
            totalFailed += results.failed;
            
            // 🏷️ NOMS LISIBLES : Conversion des clés techniques en noms compréhensibles
            const categoryName = {
                bruteForce: 'Brute Force',      // 🥊 Protection contre les attaques par force brute
                rateLimit: 'Rate Limiting',     // 🚦 Limitation du taux de requêtes
                sqlInjection: 'SQL Injection',  // 💉 Protection contre l'injection SQL
                xss: 'XSS Protection',          // 🛡️ Protection contre les attaques XSS
                headers: 'Security Headers'     // 🔒 Headers de sécurité HTTP
            }[category];

            // 🎯 STATUT : Vert si au moins une protection fonctionne, rouge sinon
            const status = results.passed > 0 ? '✅' : '❌';
            this.log(`${status} ${categoryName}: ${results.passed} OK, ${results.failed} KO`, 
                     results.passed > 0 ? 'success' : 'error');
        }

        // 🧮 CALCULS : Pourcentage de réussite global
        const totalTests = totalPassed + totalFailed;
        const successRate = totalTests > 0 ? ((totalPassed / totalTests) * 100).toFixed(1) : '0.0';

        this.log('\n🎯 RÉSUMÉ GLOBAL:', 'info');
        this.log(`Total: ${totalTests} tests`, 'info');
        this.log(`Taux de réussite: ${successRate}%`, successRate >= 80 ? 'success' : 'warning');

        // 🏆 ÉVALUATION FINALE : Attribution d'un niveau de sécurité
        if (successRate >= 90) {
            this.log('\n🛡️ SÉCURITÉ EXCELLENTE!', 'success');
            this.log('   Toutes les protections principales sont actives.', 'success');
        } else if (successRate >= 70) {
            this.log('\n✅ BONNE SÉCURITÉ', 'success');
            this.log('   La plupart des protections sont en place.', 'success');
        } else if (successRate >= 50) {
            this.log('\n⚠️ AMÉLIORATIONS NÉCESSAIRES', 'warning');
            this.log('   Certaines protections importantes manquent.', 'warning');
        } else {
            this.log('\n🚨 PROBLÈMES CRITIQUES', 'error');
            this.log('   Plusieurs vulnérabilités détectées !', 'error');
        }        this.log('\n💡 Pour plus de détails, consultez QUICK_TEST_GUIDE.md', 'info');
        this.log('\n📚 RESSOURCES PÉDAGOGIQUES :', 'info');
        this.log('   - OWASP Top 10 : https://owasp.org/www-project-top-ten/', 'info');
        this.log('   - Guide Sécurité Web : https://web.dev/security/', 'info');
        this.log('   - Tests Manuels : ./security-test.ps1 ou ./manual-security-tests.sh', 'info');
    }    // 🚀 Exécution de tous les tests
    /**
     * 🎯 ORCHESTRATEUR PRINCIPAL
     * Cette fonction coordonne l'exécution de tous les tests de sécurité
     * dans un ordre optimisé pour éviter les interférences.
     * 
     * � ORDRE D'EXÉCUTION (IMPORTANT !) :
     * 1. 🔧 Connectivité : Vérifier que l'app fonctionne
     * 2. 💉 SQL Injection : Tests rapides, pas d'interférence
     * 3. 🛡️ XSS Protection : Tests rapides, pas d'interférence  
     * 4. 🔒 Security Headers : Test simple, pas d'interférence
     * 5. 🥊 Brute Force : Peut déclencher des blocages
     * 6. 🚦 Rate Limiting : Doit être testé en dernier (génère beaucoup de trafic)
     * 
     * ⏱️ PAUSES STRATÉGIQUES :
     * Des pauses entre les tests évitent que les protections d'un test
     * interfèrent avec les suivants (ex: rate limiting qui bloque les autres tests).
     */
    async runAllTests() {
        this.log('🧪 TESTS DE SÉCURITÉ CESIZEN', 'info');
        this.log(`🎯 Endpoint: ${this.baseUrl}`, 'info');
        this.log('━'.repeat(50), 'info');
          try {
            // 🔧 ÉTAPE 1 : Test de connectivité (priorité absolue)
            const isConnected = await this.testConnectivity();
            if (!isConnected) {
                this.log('\n🚨 Impossible de continuer sans connexion à l\'application', 'error');
                this.log('💡 Vérifiez que l\'application est démarrée avec: npm run dev', 'warning');
                return;
            }

            // 💉 ÉTAPE 2 : Tests d'injection SQL (rapides, sans interférence)
            await this.testSQLInjection();
            await this.sleep(500); // ⏱️ Pause courte

            // 🛡️ ÉTAPE 3 : Tests de protection XSS (rapides, sans interférence)
            await this.testXSSProtection();
            await this.sleep(500); // ⏱️ Pause courte

            // 🔒 ÉTAPE 4 : Tests des headers de sécurité (simple, sans interférence)
            await this.testSecurityHeaders();
            await this.sleep(1000); // ⏱️ Pause moyenne avant les tests plus lourds

            // 🥊 ÉTAPE 5 : Tests de protection brute force (peut déclencher des blocages)
            await this.testBruteForceProtection();
            await this.sleep(2000); // ⏱️ Pause longue pour laisser les blocages se résorber

            // 🚦 ÉTAPE 6 : Tests de rate limiting (en dernier car génère beaucoup de trafic)
            await this.testRateLimit();

            // 📊 ÉTAPE 7 : Génération du rapport final
            this.generateReport();        } catch (error) {
            this.log(`🚨 Erreur critique: ${error.message}`, 'error');
            this.log('💡 Conseil : Vérifiez que l\'application fonctionne correctement', 'warning');
        }
    }
}

// 🎬 POINT D'ENTRÉE : Lancement automatique des tests
/**
 * 🚀 DÉMARRAGE DU SCRIPT
 * 
 * Cette section lance automatiquement tous les tests quand le script est exécuté.
 * Vous pouvez aussi utiliser ce script de manière programmatique :
 * 
 * ```javascript
 * import { SecurityTester } from './security-tests.js';
 * const tester = new SecurityTester('http://localhost:3000');
 * await tester.runAllTests();
 * ```
 * 
 * 📝 COMMANDES POUR LANCER LES TESTS :
 * - `npm run security-test` (recommandé)
 * - `node security/security-tests.js`
 * - `./security/security-test.ps1` (Windows PowerShell)
 * - `./security/manual-security-tests.sh` (Linux/Mac)
 */
console.log('🔬 Initialisation des tests de sécurité...');
const tester = new SecurityTester();
tester.runAllTests().catch(error => {
    console.error('❌ Erreur lors de l\'exécution des tests:', error);
    process.exit(1);
});
