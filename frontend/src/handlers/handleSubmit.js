import axios from 'axios';
import getUniqueTransactions from '../utils/getUniqueTransactions'; // Asumiendo que tienes una función para obtener transacciones únicas

export const handleSubmit = async (e, inputData, setInputData, setTransactions, HTTP_ENDPOINT) => {
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
