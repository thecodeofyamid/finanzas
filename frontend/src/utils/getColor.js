export const getColor = (type) => {
    switch (type) {
        case 'Buys':
            return ['#eeeeee', 'blue'];
        case 'Incomes':
            return ['#eeeeee', 'green'];
        case 'Expenses':
            return ['#eeeeee', 'red'];
        case 'Debts':
            return ['#eeeeee', 'orange'];
        default:
            return ['black', 'black'];
    }
};
