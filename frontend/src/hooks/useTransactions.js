// src/hooks/useTransactions.js
import { useState } from 'react';

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);

    return {
        transactions,
        setTransactions,
        editingTransaction,
        setEditingTransaction,
    };
};
