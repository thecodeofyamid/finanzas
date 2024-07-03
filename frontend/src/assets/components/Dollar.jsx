import React, { useState, useEffect } from 'react';

function Dollar({ enviarDato }) {
  const [precioDolar, setPrecioDolar] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://192.168.18.141:4000');

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

    return () => {
      socket.close();
    };
  }, []);

  const formatPrice = (price) => {
    if (price === null) {
      return 'Cargando...';
    }

    // Formatear el precio con puntos de mil como comas y punto decimal
    return parseFloat(price).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    });
  };

  return (
    <div className="dolar" style={{ background: 'white', color: 'black', padding: '5%', borderRadius: '10px' }}>
      <h5>Dollar Today</h5>
      <p style={{ fontSize: '1.5rem', color: 'black' }}><strong>{precioDolar !== null ? formatPrice(precioDolar) : 'Cargando...'}</strong></p>
    </div>
  );
}

export default Dollar;
