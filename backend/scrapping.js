const axios = require('axios');
const cheerio = require('cheerio');

function convertirANumero(texto) {
    // Remover las comas del texto y convertir a número flotante
    const numero = parseFloat(texto.replace(/,/g, ''));
    return numero;
}

async function verificarClasePromedioVerde(url) {
    try {
        // Realizar la solicitud GET para obtener el contenido HTML de la página
        const response = await axios.get(url);

        // Verificar si la solicitud fue exitosa
        if (response.status === 200) {
            // Parsear el contenido HTML con Cheerio
            const $ = cheerio.load(response.data);

            // Buscar si existe algún elemento con la clase "promedio verde"
            const elementos = $('.YMlKec.fxKbKc');

            // Verificar si se encontraron elementos con esa clase
            if (elementos.length) {
                console.log("La clase 'YMlKec fxKbKc' existe en la página. Contenidos:");
                const precios = [];
                elementos.each((index, elemento) => {
                    // Imprimir el contenido de cada elemento
                    const precio = convertirANumero($(elemento).text().trim());
                    precios.push(precio);
                });
                return precios.length ? precios[0] : null; // Retornar el primer precio encontrado
            } else {
                console.log("La clase 'YMlKec fxKbKc' no se encontró en la página.");
                return null;
            }
        } else {
            console.log(`Error al obtener la página: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error(`Error al realizar la solicitud: ${error}`);
        return null;
    }
}

module.exports = {
    verificarClasePromedioVerde
};
