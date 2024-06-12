import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HTTP_ENDPOINT = 'https://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev';
const WS_ENDPOINT = 'wss://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev/ws';

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
                const response = await axios.get(`${HTTP_ENDPOINT}/transactions`);
                setTransactions(response.data);
            } catch (error) {
                console.error('Error fetching transactions', error);
            }
        };
        fetchData();

        const ws = new WebSocket(WS_ENDPOINT);

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (message) => {
            try {
                const data = JSON.parse(message.data);
                setTransactions((prevTransactions) => [...prevTransactions, data]);
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        };

        return () => {
            ws.close();
        };
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
            await axios.post(`${HTTP_ENDPOINT}/add_transactions`, inputData);
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

    return (
        <div id="container" style={{ background: '#333', display: 'flex', flexDirection: 'flex', gap: '5%', alignItems: 'start', justifyContent: 'center', padding: '0%' }}>
            <div id="content">
                <div id="results" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr 1fr', gridTemplateRows:'5% 1fr 1fr 1fr', gap:'3%', alignItems: 'start',justifyContent:'center'}} className="results">
                <form id="form-principal" style={{gridColumn: '1', gridRow:'1 / -1'}} onSubmit={handleSubmit} >
                    <h1 style={{ color: '#fff' }}>Transacciones</h1>
                    <div id="form-home">
                        <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Description" />
                        <input type="number" name="price" value={inputData.price} onChange={handleChange} placeholder="Price" />
                        <input type="text" name="date" value={inputData.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" />
                        <input type="text" name="importance" value={inputData.importance} onChange={handleChange} placeholder="Importance (Alta/Media/Baja)" />
                        <input type="text" name="type" value={inputData.type} onChange={handleChange} placeholder="Type" />
                        <input type="text" name="category" value={inputData.category} onChange={handleChange} placeholder="Category" />
                        <input type="number" name="ready" value={inputData.ready} onChange={handleChange} placeholder="Ready (true/false)" />
                        <input type="text" name="deadline" value={inputData.deadline} onChange={handleChange} placeholder="Deadline (YYYY-MM-DD)" />
                        <div id="button-submit"style={{width:'100%'}}><button type="submit">Insert Transaction</button></div>
                    </div>
                </form>
                            <h2 className="title-results" style={{ color: '#fff', gridRow:'1',gridColumn:'2/-1',width:'100%', textAlign: 'center', padding:'0' }}>Transactions</h2>
                            {transactions.map((transaction, index) => (
                            <div class="transactions" key={index}>
                                <h5 style={{background:'white',color:'black', width:'30px', display:'flex',justifyContent:'center', borderRadius:'50%'}}>{index+1}</h5>
                                <h6 style={{padding: '5% 0'}}>{transaction.description}</h6>
                                <h6 style={{padding: '2.5% 0',background:'green', borderRadius: '10px', textAlign:'center'}}>${transaction.price}</h6>
                                <p>Categoría: {transaction.category}</p>
                                <p>Tipo: {transaction.type}</p>
                                <p>Fecha: {transaction.date}</p>
                                <p>Importancia: {transaction.importance}</p>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
}

export default App;
