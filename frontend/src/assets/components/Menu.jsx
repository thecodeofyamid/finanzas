import React, { useState } from 'react';

const Menu = ({ openForm, openCash, getColor, precioDolar}) => {
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
    const [selectedType, setSelectedType] = useState(null);

    const handleTransactionType = (type) => {
        const transactionTypes = ['incomes', 'expenses', 'buys', 'debts'];

        transactionTypes.forEach((transactionType) => {
            const transaction = document.getElementById(`${transactionType}-container`);
            if (transaction) {
                transaction.style.display = 'none';
            }
        });

        const selectedTransaction = document.getElementById(`${type}-container`);
        if (selectedTransaction) {
            selectedTransaction.style.display = 'grid';
        }
        function capitalizeFirstLetter(string){
            const [first, ...rest] = string;
            return first.toUpperCase() + rest.join('');
        }
        type = capitalizeFirstLetter(type);
        console.log(type);
        setSelectedType(type);
    };

    return (
        <div id="menu" style={{ background: '#202020', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'absolute', width: '26%', right: '0',top:'0'}}>
            <div style={{width:'80%', height:'88%',marginTop:'5%', background:selectedType ? getColor(selectedType)[1] : '#191919', borderRadius:'10px',display:'flex',flexDirection:'column', justifyContent:'center',alignItems:'center'}}>
                    <div id="bg-dark" style={{ background: 'rgba(0,0,0,.8)', position: 'absolute', width: '70vw', height: '100vh', display: 'none', right: '0' }}></div>
                    <div style={{ width: '100%', textAlign: 'center', padding: '5%' }}><h6>Menú</h6></div>
                    <a href="/"><img style={{ width: '60px', height: '60px', margin: '4%',cursor:'pointer'}} src="dollar.png" alt="money" /></a>
                    <div style={{ width: '100%' }}>
                        <ul style={{ color: 'white' }}>
                            <br></br>
                            <li onClick={() => openForm('Nueva transacción')}>💸 Nueva transacción</li>
                            <li onClick={() => openCash('Caja')}>📦 Caja</li>
                            <li onClick={() => handleTransactionType('incomes')}>📥 Ingresos</li>
                            <li onClick={() => handleTransactionType('expenses')}>📤 Egresos</li>
                            <li onClick={() => handleTransactionType('buys')}>🛒 Compras</li>
                            <li onClick={() => handleTransactionType('debts')}>📝 Deudas</li>
                            <li>📊 Análisis</li>
                        </ul>
                    </div>
                </div>
            </div>
    );
};

export default Menu;
