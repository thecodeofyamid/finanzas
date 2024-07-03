import React, { useState } from 'react';
import useWebSocket from '../../hooks/useWebSocket';

const Dollar = ({ enviarDato }) => {
  const [precioDolar, setPrecioDolar] = useState(null);

  const onMessage = (event) => {
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
  };

  const onClose = (event) => {
    console.log('Disconnected from WebSocket server. Attempting to reconnect...');
    setTimeout(() => {
      // Reconnect logic if needed
    }, 5000);
  };

  const onError = (event) => {
    console.error('WebSocket error observed:', event);
  };

  useWebSocket('ws://192.168.18.141:4000', onMessage, onClose, onError);

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
};

export default Dollar;
