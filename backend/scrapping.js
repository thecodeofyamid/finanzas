const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs/promises'); // Importar fs con soporte async/await

const FILE_PATH = './dolar.json'; // Ruta donde se guardará el archivo JSON

function convertirANumero(texto) {
    // Remover las comas del texto y convertir a número flotante
    const numero = parseFloat(texto.replace(/,/g, ''));
    return numero;
}

async function guardarPrecioEnJSON(precio) {
    try {
        const data = JSON.stringify({ precio });
        await fs.writeFile(FILE_PATH, data);
        console.log(`Precio del dólar (${precio}) guardado en ${FILE_PATH}`);
    } catch (error) {
        console.error('Error al guardar el precio en JSON:', error);
    }
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

                if (precios.length > 0) {
                    const precio = precios[0];
                    await guardarPrecioEnJSON(precio); // Guardar el precio en el archivo JSON
                    return precio; // Retornar el primer precio encontrado
                } else {
                    console.log('No se encontraron precios válidos.');
                    return null;
                }
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
