# Installation et conversion du plan de maintenance

## Installation des dépendances

Avant d'exécuter le script de conversion, installez les dépendances nécessaires :

```bash
pip install python-docx markdown
```

## Utilisation

1. Assurez-vous que le fichier `plan_maintenance_cesizen.md` est dans le même répertoire que le script
2. Exécutez le script de conversion :

```bash
python convert_md_to_docx.py
```

3. Le fichier `Plan_Maintenance_Cesizen.docx` sera créé dans le même répertoire

## Fonctionnalités du script

- ✅ Conversion complète du Markdown vers Word
- ✅ Styles personnalisés (titres, texte normal)
- ✅ Génération automatique d'une table des matières
- ✅ En-tête et pied de page avec numérotation
- ✅ Gestion des tableaux
- ✅ Formatage du texte (gras, italique)
- ✅ Gestion des listes à puces et numérotées
- ✅ Blocs de code formatés

## Structure du document généré

Le document Word final aura :
1. **Page de titre** : Plan de Maintenance - Projet Cesizen
2. **Table des matières** générée automatiquement
3. **Contenu principal** avec styles appropriés
4. **En-tête** : Nom du document
5. **Pied de page** : Numérotation des pages

## Améliorations apportées au contenu

Le contenu original a été enrichi pour être plus littéraire et professionnel :
- Introductions détaillées pour chaque section
- Explications contextuelles 
- Développement des concepts techniques
- Remplacement des listes par des paragraphes explicatifs
- Ajout de transitions entre les sections
