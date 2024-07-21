import React, { useState, useRef } from 'react';
import axios from 'axios';
import Dollar from './assets/components/Dollar';
import TransactionList from './assets/components/TransactionList';
import { Cash } from './assets/components/Cash';
import { FormPrincipal } from './assets/components/FormPrincipal';
import closeCash from './helpers/closeCash';
import openCash from './helpers/openCash';
import closeForm from './helpers/closeForm';
import openForm from './helpers/openForm';
import Menu from './assets/components/Menu';
import { getColor } from './utils/getColor';
import { HTTP_ENDPOINT, WS_ENDPOINT } from './config/endpoints';
import { formatPrice } from './utils/formatPrice';
import { initialInputData, initialTotals } from './config/initialState';
import useWebSocket from './hooks/useWebSocket';
import enviarDato from './helpers/sendData';
import useTransactionsWebSocket from './hooks/useTransactionsWebSocket';
import getUniqueTransactions from './helpers/getUniqueTransaction';
import useCalculateTotals from './hooks/useCalculateTotals';
import seeMore from './utils/seeMore';

export const App = () => {
    const [exchangeRate, setExchangeRate] = useState(null);
    const [inputData, setInputData] = useState(initialInputData);
    const [totals, setTotals] = useState(initialTotals);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [precioDolar, setPrecioDolar] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState("0");

    const isInitialLoad = useRef(true);
    const wsRef = useRef(null);
    const editRef = useRef(null);

    useWebSocket(WS_ENDPOINT, setPrecioDolar, enviarDato);

    // Pasar selectedMonth al hook useTransactionsWebSocket
    useTransactionsWebSocket(setTransactions, isInitialLoad, wsRef, getUniqueTransactions, selectedMonth);

    useCalculateTotals(transactions, setTotals);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'price') {
            const formattedPrice = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
            setInputData((prevInputData) => ({
                ...prevInputData,
                [name]: formattedPrice,
            }));
        } else {
            setInputData((prevInputData) => ({
                ...prevInputData,
                [name]: value,
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
            setInputData(initialInputData);
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

            setTransactions((prevTransactions) =>
                prevTransactions.map((transaction) =>
                    transaction.id === updatedTransaction.id ? updatedTransaction : transaction
                )
            );
            alert('Registro modificado con éxito ');
            exitEdit(); // Cerrar el formulario de edición
        } catch (error) {
            console.error('Error editing transaction:', error);
            alert('Error editing transaction. Please try again.');
        }
    };

    const recibirDato = (datoRecibido) => {
        console.log(`Dato del dolar: ${datoRecibido}`);
        setExchangeRate(datoRecibido);
    };

    const exitEdit = () => {
        setEditingTransaction(null);
        if (editRef.current) {
            editRef.current.style.display = 'none';
        }
    };

    return (
        <div
            id="container"
            style={{
                background: '#333',
                display: 'flex',
                flexDirection: 'column',
                gap: '0%',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0%',
            }}
        >
            <div
                ref={editRef}
                id="hidden-edit"
                style={{
                    position: 'absolute',
                    background: 'rgba(0,0,0,0.8)',
                    height: '100%',
                    width: '75%',
                    left: '0',
                    display: 'none',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            ></div>
            <div id="content">
                <div
                    id="results"
                    style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr 1fr',
                        gridTemplateRows: '5% 1fr 1fr 5%',
                        gap: '0%',
                        alignItems: 'start',
                        justifyContent: 'center',
                    }}
                    className="results"
                >
                    <div
                        id="container-2"
                        style={{
                            gridColumn: '1 / -1',
                            gridRow: '1 / -1',
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr 1fr 1fr',
                            gridTemplateRows: '0.2fr 0fr 1fr',
                            padding: '2%',
                            margin: '0% 3% 4% 0%',
                            gap: '0%',
                        }}
                    >
                        <FormPrincipal
                            handleSubmit={handleSubmit}
                            inputData={inputData}
                            handleChange={handleChange}
                            closeForm={closeForm}
                        ></FormPrincipal>
                        <Cash
                            formatPrice={formatPrice}
                            totals={totals}
                            exchangeRate={exchangeRate}
                            closeCash={closeCash}
                        ></Cash>
                        <Menu
                            openForm={openForm}
                            openCash={openCash}
                            getColor={getColor}
                            precioDolar={precioDolar}
                            setSelectedMonth={setSelectedMonth} // Pasar setSelectedMonth a Menu
                        ></Menu>
                        <div
                            style={{
                                gridRow: '2',
                                gridColumn: '1',
                                height: '100vh',
                                display: 'none',
                            }}
                        >
                            <Dollar enviarDato={recibirDato}></Dollar>
                        </div>
                        <div id="buys-container" style={{ gridRow: '1/4', gridColumn: '1/4' }}>
                            <TransactionList
                                transactions={transactions}
                                type="Buys"
                                setTransactions={setTransactions}
                                exchangeRate={exchangeRate}
                                onSeeMore={(transaction) =>
                                    seeMore(transaction, setEditingTransaction, editRef, handleSubmitEditForm)
                                }
                                getColor={getColor}
                                formatPrice={formatPrice}
                                HTTP_ENDPOINT={HTTP_ENDPOINT}
                            />
                        </div>
                        <div id="debts-container" style={{ gridRow: '1/4', gridColumn: '1/4' }}>
                            <TransactionList
                                transactions={transactions}
                                type="Debts"
                                setTransactions={setTransactions}
                                exchangeRate={exchangeRate}
                                onSeeMore={(transaction) =>
                                    seeMore(transaction, setEditingTransaction, editRef, handleSubmitEditForm)
                                }
                                getColor={getColor}
                                formatPrice={formatPrice}
                                HTTP_ENDPOINT={HTTP_ENDPOINT}
                            />
                        </div>
                        <div id="expenses-container" style={{ gridRow: '1/4', gridColumn: '1/4' }}>
                            <TransactionList
                                transactions={transactions}
                                type="Expenses"
                                setTransactions={setTransactions}
                                exchangeRate={exchangeRate}
                                onSeeMore={(transaction) =>
                                    seeMore(transaction, setEditingTransaction, editRef, handleSubmitEditForm)
                                }
                                getColor={getColor}
                                formatPrice={formatPrice}
                                HTTP_ENDPOINT={HTTP_ENDPOINT}
                            />
                        </div>
                        <div id="incomes-container" style={{ gridRow: '1/4', gridColumn: '1/4' }}>
                            <TransactionList
                                transactions={transactions}
                                type="Incomes"
                                setTransactions={setTransactions}
                                exchangeRate={exchangeRate}
                                onSeeMore={(transaction) =>
                                    seeMore(transaction, setEditingTransaction, editRef, handleSubmitEditForm)
                                }
                                getColor={getColor}
                                formatPrice={formatPrice}
                                HTTP_ENDPOINT={HTTP_ENDPOINT}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
