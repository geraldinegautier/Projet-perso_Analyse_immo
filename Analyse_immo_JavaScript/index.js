const { getDataFromAPI } = require('./api');
const { processData } = require('./dataProcessing');
const { createCharts } = require('./createCharts');
const { generateExcel } = require('./generateExcel');

async function main() {
    try {
        // Récupérer les données depuis l'API
        const rawData = await getDataFromAPI();

        // Traiter les données
        const processedData = await processData(rawData);

        console.log('Données traitées:', processedData); // Ajoutez ce log pour vérifier les données


        // Créer les graphiques
        await createCharts(processedData);

        // Générer le fichier Excel
        await generateExcel(processedData);

        console.log('Le processus est terminé avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'exécution du script :', error);
    }
}

main();
