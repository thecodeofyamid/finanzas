// src/hooks/useRefs.js
import { useRef } from 'react';

export const useRefs = () => {
    const isInitialLoad = useRef(true);
    const wsRef = useRef(null);
    const editRef = useRef(null);

    return {
        isInitialLoad,
        wsRef,
        editRef,
    };
};