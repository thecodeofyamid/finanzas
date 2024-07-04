export const formatPrice = (priceCOP, exchangeRate) => {
    if (exchangeRate === null) {
        return ['Cargando...', 'Cargando...'];
    }
    const priceUSD = priceCOP / exchangeRate;
    const priceColombia = priceCOP;
    return [
        priceUSD.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
        }),
        priceColombia.toLocaleString('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 2,
        })
    ];
};

