// on traite les données récupérées

const { getDataFromAPI } = require('./api');
const { sectionToQuartier } = require('./mappings');

const processData = async () => {
    const data = await getDataFromAPI();

    // Vérifier que les données sont valides
    if (!Array.isArray(data)) {
        throw new Error('Les données récupérées depuis l\'API ne sont pas un tableau.');
    }

    // Calcul des prix moyens au m², nombre de ventes, surface moyenne
    const quartierData = data.map(item => ({
        quartier: sectionToQuartier[item.section] || 'Inconnu',
        prix_m2: item.valeur_fonciere / (item.surface_relle_bati || 1), // Ajout d'une vérification pour éviter la division par 0
        nombre_ventes: 1,
        surface_terrain: item.surface_terrain
    }));

    // Calcul du prix moyen au m² par quartier
    const prixMoyenM2ParQuartier = quartierData.reduce((acc, { quartier, prix_m2 }) => {
        if (!acc[quartier]) acc[quartier] = { totalPrix: 0, count: 0 };
        acc[quartier].totalPrix += prix_m2;
        acc[quartier].count += 1;
        return acc;
    }, {});

    // Calcul du nombre de ventes par quartier
    const nombreVentesParQuartier = quartierData.reduce((acc, { quartier }) => {
        if (!acc[quartier]) acc[quartier] = 0;
        acc[quartier] += 1;
        return acc;
    }, {});

    // Calcul de la surface moyenne par quartier
    const surfaceMoyenneParQuartier = quartierData.reduce((acc, { quartier, surface_terrain }) => {
        if (!acc[quartier]) acc[quartier] = { totalSurface: 0, count: 0 };
        acc[quartier].totalSurface += surface_terrain;
        acc[quartier].count += 1;
        return acc;
    }, {});

    // Préparation des données pour les graphiques
    return {
        prixMoyenM2: {
            labels: Object.keys(prixMoyenM2ParQuartier),
            values: Object.values(prixMoyenM2ParQuartier).map(v => v.totalPrix / v.count)
        },
        nombreVentes: {
            labels: Object.keys(nombreVentesParQuartier),
            values: Object.values(nombreVentesParQuartier)
        },
        surfaceMoyenne: {
            labels: Object.keys(surfaceMoyenneParQuartier),
            values: Object.values(surfaceMoyenneParQuartier).map(v => v.totalSurface / v.count)
        }
    };
};

module.exports = { processData };