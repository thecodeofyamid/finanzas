export const handleChange = (e, setInputData) => {
    const { name, value } = e.target;

    if (name === 'price') {
        const formattedPrice = value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        setInputData((prevInputData) => ({
            ...prevInputData,
            [name]: formattedPrice
        }));
    } else {
        setInputData((prevInputData) => ({
            ...prevInputData,
            [name]: value
        }));
    }
};
