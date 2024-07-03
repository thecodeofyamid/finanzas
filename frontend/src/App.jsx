import React, { useState, useEffect, useRef } from 'react'
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

const HTTP_ENDPOINT = 'http://192.168.18.141:4000';
const WS_ENDPOINT = 'ws://192.168.18.141:4000';

const getColor = (type) => {
    switch (type) {
        case 'Buys':
            return ['#eeeeee', 'blue'];
        case 'Incomes':
            return ['#eeeeee', 'green'];
        case 'Expenses':
            return ['#eeeeee', 'red'];
        case 'Debts':
            return ['#eeeeee', 'orange'];
        default:
            return ['black', 'black'];
    }
};

const formatPrice = (priceCOP, exchangeRate) => {
    if (exchangeRate === null) {
        return ['Cargando...', 'Cargando...'];
    }
    const priceUSD = priceCOP / exchangeRate;
    const priceColombia = priceCOP;
    return [
        priceUSD.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }),
        priceColombia.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
        })
    ];
};



const App = () => {
    const [exchangeRate, setExchangeRate] = useState(null);
    const [inputData, setInputData] = useState({
        description: '',
        price: '',
        date: '',
        importance: '',
        type: '',
        category: '',
        ready: '',
        deadline: ''
    });
    const [totals, setTotals] = useState({
        Buys: 0,
        Incomes: 0,
        Expenses: 0,
        Debts: 0,
        General: 0
    });
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const isInitialLoad = useRef(true);
    const wsRef = useRef(null);
    const editRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${HTTP_ENDPOINT}/transactions`);
                const uniqueTransactions = getUniqueTransactions(response.data);
                setTransactions(uniqueTransactions);
                isInitialLoad.current = false;
            } catch (error) {
                console.error('Error fetching transactions', error);
            }
        };
        fetchData();

        wsRef.current = new WebSocket(WS_ENDPOINT);

        wsRef.current.onopen = () => {
            console.log('WebSocket connected');
        };

        wsRef.current.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                if (!isInitialLoad.current) {
                    if (data.action === 'add') {
                        setTransactions((prevTransactions) => getUniqueTransactions([...prevTransactions, data.transaction]));
                    } else if (data.action === 'delete') {
                        setTransactions((prevTransactions) => prevTransactions.filter(transaction => transaction.id !== data.transaction.id));
                    } else if (data.action === 'edit') {
                        setTransactions((prevTransactions) =>
                            prevTransactions.map(transaction =>
                                transaction.id === data.transaction.id ? data.transaction : transaction
                            )
                        );
                    }
                }
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        };

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, []);

    useEffect(() => {
        calculateTotals();
    }, [transactions]);

    const getUniqueTransactions = (transactionsArray) => {
        const seen = new Set();
        return transactionsArray.filter(transaction => {
            const transactionString = JSON.stringify(transaction);
            return seen.has(transactionString) ? false : seen.add(transactionString);
        });
    };

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

    const calculateTotals = () => {
        const totals = transactions.reduce((acc, transaction) => {
            acc[transaction.type] = (acc[transaction.type] || 0) + parseFloat(transaction.price);
            return acc;
        }, {});

        setTotals({
            Buys: totals.Buys || 0,
            Incomes: totals.Incomes || 0,
            Expenses: totals.Expenses || 0,
            Debts: totals.Debts || 0,
            General: (totals.Incomes - totals.Expenses) || 0
        });
    };

    return (
        <div id="container" style={{ background: '#333', display: 'flex', flexDirection: 'column', gap: '5%', alignItems: 'center', justifyContent: 'center', padding: '0%' }}>
            <div ref={editRef} id="hidden-edit" style={{ position: 'absolute', background: 'rgba(0,0,0,0.8)', height: '100%', width: '100%', display: 'none', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            </div>
            <div id="content">
                <div id="results" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '5% 1fr 1fr 5%', gap: '0%', alignItems: 'start', justifyContent: 'center' }} className="results">
                    <div id="container-2" style={{ gridColumn: '1 / -1', gridRow: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '0.2fr 0fr 1fr', padding: '2%', gap: '2%' }}>
                        <FormPrincipal handleSubmit={handleSubmit} inputData={inputData} handleChange={handleChange} closeForm={closeForm}></FormPrincipal>
                        <Cash formatPrice={formatPrice} totals={totals} exchangeRate={exchangeRate} closeCash={closeCash}></Cash>
                        <Menu openForm={openForm} openCash={openCash}></Menu>
                        <div style={{gridRow:'2',gridColumn:'1', height:'100vh',display:'none'}}><Dollar enviarDato={recibirDato}></Dollar></div>
                        <div id="buys-container" style={{ gridRow: '1/4', gridColumn: '1/4'}}>
                            <TransactionList transactions={transactions} type="Buys" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT} />
                        </div>
                        <div id="debts-container" style={{ gridRow: '1/4', gridColumn: '1/4' }}>
                            <TransactionList transactions={transactions} type="Debts" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                        <div id="expenses-container" style={{ gridRow: '1/4', gridColumn: '1/4' }}>
                            <TransactionList transactions={transactions} type="Expenses" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                        <div id="incomes-container" style={{ gridRow: '1/4', gridColumn: '1/4'}}>
                            <TransactionList transactions={transactions} type="Incomes" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
