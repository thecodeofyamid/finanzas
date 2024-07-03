const formatPrice = (price) => {
    if (price === null) {
      return 'Cargando...';
    }
  
    // Formatear el precio con puntos de mil como comas y punto decimal
    return parseFloat(price).toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    });
  };
  
  export default formatPrice;
  