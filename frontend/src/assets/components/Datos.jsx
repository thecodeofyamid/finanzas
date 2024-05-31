import React, { useState, useEffect } from 'react'

const Datos = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://192.168.18.141:3000/consultantes')
      .then(response => {
        if (!response.ok) {
          throw new Error('Hubo un error al obtener los usuarios!')
        }
        return response.json()
      })
      .then(data => {
        setUsers(data)
      })
      .catch(error => {
        console.error(error)
      })
  }, [])

  return (
    <div className='data'>
      <ul>
        {users.map(user => (
          <li key={user.id}><div><p>{user.inquerir_name}</p><p style={{marginLeft:"0.5%"}}>{user.inquerir_surname}</p></div></li>
        ))}
      </ul>
    </div>
  )
}
export default Datos
