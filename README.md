# Projet d'Analyse Immobilière

## Constexte

L'idée de départ était de manipuler la librairie Pandas en Python pour analyser des données. J'ai finalement décidé de réaliser un projet similaire en JavaScript puis de comparer les performances des deux langages.

## Description

Ce projet vise à analyser des données immobilières à partir d'une API publique. Il fournit des analyses détaillées sur les prix au m², le nombre de ventes et la surface moyenne
des propriétés dans différents quartiers. Les résultats sont visualisés à l'aide de graphiques et exportés dans un fichier Excel pour une analyse plus approfondie.

## Technologies Utilisées

Ce projet a été réalisé dans 2 langages différents :
- Python avec les librairies Pandas, matplotlib.pyplot, seaborn, openpyxl
- JavaScript avec Node.js et Charts.js

## Fonctionnalités

- **Récupération des Données** : Extraction des données immobilières depuis l'API [DVF](https://api.cquest.org/dvf?code_postal=92140&type_local=Maison).
- **Traitement des Données** : Calcul des prix moyens au m², du nombre de ventes et de la surface moyenne par quartier.
- **Visualisation des Données** : Création de graphiques pour représenter visuellement les analyses.
- **Exportation** : Génération d'un fichier Excel contenant les résultats d'analyse et les graphiques.

## Comparaison des Performances
Dans le cadre de ce projet, les performances des implémentations en Python et en JavaScript (Node.js) ont été comparées pour évaluer l'efficacité des deux solutions. Cette comparaison a été effectuée en mesurant :

**Temps d'exécution total** : Le temps nécessaire pour exécuter l'ensemble du processus, depuis l'extraction des données jusqu'à la génération des résultats finaux.
**Utilisation de la mémoire** : La quantité de mémoire utilisée au cours de l'exécution du script.
Les résultats des performances ont été enregistrés dans des fichiers Excel distincts pour chaque langage, permettant ainsi une analyse détaillée des différences de performance entre les deux approches. Cette comparaison vise à identifier les forces et les faiblesses de chaque langage dans le contexte du traitement et de l'analyse de données immobilières.
