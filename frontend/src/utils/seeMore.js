// seeMore.js
const seeMore = (transaction, setEditingTransaction, editRef,handleSubmitEditForm, getColor) => {
    setEditingTransaction(transaction);

    if (editRef.current) {
        const transactionHTML = `
            <div id="edit-box" style="background: white; width: 80%; padding:2%; border: 5px solid ${getColor(transaction.type)[1]}; background: ${getColor(transaction.type)[1]}; color: white">
                <div><h4>Información del producto</h4></div>
                <form id="form-edit">
                    <label style='color:white'>Descripción:</label>
                    <input type='text' name='description' value='${transaction.description}'>
                    <label style='color:white'>Fecha:</label>
                    <input type='date' name='date' value='${transaction.date}'>
                    <label style='color:white'>Precio:</label>
                    <input type='number' name='price' value='${transaction.price}'>
                    <input type='submit' style="background: #333; border: none" value="Submit">
                    <input id='exit-button' type='button' style="background: #333; border: none;" value="Exit">
                </form>
            </div>`;

        editRef.current.innerHTML = transactionHTML;
        editRef.current.style.display = 'flex';

        document.getElementById('exit-button').addEventListener('click', () => exitEdit(setEditingTransaction, editRef));

        const formEdit = document.getElementById('form-edit');
        formEdit.addEventListener('submit', (e) => handleSubmitEditForm(e, transaction.id));
    }
};

const exitEdit = (setEditingTransaction, editRef) => {
    setEditingTransaction(null);
    if (editRef.current) {
        editRef.current.style.display = 'none';
    }
};

export default seeMore;
