const Menu = ({ openForm, openCash }) => {
    const handleTransactionType = (type) => {
        const transactionTypes = ['incomes', 'expenses', 'buys', 'debts'];

        transactionTypes.forEach((transactionType) => {
            const transaction = document.getElementById(`${transactionType}-container`);
            if (transaction) {
                transaction.style.display = 'none';
            }
        });

        const selectedTransaction = document.getElementById(`${type}-container`);
        if (selectedTransaction) {
            selectedTransaction.style.display = 'grid';
        }
    };

    return (
        <div id="menu" style={{ background: '#232323', display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', height: '100vh', position: 'absolute', width: '22%', right: '0', top: '0' }}>
            <div id="bg-dark" style={{ background: 'rgba(0,0,0,.8)', position: 'absolute', width: '70vw', height: '100vh', display: 'none', right: '0' }}></div>
            <div style={{ width: '100%', textAlign: 'center', padding: '5%' }}><h6>Menú</h6></div>
            <img style={{ width: '60px', height: '60px', margin: '10%' }} src="money.png" alt="money" />
            <div style={{ width: '100%' }}>
                <ul style={{ color: 'white' }}>
                    <li onClick={() => openForm('Nueva transacción')}>Nueva transacción</li>
                    <li onClick={() => openCash('Caja')}>Caja</li>
                    <li onClick={() => handleTransactionType('incomes')}>Ingresos</li>
                    <li onClick={() => handleTransactionType('expenses')}>Egresos</li>
                    <li onClick={() => handleTransactionType('buys')}>Compras</li>
                    <li onClick={() => handleTransactionType('debts')}>Deudas</li>
                </ul>
            </div>
        </div>
    );
};

export default Menu;
