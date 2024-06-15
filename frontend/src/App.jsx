import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import Dollar from './assets/components/Dollar';

const HTTP_ENDPOINT = 'http://192.168.18.141:4000';
const WS_ENDPOINT = 'ws://192.168.18.141:4000';

const getColor = (type) => {
    switch (type) {
        case 'Buys':
            return ['#eeeeee', 'blue'];
        case 'Incomes':
            return ['#d9d9d9', 'green'];
        case 'Expenses':
            return ['#eeeeee', 'red'];
        case 'Debts':
            return ['#d9d9d9', 'orange'];
        default:
            return ['black', 'black'];
    }
};

const formatPrice = (priceCOP, exchangeRate) => {
    if (exchangeRate === null) {
        return 'Cargando...';
    }
    const priceUSD = priceCOP / exchangeRate;
    return priceUSD.toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
    });
};

const TransactionList = ({ transactions, type, setTransactions, exchangeRate }) => {
    const deleteTransaction = async (id) => {
        try {
            const response = await axios.post(`${HTTP_ENDPOINT}/delete_transaction`, { id });
            if (response.data.transaction) {
                const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
                setTransactions(updatedTransactions);
                alert('Transaction deleted successfully');
            } else {
                alert('Transaction not found');
            }
        } catch (error) {
            console.error('Error deleting transaction:', error);
            alert('Error deleting transaction. Please try again.');
        }
    };

    return (
        <div>
            <div style={{ background: getColor(type)[1], color: '#eee', margin: '4%', borderRadius: '10px'}}><h2>{type}</h2></div>
            {transactions.filter(transaction => transaction.type === type).map((transaction, index) => (
                <div id={transaction.id} key={index} style={{ background: getColor(transaction.type)[0], padding: '2%', margin: '2.5%', border: '5px solid ' + getColor(transaction.type)[1], borderRadius: '5px'}}>
                    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', alignItems:'center', justifyContent:'center'}}>
                        <div><p style={{fontSize:'0.9rem'}}>{transaction.description}</p></div>
                        <div><h6 style={{ color: 'black', textAlign:'right',paddingRight: '5%' }}>{formatPrice(transaction.price, exchangeRate)}</h6></div>
                    </div>
                    <button style={{ background: 'grey' }} onClick={() => deleteTransaction(transaction.id)}>Borrar</button>
                </div>
            ))}
        </div>
    );
};

function App() {
    const [exchangeRate, setExchangeRate] = useState(null);

    const recibirDato = (datoRecibido) => {
        console.log(`Dato del dolar: ${datoRecibido}`);
        setExchangeRate(datoRecibido);
    };

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
    const [transactions, setTransactions] = useState([]);
    const isInitialLoad = useRef(true);
    const wsRef = useRef(null);

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
        <div id="container" style={{ background: '#333', display: 'flex', flexDirection: 'flex', gap: '5%', alignItems: 'start', justifyContent: 'center', padding: '0%' }}>
            <div id="content">
                <div id="results" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '5% 1fr 1fr 1fr', gap: '0%', alignItems: 'start', justifyContent: 'center' }} className="results">
                    <div id="container-2" style={{ gridColumn: '1 / -1', gridRow: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '0.2fr 1fr 1fr', padding: '2%', gap: '2%' }}>
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
                                <div id="button-submit" style={{ width: '100%' }}><button type="submit">Insert Transaction</button></div>
                            </div>
                        </form>
                        <div id="cash-container" style={{ background: 'white', color: 'black', height: 'auto', textAlign: 'left', paddingLeft: '0%', gridRow: '2', gridColumn: '4', display: 'flex', flexDirection: 'column', borderRadius: '10px' }}>
                            <div><h2>Cash</h2></div>
                            <div style={{ display: 'grid', width: 'auto', height: '100%', gridTemplateColumns: '1fr', justifyContent: 'start', alignItems: 'start', gap: '2%', overflow: 'auto', padding: '4%' }}>
                                <div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', borderBottom: '1px solid black', width: '100%', paddingLeft: '4%' }}>
                                        <div>
                                            <p style={{ fontSize: '1.1rem' }}>Ingresos :</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><span style={{ fontSize: '1.2rem', color: 'green' }}> <strong>{formatPrice(totals.Incomes, exchangeRate)}</strong></span></p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', paddingLeft: '4%', borderBottom: '1px solid black', width: '100%' }}>
                                        <div>
                                            <p style={{ fontSize: '1.1rem' }}>Egresos :</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p><span style={{ fontSize: '1.2rem', color: 'red' }}> <strong>{formatPrice(totals.Expenses, exchangeRate)}</strong></span></p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', justifyContent: 'center', gap: '20%', width: '100%', paddingLeft: '4%' }}>
                                        <div><p style={{ fontSize: '1.1rem' }}>General :</p></div>
                                        <div style={{ textAlign: 'right' }}><p><span style={{ fontSize: '1.2rem' }}> <strong>{formatPrice(totals.General, exchangeRate)}</strong></span></p></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Dollar enviarDato={recibirDato}></Dollar>
                        <div id="buys-container" style={{ gridRow: '2', gridColumn: '2/ 4' }}>
                            <TransactionList transactions={transactions} type="Buys" setTransactions={setTransactions} exchangeRate={exchangeRate} />
                        </div>
                        <div id="incomes-container" style={{ gridRow: '3', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Incomes" setTransactions={setTransactions} exchangeRate={exchangeRate} />
                        </div>
                        <div id="expenses-container" style={{ gridRow: '4', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Expenses" setTransactions={setTransactions} exchangeRate={exchangeRate} />
                        </div>
                        <div id="debts-container" style={{ gridRow: '3', gridColumn: '2/4' }}>
                            <TransactionList transactions={transactions} type="Debts" setTransactions={setTransactions} exchangeRate={exchangeRate} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;

