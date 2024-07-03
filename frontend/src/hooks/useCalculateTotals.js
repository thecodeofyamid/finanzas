// src/hooks/useCalculateTotals.js
import { useEffect } from 'react';

export const useCalculateTotals = (transactions, setTotals) => {
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

    useEffect(() => {
        calculateTotals();
    }, [transactions, setTotals]);

    return calculateTotals;
};
