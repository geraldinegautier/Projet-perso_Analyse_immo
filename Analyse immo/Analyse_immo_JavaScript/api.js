// on récupère les données depuis l'API

const axios = require('axios');
const url = "https://api.cquest.org/dvf?code_postal=92140&type_local=Maison";

async function getDataFromAPI() {
    try {
        const response = await axios.get(url);
        return response.data.resultats;
    } catch (error) {
        console.error("Erreur lors de la récupération des données depuis l'API : ", error);
        throw error;
    }
}

module.exports = { getDataFromAPI };
