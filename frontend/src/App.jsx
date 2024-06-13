//Importar bibliotecas
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

//Definir endpoints http y websocket(ws) en local
const HTTP_ENDPOINT = 'http://192.168.18.141:4000';
const WS_ENDPOINT = 'ws://192.168.18.141:4000/';

//Funcion para construir la interfaz principal de la aplicación
function App() {
    //Funcion para formatear precios
    const formatPrice = (price) => {
        return Number(price).toLocaleString('es-ES');
    };
    //Funcion para obtener color de acuerdo al tipo de transacción
    const getColor = (type) => {
        switch (type) {
            case 'Buys':
                return 'blue';
            case 'Incomes':
                return 'green';
            case 'Expenses':
                return '#ff5100';
            case 'Debts':
                return '#c90202';
            default:
                return 'black';
        }
    };

    //Funcion para evitar duplicación de transacciones
    const getUniqueTransactions = (transactionsArray) => {
        const seen = new Set(); //Esto es un Set o colección de valores únicos vacia inicialmente

        //iterar sobre el array que es pasado inicialmente como argumento de la función
        return transactionsArray.filter(transaction => {
            
            //transaction se convierte en un String
            const transactionString = JSON.stringify(transaction);

            //Operador ternario: si seen ya tiene la transacción la transacción no se incluye en el array
            // si no la transacción se incluye en el array
            //la función retorna seen = colección de valores únicos.
            return seen.has(transactionString) ? false : seen.add(transactionString);
        });
    };

    //Función para borrar los contenedores de cada tipo de transacción
    const clearContainers = () => {
        document.getElementById('buys-container').innerHTML = '';
        document.getElementById('debts-container').innerHTML = '';
        document.getElementById('incomes-container').innerHTML = '';
        document.getElementById('expenses-container').innerHTML = '';
    };

    //Función para clasificar las transacciones por tipo
    const clasificationTypes = (transaction) => {

        //mapa = estructura de datos que asocia claves únicas a valores, permitiendo un acceso eficiente a los valores a través de sus claves. Creamos containerIdMap para asociar cada tipo de transacción a un elemento en HTML por su div.
        const containerIdMap = {
            Buys: 'buys-container',
            Debts: 'debts-container',
            Incomes: 'incomes-container',
            Expenses: 'expenses-container'
        };

        //Obtenemos el container correspondiente de acuerdo al tipo de transacción recibido
        const containerId = containerIdMap[transaction.type];
        if (containerId) {
            const container = document.getElementById(containerId);
            if (container) {
                //creamos un elemento div para el contenido del contenedor xd
                const div = document.createElement('div');
                div.innerHTML = `
                <div style="background:${getColor(transaction.type)}; padding: 2%; margin: 5%;">
                    <div><h6>$${formatPrice(transaction.price)}</h6></div>
                    <div><p>${transaction.description}</p></div>
                </div>
                `;
                //Agregar el contenido como hijo al contenedor
                container.appendChild(div);
            }
        }
    };


    const [inputData, setInputData] = useState({
        description: '',
        price: '',
        date: '',
        importance: '',
        type: '',
        category: '',
        ready: '',
        deadline: ''
    });
    
    //Mantener el estado del array transactions
    const [transactions, setTransactions] = useState([]);

    //verificar y actualizar si es la primera vez que se carga el componente, ayudando a evitar la duplicación de transacciones durante la inicialización y la recepción de mensajes del WebSocket.
    const isInitialLoad = useRef(true);

    //Referencia mutable al WebSocket, inicialmente sin conexión.
    const wsRef = useRef(null);


    useEffect(() => {

        //Obtener las transacciones del servidor
        const fetchData = async () => {
            try {
                const response = await axios.get(`${HTTP_ENDPOINT}/transactions`);
                const uniqueTransactions = getUniqueTransactions(response.data); //llamar a getUniqueTransaction para evitar duplicados
                setTransactions(uniqueTransactions); //Actualizar el estado de las transacciones
                clearContainers(); //limpiar contenedores existentes
                uniqueTransactions.forEach(transaction => {
                    clasificationTypes(transaction);
                }); // Clasificar y mostrar transacciones
                isInitialLoad.current = false; //inidca que la carga inicial ha terminado, para evitar la duplicidad
            } catch (error) {
                console.error('Error fetching transactions', error);
            }
        };
        fetchData();
        
        //Configuración de WebSocket
        wsRef.current = new WebSocket(WS_ENDPOINT); //Abrir WebSocket con la URL especificada en WS_ENDPOINT

        //Conexión WS abierta éxitosamente
        wsRef.current.onopen = () => {
            console.log('WebSocket connected');
        };
        //Recibir mensaje de WS
        wsRef.current.onmessage = (message) => {
            try {
                //mensaje que se parsea como JSON y se guarda en una variable data 
                const data = JSON.parse(message.data);
                //Verificar si no es la carga inicial, si así es se actualiza el estado de transacciones, se limpian los contenedores, y se clasifican las transacciones.
                if (!isInitialLoad.current) {
                    setTransactions((prevTransactions) => {
                        //Lista de transacciones unicas
                        const newTransactions = getUniqueTransactions([...prevTransactions, data]);
                        //borrar el contenedor
                        clearContainers();
                        //clasificar transacciones
                        newTransactions.forEach(transaction => {
                            clasificationTypes(transaction);
                        });
                        return "transaction"+newTransactions;
                    });
                }
            } catch (error) {
                console.error('Error parsing JSON data:', error);
            }
        };
        //Función de limpieza
        return () => {
            //Si wsRef.current no es null, es decir si existe, se cierra la conexión.
            if (wsRef.current) {
                wsRef.current.close(); //Cerrar la conexión WS cuando el componente se desmonte para evitar fugas de memoria
            }
        };
    }, []);

    const handleChange = (e) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const inputDataCopy = { ...inputData, price: inputData.price.replace(/\./g, '') };

        try {
            const response = await axios.post(`${HTTP_ENDPOINT}/add_transactions`, inputDataCopy);
            const newTransaction = response.data;
            setTransactions((prevTransactions) => {
                const newTransactions = getUniqueTransactions([...prevTransactions, newTransaction]);
                clearContainers();
                newTransactions.forEach(transaction => {
                    clasificationTypes(transaction);
                });
                return newTransactions;
            });
            setInputData({
                description: '',
                price: '',
                date: '',
                importance: '',
                type: '',
                category: '',
                ready: '',
                deadline: ''
            });
        } catch (error) {
            console.error('Error inserting transaction', error);
            alert('Error inserting transaction. Please check your data and try again.');
        }
    };

    return (
        <div id="container" style={{ background: '#333', display: 'flex', flexDirection: 'flex', gap: '5%', alignItems: 'start', justifyContent: 'center', padding: '0%' }}>
            <div id="content">
                <div id="results" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridTemplateRows: '5% 1fr 1fr 1fr', gap: '3%', alignItems: 'start', justifyContent: 'center' }} className="results">
                    <form id="form-principal" style={{ gridColumn: '1', gridRow: '1 / -1' }} onSubmit={handleSubmit} >
                        <h1 style={{ color: '#fff' }}>Transacciones</h1>
                        <div id="form-home">
                            <input type="text" name="description" value={inputData.description} onChange={handleChange} placeholder="Description" />
                            <input type="text" name="price" value={inputData.price} onChange={handleChange} placeholder="Price" />
                            <input type="text" name="date" value={inputData.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" />
                            <input type="text" name="importance" value={inputData.importance} onChange={handleChange} placeholder="Importance (Alta/Media/Baja)" />
                            <input type="text" name="type" value={inputData.type} onChange={handleChange} placeholder="Type" />
                            <input type="text" name="category" value={inputData.category} onChange={handleChange} placeholder="Category" />
                            <input type="number" name="ready" value={inputData.ready} onChange={handleChange} placeholder="Ready (true/false)" />
                            <input type="text" name="deadline" value={inputData.deadline} onChange={handleChange} placeholder="Deadline (YYYY-MM-DD)" />
                            <div id="button-submit" style={{ width: '100%' }}><button type="submit">Insert Transaction</button></div>
                        </div>
                    </form>
                    <div style={{gridColumn: '2 / -1', gridRow:'1 / -1',display: 'grid', gridTemplateColumns:'1fr 1fr 1fr', gridTemplateRows:'7% 1fr 1fr 1fr', padding:'2%'}}>
                        <div style={{background:'white', color:'black', height:'80%',textAlign:'center', gridRow:'1', gridColumn:'3', marginLeft: '5%'}}><h4>Total</h4></div>
                        <div id="buys-container" style={{gridRow:'2', gridColumn:'1/ 3'}}></div>
                        <div id="incomes-container" style={{gridRow:'2', gridColumn:'3'}}></div>
                        <div id="expenses-container" style={{gridRow:'3', gridColumn:'3'}}></div>
                        <div id="debts-container" style={{gridRow:'3', gridColumn:'1/3'}}></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
