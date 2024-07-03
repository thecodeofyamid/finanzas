//units
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';

//compontents
import { Header } from './assets/components/Header';
import Dollar from './assets/components/Dollar';
import TransactionList from './assets/components/TransactionList';
import CashContainer from './assets/components/CashContainer';
import FormPrincipal from './assets/components/FormPrincipal';

//utils
import { getColor } from './utils/colorUtils';
import { formatPrice } from './utils/currencyUtils';

//config
import { WS_ENDPOINT,HTTP_ENDPOINT } from './config/endpoints';

//hooks
import { useExchangeRate } from './hooks/useExchangeRate';
import { useInputData } from './hooks/useInputData';
import { useTotals } from './hooks/useTotals';
import { useTransactions } from './hooks/useTransactions';
import { useRefs } from './hooks/useRefs';
import { useDataFetching } from './hooks/useDataFetching';
import { useCalculateTotals } from './hooks/useCalculateTotals';

const App = () => {
    //Estados
    const { exchangeRate, setExchangeRate } = useExchangeRate();
    const { inputData, setInputData } = useInputData();
    const { totals, setTotals } = useTotals();
    const { transactions, setTransactions, editingTransaction, setEditingTransaction } = useTransactions();

    //Referencias
    const {isInitialLoad, wsRef, editRef} = useRefs();

    //Efectos
    useDataFetching(HTTP_ENDPOINT, WS_ENDPOINT, setTransactions, isInitialLoad, wsRef);
    const calculateTotals = useCalculateTotals(transactions, setTotals);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price') {
            const formattedPrice = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            setInputData((prevInputData) => ({
                ...prevInputData,
                [name]: formattedPrice
            }));
        } else {
            setInputData((prevInputData) => ({
                ...prevInputData,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputDataCopy = { ...inputData, price: inputData.price.replace(/\./g, '') };

        try {
            const response = await axios.post(`${HTTP_ENDPOINT}/add_transactions`, inputDataCopy);
            const newTransaction = response.data;
            setTransactions((prevTransactions) => getUniqueTransactions([...prevTransactions, newTransaction]));
            setInputData({
                description: '',
                price: '',
                date: '',
                importance: '',
                type: '',
                category: '',
                ready: '',
                deadline: ''
            });
        } catch (error) {
            console.error('Error inserting transaction', error);
            alert('Error inserting transaction. Please check your data and try again.');
        }
    };

    const handleSubmitEditForm = async (e, id) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const editedData = Object.fromEntries(formData.entries());

        try {
            const response = await axios.put(`${HTTP_ENDPOINT}/edit/${id}`, editedData);
            const updatedTransaction = response.data.transaction;

            setTransactions(prevTransactions =>
                prevTransactions.map(transaction =>
                    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
                )
            );
            alert("Registro modificado con éxito ")
            exitEdit(); // Cerrar el formulario de edición
        } catch (error) {
            console.error('Error editing transaction:', error);
            alert('Error editing transaction. Please try again.');
        }
    };

    const seeMore = (transaction) => {
        setEditingTransaction(transaction);
        if (editRef.current) {
            const transactionHTML = `
                <div id="edit-box" style="background: white; padding:2%; border: 5px solid ${getColor(transaction.type)[1]}; background: ${getColor(transaction.type)[1]}; color: white">
                    <div><h4>Información del producto</h4></div>
                    <form id="form-edit" onSubmit="handleSubmitEditForm(event, '${transaction.id}')">
                        <label style='color:white'>Descripción:</label>
                        <input type='text' name='description' value='${transaction.description}'>
                        <label style='color:white'>Precio:</label>
                        <input type='number' name='price' value='${transaction.price}'>
                        <input type='submit' style="background: #333; border: none" value="Submit">
                        <input id='exit-button' type='button' style="background: #333; border: none;" value="Exit">
                    </form>
                </div>`;

            // Asignar el HTML generado al elemento editRef.current
            editRef.current.innerHTML = transactionHTML;

            // Mostrar el contenedor
            editRef.current.style.display = 'flex';

            // Agregar un listener para el botón de salida (exit button)
            document.getElementById('exit-button').addEventListener('click', exitEdit);

            // Capturar el evento de envío del formulario de edición
            const formEdit = document.getElementById('form-edit');
            formEdit.addEventListener('submit', (e) => handleSubmitEditForm(e, transaction.id));
        }
    };

    const exitEdit = () => {
        setEditingTransaction(null);
        if (editRef.current) {
            editRef.current.style.display = 'none';
        }
    };

    const recibirDato = (datoRecibido) => {
        console.log(`Dato del dolar: ${datoRecibido}`);
        setExchangeRate(datoRecibido);
    };

    
    return (
        <div id="container" style={{ background: '#333', display: 'flex', flexDirection: 'column', gap: '5%', alignItems: 'center', justifyContent: 'center', padding: '0%' }}>
            <Header enviarDato={recibirDato}></Header>
            <div ref={editRef} id="hidden-edit" style={{ position: 'absolute', background: 'rgba(0,0,0,0.8)', height: '100%', width: '100%', display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            </div>
            <div id="content">
                <div id="results" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '5% 1fr 1fr 5%', gap: '0%', alignItems: 'start', justifyContent: 'center' }} className="results">
                    <div id="container-2" style={{ gridColumn: '1 / -1', gridRow: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '0.2fr 0fr 1fr', padding: '2%', gap: '2%' }}>
                        <FormPrincipal handleSubmit={handleSubmit} handleChange={handleChange} inputData={inputData}></FormPrincipal>
                        <CashContainer formatPrice={formatPrice} totals={totals} exchangeRate={exchangeRate}></CashContainer>
                        <div id="buys-container" style={{ gridRow: '3', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Buys" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT} />
                        </div>
                        <div id="incomes-container" style={{ gridRow: '1/4', gridColumn: '2/4' }}>
                            <TransactionList transactions={transactions} type="Incomes" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                        <div id="expenses-container" style={{ gridRow: '-1', gridColumn: '1/3' }}>
                            <TransactionList transactions={transactions} type="Expenses" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                        <div id="debts-container" style={{ gridRow: '4', gridColumn: '3/-1' }}>
                            <TransactionList transactions={transactions} type="Debts" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
