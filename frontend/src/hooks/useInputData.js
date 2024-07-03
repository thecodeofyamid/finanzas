// src/hooks/useInputData.js
import { useState } from 'react';

export const useInputData = () => {
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

    return {
        inputData,
        setInputData,
    };
};
