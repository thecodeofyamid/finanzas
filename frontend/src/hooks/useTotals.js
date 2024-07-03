// src/hooks/useTotals.js
import { useState } from 'react';

export const useTotals = () => {
    const [totals, setTotals] = useState({
        Buys: 0,
        Incomes: 0,
        Expenses: 0,
        Debts: 0,
        General: 0
    });

    return {
        totals,
        setTotals,
    };
};
