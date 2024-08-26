// on génère les graphiques

const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

async function createCharts(data) {
    if (!data || !data.prixMoyenM2 || !data.nombreVentes || !data.surfaceMoyenne) {
        throw new Error('Les données pour les graphiques sont manquantes.');
    }

    const width = 800;
    const height = 600;
    const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

    const createChart = async (labels, values, title, fileName) => {
        const configuration = {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: title,
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.4)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1,
                    barPercentage: 0.8,
                    categoryPercentage: 0.9
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        grid: {
                            borderDash: [5, 5]
                        },
                        ticks: {
                            font: {
                                size: 14
                            },
                            callback: function (value) {
                                return value.toFixed(0);
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 16
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `Prix moyen: ${tooltipItem.raw.toFixed(2)} €/m²`;
                            }
                        }
                    }
                }
            }
        };

        const image = await chartJSNodeCanvas.renderToBuffer(configuration);
        fs.writeFileSync(fileName, image);
        console.log(`Graphique enregistré : ${fileName}`);
    };

    await createChart(data.prixMoyenM2.labels, data.prixMoyenM2.values, 'Prix moyen au m² par quartier', 'prix_moyen_m2_par_quartier.png');
    await createChart(data.nombreVentes.labels, data.nombreVentes.values, 'Nombre de ventes par quartier', 'nombre_ventes_par_quartier.png');
    await createChart(data.surfaceMoyenne.labels, data.surfaceMoyenne.values, 'Surface moyenne des terrains par quartier', 'surface_moyenne_par_quartier.png');
}

module.exports = { createCharts };