import React from "react";
import { useState } from "react";
import useWebSocket from "../../hooks/useWebSocket";

export const Header = ({enviarDato})=>{
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

    return(
        <header style={{width:'100%',background:'#212121',color:'white',display: 'flex'}}>
            <div style={{display:'flex',width:'100%',height:'10vh'}}>
                <ul style={{display:'flex', justifyContent:'left',alignItems:'center',textAlign:'center',height:'100%'}}>
                    <div><img style={{width:'50px',height:'50px',marginRight:'1px', padding:'5%'}} src="money_pouch.png"></img></div>
                    <div style={{padding:'15px',color:'white', fontWeight:'bold', letterSpacing:'5px', marginRight:'25px'}}><h6>FINO</h6></div>
                    <div style={{display:'flex'}}>
                        <div className='btn-header' style={{background:'#212121',color:'white', padding: '2% 2%', cursor:'pointer'}}><li>Ingresos</li></div>
                        <div className='btn-header' style={{background:'#212121',color:'white', padding: '2% 2%', cursor:'pointer'}}><li>Egresos</li></div>
                        <div className='btn-header' style={{background:'#212121',color:'white', padding: '2% 2%', cursor:'pointer'}}><li>Deudas</li></div>
                        <div className='btn-header' style={{background:'#212121',color:'white', padding: '2% 2%', cursor:'pointer'}}><li>Compras</li></div>
                    </div>
                </ul>
            </div>
            <div style={{display:'flex',width:'100%', justifyContent:'right',marginRight:'2%',alignItems:'center'}}><h6>Precio del dolar HOY : ${precioDolar !== null ? precioDolar : 'Cargando...'}</h6></div>
        </header>
    )
}
