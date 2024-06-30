import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import Dollar from './assets/components/Dollar';
import TransactionList from './assets/components/TransactionList';

const HTTP_ENDPOINT = 'http://192.168.1.20:4000';
const WS_ENDPOINT = 'ws://192.168.1.20:4000';

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
                        <form id="form-principal" style={{ gridColumn: '1', gridRow: '1/-1' }} onSubmit={handleSubmit}>
                            <h2 style={{ color: '#fff' }}>Transaction</h2>
                            <div id="form-home">
                                <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Description" />
                                <input type="text" name="price" value={inputData.price} onChange={handleChange} placeholder="Price" />
                                <input type="text" name="date" value={inputData.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" />
                                <input type="text" name="importance" value={inputData.importance} onChange={handleChange} placeholder="Importance (Alta/Media/Baja)" />
                                <input type="text" name="type" value={inputData.type} onChange={handleChange} placeholder="Type" />
                                <input type="text" name="category" value={inputData.category} onChange={handleChange} placeholder="Category" />
                                <input type="number" name="ready" value={inputData.ready} onChange={handleChange} placeholder="Ready (true/false)" />
                                <input type="text" name="deadline" value={inputData.deadline} onChange={handleChange} placeholder="Deadline (YYYY-MM-DD)" />
                                <div id="button-submit" style={{ width: '100%', border:'none' }}><button type="submit">Insert Transaction</button></div>
                            </div>
                        </form>
                        <div id="cash-container" style={{ background: 'white', color: 'black', height: '50vh', textAlign: 'left', padding: '0%', gridRow: '2', gridColumn: '4', display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
                            <div><h2>Cash</h2></div>
                            <div style={{ display: 'grid', width: 'auto', height: '100%', gridTemplateColumns: '1fr', justifyContent: 'start', alignItems: 'start', gap: '2%', overflow: 'auto', padding: '4%' }}>
                                <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', borderBottom: '1px solid black', width: '100%', paddingLeft: '4%' }}>
                                        <div>
                                            <p style={{ fontSize: '1.1rem' }}>Ingresos :</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><span style={{ fontSize: '1.05rem', color: 'green' }}> <strong>{formatPrice(totals.Incomes, exchangeRate)[1]}</strong></span></p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', paddingLeft: '4%', borderBottom: '1px solid black', width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: '1.1rem' }}>Egresos :</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><span style={{ fontSize: '1.05rem', color: 'red' }}> <strong>{formatPrice(totals.Expenses, exchangeRate)[1]}</strong></span></p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', width: '100%', paddingLeft: '4%' }}>
                                        <div><p style={{ fontSize: '1.1rem' }}>General :</p></div>
                                        <div style={{ textAlign: 'right' }}><p><span style={{ fontSize: '1.05rem' }}> <strong>{formatPrice(totals.General, exchangeRate)[1]}</strong></span></p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Dollar enviarDato={recibirDato}></Dollar>
                        <div id="buys-container" style={{ gridRow: '3', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Buys" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT} />
                        </div>
                        <div id="incomes-container" style={{ gridRow: '1/4', gridColumn: '2/4' }}>
                            <TransactionList transactions={transactions} type="Incomes" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                        <div id="expenses-container" style={{ gridRow: '-1', gridColumn: '2/4' }}>
                            <TransactionList transactions={transactions} type="Expenses" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                        <div id="debts-container" style={{ gridRow: '4', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Debts" setTransactions={setTransactions} exchangeRate={exchangeRate} onSeeMore={seeMore} getColor={getColor} formatPrice={formatPrice} HTTP_ENDPOINT={HTTP_ENDPOINT}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
