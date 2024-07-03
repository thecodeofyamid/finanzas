import axios from 'axios';

export const handleSubmitEditForm = async (e, id, setTransactions, HTTP_ENDPOINT, exitEdit) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const editedData = Object.fromEntries(formData.entries());

    try {
        const response = await axios.put(`${HTTP_ENDPOINT}/edit/${id}`, editedData);
        const updatedTransaction = response.data.transaction;

        setTransactions(prevTransactions =>
            prevTransactions.map(transaction =>
                transaction.id === updatedTransaction.id ? updatedTransaction : transaction
            )
        );
        alert("Registro modificado con éxito ");
        exitEdit(); // Cerrar el formulario de edición
    } catch (error) {
        console.error('Error editing transaction:', error);
        alert('Error editing transaction. Please try again.');
    }
};
