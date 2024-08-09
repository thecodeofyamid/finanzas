import { useEffect } from 'react';

const useCalculateTotals = (transactions, setTotals) => {
  const calculateTotals = () => {
    const totals = transactions.reduce((acc, transaction) => {
      acc[transaction.type] = (acc[transaction.type] || 0) + parseFloat(transaction.price);
      return acc;
    }, {});
    // Calcular si hay alguna deuda lista
    const totalDebts = transactions
      .filter(transaction => transaction.type === 'Debts' && transaction.ready === 1)
      .reduce((sum, transaction) => sum + parseFloat(transaction.price), 0);

    // Calcular si hay alguna compra lista
    const totalBuys = transactions
      .filter(transaction => transaction.type === 'Buys' && transaction.ready === 1)
      .reduce((sum, transaction) => sum + parseFloat(transaction.price), 0);

    const general = (totals.Incomes || 0) - (totals.Expenses || 0) - totalDebts - totalBuys;

    setTotals({
      Buys: totalBuys || 0,
      Incomes: totals.Incomes || 0,
      Expenses: totals.Expenses || 0,
      Debts: totals.Debts || 0,
      General: general
    });
  };

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      calculateTotals();
    }
  }, [transactions]);
};

export default useCalculateTotals;
