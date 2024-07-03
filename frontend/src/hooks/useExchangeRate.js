// src/hooks/useExchangeRate.js
import { useState } from 'react';

export const useExchangeRate = () => {
    const [exchangeRate, setExchangeRate] = useState(null);

    return {
        exchangeRate,
        setExchangeRate,
    };
};
