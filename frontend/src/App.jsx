import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const ENDPOINT = 'https://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev'; // Ajusta el endpoint según tu configuración
const client = new W3CWebSocket(ENDPOINT.replace('https', 'wss') + '/ws');

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

    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${ENDPOINT}/transactions`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions', error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputData((prevInputData) => ({
            ...prevInputData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${ENDPOINT}/insertTransaction`, inputData);
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
    

    useEffect(() => {
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };

        client.onmessage = (message) => {
            const newTransaction = JSON.parse(message.data);
            setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
        };

        return () => client.close();
    }, []);

    return (
        <div id="container" style={{ background: '#333', width: '100%', display: 'flex', flexDirection: 'column', gap: '5%', alignItems: 'start', justifyContent: 'center', padding: '5%' }}>
            <form id="form-principal" onSubmit={handleSubmit} >
                <h1 style={{ color: '#fff' }}>Transacciones</h1>
                <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Description" />
                <input type="number" name="price" value={inputData.price} onChange={handleChange} placeholder="Price" />
                <input type="text" name="date" value={inputData.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" />
                <input type="text" name="importance" value={inputData.importance} onChange={handleChange} placeholder="Importance (Alta/Media/Baja)" />
                <input type="text" name="type" value={inputData.type} onChange={handleChange} placeholder="Type" />
                <input type="text" name="category" value={inputData.category} onChange={handleChange} placeholder="Category" />
                <input type="number" name="ready" value={inputData.ready} onChange={handleChange} placeholder="Ready (true/false)" />
                <input type="text" name="deadline" value={inputData.deadline} onChange={handleChange} placeholder="Deadline (YYYY-MM-DD)" />
                <button type="submit">Insert Transaction</button>
            </form>
            <div id="results" className="results">
                <h2 style={{ color: '#fff' }}>Transactions</h2>
                <ul style={{ color: '#fff' }}>
                    {transactions.map((transaction) => (
                        <li key={transaction.id}>
                            {transaction.description} - ${transaction.price} - {transaction.date}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
