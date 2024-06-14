import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const HTTP_ENDPOINT = 'https://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev';
const WS_ENDPOINT = 'wss://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev/ws';

const formatPrice = (price) => {
    return Number(price).toLocaleString('es-ES');
};

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

const TransactionList = ({ transactions, type, setTransactions }) => {
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
            <div style={{ background: getColor(type)[1], color: '#eee', margin: '4%' }}><h2>{type}</h2></div>
            {transactions.filter(transaction => transaction.type === type).map((transaction, index) => (
                <div id={transaction.id} key={index} style={{ background: getColor(transaction.type)[0], padding: '2%', margin: '2.5%', border: '5px solid ' + getColor(transaction.type)[1] }}>
                    <div><h6 style={{ color: 'black' }}>${formatPrice(transaction.price)}</h6></div>
                    <div><p>{transaction.description}</p></div>
                    <button style={{ background: 'grey' }} onClick={() => deleteTransaction(transaction.id)}>Borrar</button>
                </div>
            ))}
        </div>
    );
};

function App() {
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
                    <div style={{ gridColumn: '1 / -1', gridRow: '1 / -1', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '12% 1fr 1fr', padding: '2%', gap: '2%' }}>
                        <form id="form-principal" style={{ gridColumn: '1', gridRow: '1/-1' }} onSubmit={handleSubmit}>
                            <h1 style={{ color: '#fff' }}>Transacciones</h1>
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
                        <div style={{ background: 'white', color: 'black', height: 'auto', textAlign: 'left', paddingLeft: '5%', gridRow: '1', gridColumn: '4', display: 'flex', flexDirection: 'column' }}>
                            <div style={{ textAlign: 'center' }}><h4>Caja</h4></div>
                            <div style={{ display: 'grid', width: '100%', height: '100%', gridTemplateColumns: '1fr', justifyContent: 'center', alignItems: 'center', gap: '2%', overflow: 'auto' }}>
                                <div>
                                    <div> <p>Ingresos:<br /><span style={{ fontSize: '1rem', color: 'green' }}> <strong>$ {formatPrice(totals.Incomes)}</strong></span></p></div>
                                    <div> <p>Egresos:<br /><span style={{ fontSize: '1rem', color: 'red' }}> <strong>$ {formatPrice(totals.Expenses)}</strong></span></p></div>
                                    <div> <p>General<br /><span style={{ fontSize: '1rem' }}> <strong>$ {formatPrice(totals.General)}</strong></span></p></div>
                                </div>
                            </div>
                        </div>
                        <div id="buys-container" style={{ gridRow: '2', gridColumn: '2/ 4' }}>
                            <TransactionList transactions={transactions} type="Buys" setTransactions={setTransactions} />
                        </div>
                        <div id="incomes-container" style={{ gridRow: '2', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Incomes" setTransactions={setTransactions} />
                        </div>
                        <div id="expenses-container" style={{ gridRow: '3', gridColumn: '4' }}>
                            <TransactionList transactions={transactions} type="Expenses" setTransactions={setTransactions} />
                        </div>
                        <div id="debts-container" style={{ gridRow: '3', gridColumn: '2/4' }}>
                            <TransactionList transactions={transactions} type="Debts" setTransactions={setTransactions} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
