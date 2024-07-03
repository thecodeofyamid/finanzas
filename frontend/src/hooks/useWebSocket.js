import { useEffect } from 'react';

const useWebSocket = (url, onMessage, onClose, onError) => {
  useEffect(() => {
    const socket = new WebSocket(url);

    socket.addEventListener('open', (event) => {
      console.log('Connected to WebSocket server ✅');
      socket.send('Hello Server! 👨‍💻');
    });

    socket.addEventListener('message', onMessage);

    socket.addEventListener('close', onClose);

    socket.addEventListener('error', onError);

    return () => {
      socket.close();
    };
  }, [url, onMessage, onClose, onError]);
};

export default useWebSocket;
