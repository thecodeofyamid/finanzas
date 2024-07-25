import React, { useState } from 'react';

const Menu = ({ openForm, openCash, getColor, precioDolar, setSelectedMonth }) => {
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

        function capitalizeFirstLetter(string) {
            const [first, ...rest] = string;
            return first.toUpperCase() + rest.join('');
        }

        type = capitalizeFirstLetter(type);
        console.log(type);
        setSelectedType(type);
    };

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div id="menu" style={{ background: '#202020', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', position: 'absolute', width: '26%', right: '0', top: '0' }}>
            <div style={{ padding: '2%' }}>
                <a href="/">
                    <img style={{ width: '60px', height: '60px', margin: '4%', cursor: 'pointer' }} src="dollar.png" alt="money" />
                </a>
            </div>
            <div style={{ width: '80%', height: 'auto', overflow: 'auto', marginTop: '5%', background: selectedType ? getColor(selectedType)[1] : '#191919', borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div id="bg-dark" style={{ background: 'rgba(0,0,0,.8)', position: 'absolute', width: '70vw', height: '120vh', display: 'none', right: '0' }}></div>
                <div style={{ width: '100%' }}>
                    <div style={{ padding: '5%', height: 'auto' }}>
                        <label style={{color:'white', width: '100%', textAlign:'center'}}>Mes: </label>
                        <select style={{ color: 'black', border: 'none' }} onChange={handleMonthChange}>
                            <option value="0">Todos</option>
                            <option value="1">Enero</option>
                            <option value="2">Febrero</option>
                            <option value="3">Marzo</option>
                            <option value="4">Abril</option>
                            <option value="5">Mayo</option>
                            <option value="6">Junio</option>
                            <option value="7">Julio</option>
                            <option value="8">Agosto</option>
                            <option value="9">Septiembre</option>
                            <option value="10">Octubre</option>
                            <option value="11">Noviembre</option>
                            <option value="12">Diciembre</option>
                        </select>
                    </div>
                    <ul style={{ color: 'white' }}>
                        <br />
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
