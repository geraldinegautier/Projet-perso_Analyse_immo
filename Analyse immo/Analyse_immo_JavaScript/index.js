const { performance } = require('perf_hooks');
const ExcelJS = require('exceljs');

const { getDataFromAPI } = require('./api');
const { processData } = require('./dataProcessing');
const { createCharts } = require('./createCharts');
const { generateExcel } = require('./generateExcel');

async function main() {
    try {
        // Démarrage de la mesure du temps
        const startTime = performance.now();

        // Mesure initiale de la mémoire
        const initialMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

        // Récupérer les données depuis l'API
        const rawData = await getDataFromAPI();

        // Traiter les données
        const processedData = await processData(rawData);

        // Créer les graphiques
        await createCharts(processedData);

        // Générer le fichier Excel
        await generateExcel(processedData);

        // Fin de la mesure du temps
        const endTime = performance.now();

        // Mesure de la mémoire à la fin
        const finalMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024; // Convertir en MiB

        // Calcul du temps total d'exécution et de l'utilisation de la mémoire
        const executionTime = ((endTime - startTime) / 1000).toFixed(2); // en secondes
        const memoryUsage = (finalMemoryUsage - initialMemoryUsage).toFixed(2); // en MiB

        console.log('Temps d\'exécution total (ms):', executionTime);
        console.log('Utilisation mémoire maximale (MiB):', memoryUsage);

        // Génération du fichier Excel pour les résultats de performance
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Performance Générale');

        worksheet.columns = [
            { header: 'Mesure', key: 'measure', width: 30 },
            { header: 'Valeur', key: 'value', width: 30 },
        ];

        worksheet.addRow({ measure: 'Temps d\'exécution total (ms)', value: executionTime });
        worksheet.addRow({ measure: 'Utilisation mémoire maximale (MiB)', value: memoryUsage });

        await workbook.xlsx.writeFile('performance_generale_nodejs.xlsx');
        console.log('Les résultats de performance générale ont été sauvegardés dans "performance_generale_nodejs.xlsx".');

        console.log('Le processus est terminé avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'exécution du script :', error);
    }
}

main();
