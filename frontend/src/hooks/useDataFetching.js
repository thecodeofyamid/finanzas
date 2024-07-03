// src/hooks/useDataFetching.js
import { useEffect } from 'react';
import fetchData from '../utils/fetchData';
import getUniqueTransactions from '../utils/getUniqueTransactions';

export const useDataFetching = (HTTP_ENDPOINT, WS_ENDPOINT, setTransactions, isInitialLoad, wsRef) => {
    useEffect(() => {
        const fetchDataAndSetTransactions = async () => {
            const data = await fetchData(HTTP_ENDPOINT);
            const uniqueTransactions = getUniqueTransactions(data);
            setTransactions(uniqueTransactions);
            isInitialLoad.current = false;
        };

        fetchDataAndSetTransactions();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [HTTP_ENDPOINT, WS_ENDPOINT, setTransactions, isInitialLoad, wsRef]);
};
