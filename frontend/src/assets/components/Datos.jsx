import React, { useState, useEffect } from 'react';

const Datos = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('https://opulent-palm-tree-v664644jv4xw2w556-3000.app.github.dev/compras')
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
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <div><p>{user.descripcion}</p></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Datos;
