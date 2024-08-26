import requests # bibliothèque qui permet d'interagir avec l'API et de récupérer les données au format JSON
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from openpyxl import Workbook
from openpyxl.drawing.image import Image
from openpyxl.utils.dataframe import dataframe_to_rows
from mappings import section_to_quartier

# Récupération des données depuis l'API
url = "https://api.cquest.org/dvf?code_postal=92140&type_local=Maison"
response = requests.get(url)
data = response.json()

# Chargement des données dans Pandas
resultats = data['resultats']
df = pd.json_normalize(resultats)

# Ajout d'une colonne 'quartier' au DataFrame
df['quartier'] = df['section'].map(section_to_quartier)

# Ajout d'une colonne 'prix_m2' au DataFrame
# Calcul du prix par mètre carré
df['prix_m2'] = df['valeur_fonciere'] / df['surface_relle_bati']

# Analyse des données

# Calcul du prix moyen au mètre carré par quartier
prix_moyen_m2_par_quartier = df.groupby('quartier')['prix_m2'].mean().reset_index()
prix_moyen_m2_par_quartier = prix_moyen_m2_par_quartier.sort_values(by='prix_m2', ascending=False)

# Calcul du nombre de ventes par quartier
nombre_ventes_par_quartier = df['quartier'].value_counts().reset_index()
nombre_ventes_par_quartier.columns = ['quartier', 'nombre_ventes']

# Calcul de la surface moyenne des terrains par quartier
surface_moyenne_par_quartier = df.groupby('quartier')['surface_terrain'].mean().reset_index()
surface_moyenne_par_quartier = surface_moyenne_par_quartier.sort_values(by='surface_terrain', ascending=False)

# Fusionner tous les résultats dans un seul DataFrame
resultats_complets = pd.merge(prix_moyen_m2_par_quartier, nombre_ventes_par_quartier, on='quartier')
resultats_complets = pd.merge(resultats_complets, surface_moyenne_par_quartier, on='quartier')

# Renommer les colonnes pour plus de clarté
resultats_complets.columns = ['quartier', 'prix_moyen_m2', 'nombre_ventes', 'surface_moyenne']

# Sauvegarder les résultats dans un fichier CSV
resultats_complets.to_csv('resultats_immobiliers.csv', index=False)

# Visualisation des données

# Prix moyen au m² par quartier
plt.figure(figsize=(12,6))
sns.barplot(x=prix_moyen_m2_par_quartier['quartier'], y=prix_moyen_m2_par_quartier['prix_m2'], palette="viridis")
plt.title('Prix moyen au m² par quartier')
plt.xlabel('Quartier')
plt.ylabel('Prix moyen au m²')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('prix_moyen_m2_par_quartier.png')  # Sauvegarder le graphique
plt.close()

# Nombre de ventes par quartier
plt.figure(figsize=(12,6))
sns.barplot(x=nombre_ventes_par_quartier['quartier'], y=nombre_ventes_par_quartier['nombre_ventes'], palette="rocket")
plt.title('Nombre de ventes par quartier')
plt.xlabel('Quartier')
plt.ylabel('Nombre de ventes')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('nombre_ventes_par_quartier.png')  # Sauvegarder le graphique
plt.close()

# Surface moyenne des terrains par quartier
plt.figure(figsize=(12,6))
sns.barplot(x=surface_moyenne_par_quartier['quartier'], y=surface_moyenne_par_quartier['surface_terrain'], palette="magma")
plt.title('Surface moyenne des terrains par quartier')
plt.xlabel('Quartier')
plt.ylabel('Surface moyenne (m²)')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('surface_moyenne_par_quartier.png')  # Sauvegarder le graphique
plt.close()

# Sauvegarder tous les résultats dans un fichier Excel avec les graphiques
wb = Workbook()
ws = wb.active
ws.title = "Données"

# Sauvegarde du DataFrame dans une feuille Excel
for r in dataframe_to_rows(resultats_complets, index=False, header=True):
    ws.append(r)

# Ajout des images
image_files = ['prix_moyen_m2_par_quartier.png', 'nombre_ventes_par_quartier.png', 'surface_moyenne_par_quartier.png']
start_row = len(resultats_complets) + 4  # Ajuste la ligne de départ pour les images

for image_file in image_files:
    img = Image(image_file)
    ws.add_image(img, f'A{start_row}')
    start_row += 25  # Ajuste l'espacement vertical entre les images, changez la valeur selon la taille des images

# Sauvegarder le fichier Excel
wb.save("resultats_immobiliers_complets.xlsx")