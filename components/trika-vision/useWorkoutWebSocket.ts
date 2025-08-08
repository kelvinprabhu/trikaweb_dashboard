import { useEffect, useRef, useState } from 'react';

export const useWorkoutWebSocket = (url: string, onLandmarks: (landmarks: any[]) => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [workoutData, setWorkoutData] = useState<any>(null);

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'landmarks') {
        console.log(data);
        onLandmarks(data.payload);
      } else if (data.type === 'workout') {
        setWorkoutData(data.payload);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('WebSocket disconnected');
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url, onLandmarks]);

  const sendLandmarks = (landmarks: any[]) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({
        type: 'landmarks',
        payload: landmarks
      }));
    }
  };

  return { socket, isConnected, workoutData, sendLandmarks };
};