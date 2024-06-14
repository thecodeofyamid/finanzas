// TransactionContainer.jsx
import React from 'react';

const TransactionContainer = ({ transactions, type, getColor, formatPrice }) => {
    return (
        <div id={`${type.toLowerCase()}-container`} style={{ gridRow: '2', gridColumn: type === 'Buys' ? '1 / 3' : '3' }}>
            {transactions
                .filter(transaction => transaction.type === type)
                .map((transaction, index) => (
                    <div key={index} style={{ background: getColor(transaction.type), padding: '2%', margin: '5%' }}>
                        <div><h6>${formatPrice(transaction.price)}</h6></div>
                        <div><p>{transaction.description}</p></div>
                    </div>
                ))}
        </div>
    );
};

export default TransactionContainer;
