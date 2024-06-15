// Inicia la conexión WebSocket
connectWebSocket();

function toUpperCamelCase(str) {
    // Divide el texto en palabras usando una expresión regular que considera espacios, guiones y guiones bajos
    const words = str.split(/[\s-_]+/);
  
    // Convierte cada palabra a UpperCamelCase
    const upperCamelCaseWords = words.map(word => {
      // Convierte la primera letra a mayúscula y el resto a minúsculas
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
  
    // Une las palabras en una sola cadena
    return upperCamelCaseWords.join('');
}

window.toUpperCamelCase = toUpperCamelCase;
