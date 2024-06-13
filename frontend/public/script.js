let socket;

function connectWebSocket() {
    socket = new WebSocket('wss://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev/ws'); // Ajusta la URL según sea necesario

    // Evento cuando se abre la conexión
    socket.addEventListener('open', (event) => {
        console.log('Connected to WebSocket server ✅');
        // Enviar un mensaje al servidor
        socket.send('Hello Server! 👨‍💻');
    });

    // Evento cuando se recibe un mensaje del servidor
    socket.addEventListener('message', (event) => {
        try {
            const data = JSON.parse(event.data);
            console.log(data.message);  // Muestra el mensaje en un alert
        } catch (error) {
            console.error('Error parsing JSON data:', error);
        }
        // Aquí puedes manejar el mensaje recibido, por ejemplo, actualizar la interfaz de usuario
    });

    // Evento cuando se cierra la conexión
    socket.addEventListener('close', (event) => {
        console.log('Disconnected from WebSocket server. Attempting to reconnect...');
        setTimeout(connectWebSocket, 5000); // Intenta reconectar después de 5 segundos
    });

    // Evento cuando ocurre un error
    socket.addEventListener('error', (event) => {
        console.error('WebSocket error observed:', event);
    });
}

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

