const axios = require('axios');
const cheerio = require('cheerio');

async function contarPalabraEnWeb(url, palabra) {
    try {
        console.log(`Realizando solicitud GET a la URL: ${url}`);
        // Realiza una solicitud GET a la URL
        const response = await axios.get(url);
        console.log(`Solicitud GET realizada con éxito. Código de estado: ${response.status}`);

        // Carga el HTML en cheerio
        const $ = cheerio.load(response.data);
        console.log(`HTML cargado en cheerio.`);

        // Obtén el texto de toda la página
        const textoCompleto = $('body').text();

        // Contar las ocurrencias de la palabra
        const regex = new RegExp(`\\b${palabra}\\b`, 'gi');  // Usamos \b para asegurarnos de que coincidimos con palabras completas
        const coincidencias = textoCompleto.match(regex);
        const conteo = coincidencias ? coincidencias.length : 0;

        console.log(`La palabra "${palabra}" se repite ${conteo} veces en la página.`);

        return conteo;

    } catch (error) {
        console.error(`Error al realizar la solicitud: ${error}`);
        return null;
    }
}

// Ejemplo de uso
const url = 'https://es.wikipedia.org/wiki/Python_(lenguaje_de_programaci%C3%B3n)';  // Sustituye con la URL que desees
const palabra = 'Python';  // Sustituye con la palabra que desees buscar
contarPalabraEnWeb(url, palabra);
