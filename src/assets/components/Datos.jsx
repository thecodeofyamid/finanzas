import React, { useState, useEffect } from 'react';

const Datos = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/compras')
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un error al obtener los usuarios!');
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Lista de compras</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.descripcion}</li>
        ))}
      </ul>
    </div>
  );
};

export default Datos;
