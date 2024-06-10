import React, { useState, useEffect } from 'react';

const Datos = () => {
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket('wss://potential-robot-jjj6j66p5vpw3vv7-3001.app.github.dev');
    setSocket(ws);

    ws.onopen = () => {
      console.log('Conectado al servidor WebSocket');
    };

    ws.onmessage = (event) => {
      console.log('Mensaje recibido del servidor:', event.data);
      // Puedes manejar los mensajes recibidos aquí
    };

    ws.onclose = () => {
      console.log('Desconectado del servidor WebSocket');
    };

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    fetch('https://potential-robot-jjj6j66p5vpw3vv7-3001.app.github.dev/compras')
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un error al obtener los usuarios!');
        }
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError('La respuesta no es JSON');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error('Error al obtener los datos:', error);
      });
  }, []);

  return (
    <div className='data'>
      <table>
        <thead>
          <tr>
            <th>Descripción</th>
            <th>Precio</th>
            <th>Categoría</th>
          </tr>
        </thead>
        <tbody>
          {users.map(compra => (
            <tr key={compra.id}>
              <td>{compra.description}</td>
              <td style={{marginLeft:'2%'}}>{compra.price}</td>
              <td style={{marginLeft:'2%'}}>{compra.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Datos;
