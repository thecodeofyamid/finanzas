// src/hooks/useWebSocket.js

import { useEffect, useRef } from 'react';

const useWebSocket = (wsEndpoint, setPrecioDolar, enviarDato) => {
    const wsRef = useRef(null);

    useEffect(() => {
        const socket = new WebSocket(wsEndpoint);

        socket.addEventListener('open', (event) => {
            console.log('Connected to WebSocket server ✅');
            socket.send('Hello Server! 👨‍💻');
        });

        socket.addEventListener('message', (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.action === 'verificar') {
                    const dolar = data.precioDolar;
                    console.log(`Precio del dólar recibido: ${dolar}`);
                    setPrecioDolar(dolar);
                    enviarDato(dolar);
                } else if (data.action === 'error') {
                    console.error(`Error: ${data.error}`);
                }
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        });

        socket.addEventListener('close', (event) => {
            console.log('Disconnected from WebSocket server. Attempting to reconnect...');
            setTimeout(() => {
                socket.close();
            }, 5000);
        });

        socket.addEventListener('error', (event) => {
            console.error('WebSocket error observed:', event);
        });

        wsRef.current = socket;

        return () => {
            socket.close();
        };
    }, [wsEndpoint, setPrecioDolar, enviarDato]);

    return wsRef;
};

export default useWebSocket;
