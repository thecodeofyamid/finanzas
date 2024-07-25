import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TransactionList = ({
  transactions,
  type,
  setTransactions,
  exchangeRate,
  onSeeMore,
  getColor,
  formatPrice,
  HTTP_ENDPOINT
}) => {
  
  const [checkedItems, setCheckedItems] = useState({});

  // Función para inicializar checkedItems basado en transactions
  useEffect(() => {
    const initialCheckedItems = {};
    transactions.forEach(transaction => {
      initialCheckedItems[transaction.id] = transaction.ready === 1;
    });
    setCheckedItems(initialCheckedItems);
  }, [transactions]);

  const checkBuysOrDebts = async (event, id, type) => {
    const isChecked = event.target.checked;
    setCheckedItems(prevCheckedItems => ({
      ...prevCheckedItems,
      [id]: isChecked
    }));

    try {
      const state = isChecked ? 1 : 0;
      const response = await axios.post(`${HTTP_ENDPOINT}/ready/${type}/${id}/${state}`);
      if (response.data.transaction) {
        const updatedTransactions = transactions.map(transaction =>
          transaction.id === id ? { ...transaction, ready: state } : transaction
        );
        setTransactions(updatedTransactions);
        if (isChecked) {
          alert(type === 'Buys' ? `Compra #${id} realizada!` : `Deuda #${id} saldada con éxito!`);
        } else {
          alert(type === 'Buys' ? `La compra #${id} se canceló` : `Pago de la deuda #${id} cancelada con éxito!`);
        }
      }
    } catch (error) {
      console.error('Error updating transaction state:', error);
      alert('Error actualizando el estado de la transacción. Por favor, intenta de nuevo.');
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const response = await axios.post(`${HTTP_ENDPOINT}/delete_transaction`, { id });
      if (response.data.transaction) {
        const updatedTransactions = transactions.filter(transaction => transaction.id !== id);
        setTransactions(updatedTransactions);
        alert('Transaction deleted successfully');
      } else {
        alert('Transaction not found');
      }
    } catch (error) {
      console.error('Error deleting transaction:', error);
      alert('Error deleting transaction. Please try again.');
    }
  };

  // Filtra las transacciones por el tipo seleccionado
  const filteredTransactions = transactions.filter(transaction => transaction.type === type);

  return (
    <div>
      <div style={{ background: getColor(type)[1], color: '#eee', margin: '2%', borderRadius: '10px' }}>
        <h3>{type}</h3>
      </div>
      {
        filteredTransactions.length === 0 ? (
          <div style={{width:'100%',textAlign:'center', height:'100vh',display:'flex', flexDirection:'column',justifyContent:'center',alignItems:'center'}}>
            <h1>No hay transacciones</h1>
            <div style={{width:'250px', padding:'2%'}}>
              <img src="/sad.png"></img>  
            </div>
          </div>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <div
              id={transaction.id}
              key={index}
              style={{
                background: getColor(transaction.type)[0],
                padding: '2%',
                margin: '2.5%',
                border: '5px solid ' + getColor(transaction.type)[1],
                borderRadius: '5px'
              }}
            >
              {transaction.type === 'Incomes' && (
                <div>
                  <div style={{width:'100%',display:'flex', justifyContent:'center'}}><p style={{fontSize:'1rem', fontWeight:'bold'}}>{transaction.description}</p></div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div style={{marginRight:'5px', fontWeight:'bold'}}><p>COP: </p></div>
                      <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[1]}</h6></div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div style={{marginRight:'5px',fontWeight:'bold'}}><p>USD:</p></div>
                      <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[0]}</h6></div>
                    </div>
                    <div>
                      <h6 style={{color:`${getColor(transaction.type)[1]}`}}>{transaction.date}</h6>
                    </div>
                  </div>
                </div>
              )}
              {transaction.type === 'Expenses' && (
                <div>
                  <div style={{width:'100%',display:'flex', justifyContent:'center'}}><p style={{fontSize:'1rem', fontWeight:'bold'}}>{transaction.description}</p></div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div style={{marginRight:'5px', fontWeight:'bold'}}><p>COP: </p></div>
                      <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[1]}</h6></div>
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div style={{marginRight:'5px',fontWeight:'bold'}}><p>USD:</p></div>
                      <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[0]}</h6></div>
                    </div>
                    <div>
                        <h6 style={{color:`${getColor(transaction.type)[1]}`}}>{transaction.date}</h6>
                    </div>
                  </div>
                </div>
              )}
              {transaction.type === 'Debts' && (
                <div>
                <div style={{width:'100%',display:'flex', justifyContent:'center'}}><p style={{fontSize:'1rem', fontWeight:'bold'}}>{transaction.description}</p></div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{marginRight:'5px', fontWeight:'bold'}}><p>COP: </p></div>
                    <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[1]}</h6></div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{marginRight:'5px',fontWeight:'bold'}}><p>USD:</p></div>
                    <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[0]}</h6></div>
                  </div>
                  <div>
                    <h6 style={{ color: getColor(transaction.type)[1] }}>
                    Listo: <input className="checks-debts" type="checkbox" id={`check-${transaction.id}`} name="check_debt"
                                  onChange={(event) => { checkBuysOrDebts(event, transaction.id, transaction.type) }}
                                  checked={checkedItems[transaction.id] || false}></input>
                    </h6>
                  </div>
                </div>
                <div>
                    <h6 style={{color:`${getColor(transaction.type)[1]}`}}>{transaction.date}</h6>
                </div>
                </div>
              )}
              {transaction.type === 'Buys' && (
                <div>
                <div style={{width:'100%',display:'flex', justifyContent:'center'}}><p style={{fontSize:'1rem', fontWeight:'bold'}}>{transaction.description}</p></div>
                <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{marginRight:'5px', fontWeight:'bold'}}><p>COP: </p></div>
                    <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[1]}</h6></div>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <div style={{marginRight:'5px',fontWeight:'bold'}}><p>USD:</p></div>
                    <div><h6 style={{color:`${getColor(transaction.type)[1]}`,fontWeight:'bold'}}>{formatPrice(transaction.price, exchangeRate)[0]}</h6></div>
                  </div>
                  <div>
                    <h6 style={{ color: getColor(transaction.type)[1] }}>
                    Listo: <input className="checks-debts" type="checkbox" id={`check-${transaction.id}`} name="check_debt"
                                  onChange={(event) => { checkBuysOrDebts(event, transaction.id, transaction.type) }}
                                  checked={checkedItems[transaction.id] || false}></input>
                    </h6>
                  </div>
                </div>
                <div>
                    <h6 style={{color:`${getColor(transaction.type)[1]}`}}>{transaction.date}</h6>
                </div>
              </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'left', gap: '3%' }}>
                <button style={{ background: 'grey', border: 'none', padding: '1%' }}
                        onClick={() => deleteTransaction(transaction.id)}>Borrar</button>
                <button style={{ background: getColor(transaction.type)[1], border: 'none', padding: '1%' }}
                        onClick={() => onSeeMore(transaction)}>Ver más</button>
              </div>
            </div>
          ))
        )
      }
    </div>
  );
};

export default TransactionList;
