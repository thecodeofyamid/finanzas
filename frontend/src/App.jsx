// Frontend (React)
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';

const ENDPOINT = 'https://potential-robot-jjj6j66p5vpw3vv7-4000.app.github.dev';

function App() {
    const [inputData, setInputData] = useState({
        description: '',
        price: '',
        date: '',
        importance: '',
        type: '',
        category: '',
        ready: '',
        deadline: '',
        userId: ''
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
                deadline: '',
                userId: ''
            });
        } catch (error) {
            console.error('Error inserting transaction', error);
        }
    };

    useEffect(() => {
        const socket = socketIOClient(ENDPOINT);
        socket.on('transactionInserted', (newTransaction) => {
            setTransactions((prevTransactions) => [...prevTransactions, newTransaction]);
        });
    }, []);

    return (
        <div id="container" style={{background:'#333',width:'100%', display:'flex', flexDirection:'flex', gap:'5%',alignItems:'start',justifyContet:'center',padding:'5%'}}>
            <form id="form-principal" onSubmit={handleSubmit} >
                <h1>Transacciones</h1>
                <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Description" />
                <input type="number" name="price" value={inputData.price} onChange={handleChange} placeholder="Price" />
                <input type="text" name="date" value={inputData.date} onChange={handleChange} placeholder="Date" />
                <input type="text" name="importance" value={inputData.importance} onChange={handleChange} placeholder="Importance" />
                <input type="text" name="type" value={inputData.type} onChange={handleChange} placeholder="Type" />
                <input type="text" name="category" value={inputData.category} onChange={handleChange} placeholder="Category" />
                <input type="text" name="deadline" value={inputData.deadline} onChange={handleChange} placeholder="Deadline" />
                <button type="submit">Insert Transaction</button>
            </form>
            <div id="results" className="results">
              <h2>Transactions</h2>
              <ul>
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
