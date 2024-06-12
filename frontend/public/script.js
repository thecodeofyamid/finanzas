const socket = new WebSocket('wss://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev/ws');

// Evento cuando se abre la conexión
socket.addEventListener('open', (event) => {
    console.log('Connected to WebSocket server ✅');
    // Enviar un mensaje al servidor
    socket.send('Hello Server! 👨‍💻');
});

// Evento cuando se recibe un mensaje del servidor
socket.addEventListener('message', (event) => {
    console.log('', event.data);
    // Aquí puedes manejar el mensaje recibido, por ejemplo, actualizar la interfaz de usuario
});

// Evento cuando se cierra la conexión
socket.addEventListener('close', (event) => {
    console.log('Disconnected from WebSocket server');
});

// Evento cuando ocurre un error
socket.addEventListener('error', (event) => {
    console.error('WebSocket error observed:', event);
});


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

