// on génère un fichier Excel avec les résultats d'analyse

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const generateExcel = async (data) => {
    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Données');

    // Ajouter les en-têtes
    ws.columns = [
        { header: 'Quartier', key: 'quartier', width: 30 },
        { header: 'Prix moyen m²', key: 'prix_moyen_m2', width: 20 },
        { header: 'Nombre de ventes', key: 'nombre_ventes', width: 20 },
        { header: 'Surface moyenne (m²)', key: 'surface_moyenne', width: 25 }
    ];

    // Structurer les données pour les ajouter à la feuille
    const rows = data.prixMoyenM2.labels.map((quartier, index) => ({
        quartier,
        prix_moyen_m2: data.prixMoyenM2.values[index],
        nombre_ventes: data.nombreVentes.values[index],
        surface_moyenne: data.surfaceMoyenne.values[index]
    }));

    // Ajouter les données dans la feuille Excel
    rows.forEach(row => ws.addRow(row));

    // Ajouter les graphiques
    const imageFiles = ['prix_moyen_m2_par_quartier.png', 'nombre_ventes_par_quartier.png', 'surface_moyenne_par_quartier.png'];
    let startRow = rows.length + 4;

    imageFiles.forEach(imageFile => {
        const imagePath = path.join(__dirname, imageFile);
        if (fs.existsSync(imagePath)) {
            const imageId = wb.addImage({
                filename: imagePath,
                extension: 'png'
            });
            ws.addImage(imageId, {
                tl: { col: 0, row: startRow },
                ext: { width: 600, height: 400 }
            });
            startRow += 25;  // Ajuster l'espacement entre les images
        } else {
            console.warn(`Le fichier ${imageFile} n'existe pas.`);
        }
    });

    // Sauvegarder le fichier Excel
    const filePath = path.join(__dirname, 'resultats_immobiliers_complets.xlsx');
    await wb.xlsx.writeFile(filePath);
    console.log(`Fichier Excel enregistré : ${filePath}`);
};

module.exports = { generateExcel };
