// src/utils/fetchData.js
import axios from 'axios';

const fetchData = async (HTTP_ENDPOINT) => {
    try {
        const response = await axios.get(`${HTTP_ENDPOINT}/transactions`);
        return response.data;
    } catch (error) {
        console.error('Error fetching transactions', error);
        return [];
    }
};

export default fetchData;