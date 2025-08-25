import { useEffect, useRef, useState } from 'react';
import { testWebSocketConnection, checkServerStatus } from './websocket-test';

interface WorkoutData {
  exercise: string | null;
  confidence: number;
  feedback: string;
  angle: number;
  reps: number;
  landmarks_detected: boolean;
  form_color: { r: number; g: number; b: number } | number[];
  session_time: number;
  frame_count: number;
  is_paused?: boolean;
}

interface SystemData {
  status: string;
  message: string;
  model_loaded: boolean;
  supported_exercises?: number;
  camera_specs?: {
    width: number;
    height: number;
    frameRate: number;
  };
  class_names?: string[];
  model_path?: string;
}

interface ErrorData {
  message: string;
  timestamp: string;
  status?: string;
}

interface SessionSummary {
  session_duration: number;
  total_frames: number;
  exercises_performed: number;
  total_pause_duration?: number;
  exercise_details: {
    [key: string]: {
      total_reps: number;
      duration: number;
      best_form_score: number;
    };
  };
}

interface BackendMessage {
  type: 'workout' | 'system' | 'error' | 'summary';
  payload: WorkoutData | SystemData | ErrorData | SessionSummary;
}

export const useWorkoutWebSocket = (
  url: string,
  videoRef: React.RefObject<HTMLVideoElement | null>,
  onBackendData?: (data: BackendMessage) => void,
  isModalOpen?: boolean
) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [supportedExercises, setSupportedExercises] = useState<number>(0);

  // Current workout state
  const [currentExercise, setCurrentExercise] = useState<string>('');
  const [exerciseConfidence, setExerciseConfidence] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  const [angle, setAngle] = useState<number>(0);
  const [reps, setReps] = useState<number>(0);
  const [landmarksDetected, setLandmarksDetected] = useState<boolean>(false);
  const [formColor, setFormColor] = useState<{ r: number; g: number; b: number }>({ r: 255, g: 255, b: 255 });
  const [sessionTime, setSessionTime] = useState<number>(0);
  const [frameCount, setFrameCount] = useState<number>(0);

  // Session data
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);

  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isProcessingFrame = useRef<boolean>(false);

  // Helper to capture video frame as base64
  const captureFrame = () => {
    if (!videoRef.current || isProcessingFrame.current) return null;

    const video = videoRef.current;
    if (video.readyState !== 4) return null; // Video not ready

    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      return canvas.toDataURL('image/jpeg', 0.8); // Reduced quality for better performance
    } catch (error) {
      console.error('Error capturing frame:', error);
      return null;
    }
  };

  // Send message to WebSocket
  const sendMessage = (type: string, payload?: any) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      console.log(`📤 Sending message: ${type}`, payload);
      socket.send(JSON.stringify({ type, payload }));
    } else {
      console.warn(`❌ Cannot send message ${type}: WebSocket not connected`);
    }
  };

  // Reset session
  const resetSession = () => {
    console.log('🔄 Resetting session...');
    sendMessage('reset');
  };

  // Get session summary
  const getSessionSummary = () => {
    console.log('📊 Requesting session summary...');
    sendMessage('get_summary');
  };

  // Manual connection test function
  const testConnection = async () => {
    if (!isModalOpen) {
      console.log('🧪 Skipping WebSocket connection test: TrikaVisionModal is closed');
      return {
        success: false,
        error: 'Modal is closed, WebSocket connection test not run',
        details: {
          url,
          timestamp: new Date().toISOString(),
        }
      };
    }
    console.log('🧪 Manual WebSocket connection test initiated...');
    console.log('Current state:', {
      isConnected,
      isModelLoaded,
      supportedExercises,
      socketState: socket?.readyState,
      url
    });

    await checkServerStatus(url);
    const result = await testWebSocketConnection(url);
    console.log('🧪 Test result:', result);
    return result;
  };

  useEffect(() => {
    if (!url) {
      setError('WebSocket URL is not configured');
      return;
    }

    // Only connect if modal is open
    if (!isModalOpen) {
      console.log('🚫 Modal is closed, skipping WebSocket connection');
      return;
    }

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let reconnectTimeout: NodeJS.Timeout;
    let wsInstance: WebSocket | null = null;

    const connectWebSocket = async () => {
      try {
        console.log(`🔌 Attempting to connect to WebSocket: ${url}`);

        // Validate URL format
        if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
          throw new Error(`Invalid WebSocket URL format: ${url}`);
        }

        // Test connection first on initial attempt
        if (reconnectAttempts === 0) {
          console.log('🧪 Running connection test first...');
          const testResult = await testWebSocketConnection(url);
          if (!testResult.success) {
            const errorMsg = testResult.error || 'Unknown connection error';
            setError(`Connection test failed: ${errorMsg}`);
            console.error('❌ Connection test failed:', testResult);
            return;
          }
          console.log('✅ Connection test passed, proceeding with WebSocket connection');
        }

        const ws = new WebSocket(url);
        wsInstance = ws;

        // Set a connection timeout
        const connectionTimeout = setTimeout(() => {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.error('❌ WebSocket connection timeout');
            ws.close();
            setError(`Connection timeout: Unable to connect to ${url}`);
          }
        }, 10000); // 10 second timeout

        ws.onopen = () => {
          console.log('✅ WebSocket connected to', url);
          clearTimeout(connectionTimeout);
          setIsConnected(true);
          setSocket(ws);
          setError(null);
          reconnectAttempts = 0;

          // Start sending frames with optimized interval
          if (videoRef.current) {
            frameIntervalRef.current = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN && videoRef.current?.readyState === 4 && isModelLoaded) {
                const frame = captureFrame();
                if (frame && !isProcessingFrame.current) {
                  isProcessingFrame.current = true;
                  sendMessage('frame', frame);
                  // Reset processing flag after a short delay
                  setTimeout(() => {
                    isProcessingFrame.current = false;
                  }, 50);
                }
              }
            }, 100); // 10 FPS
          }
        };

        ws.onmessage = (event) => {
          try {
            const data: BackendMessage = JSON.parse(event.data);
            console.log('📨 WebSocket message received:', data.type, data.payload);

            // Call callback if provided
            if (onBackendData) onBackendData(data);

            // Handle different message types
            switch (data.type) {
              case 'workout': {
                const workoutData = data.payload as WorkoutData;
                setCurrentExercise(workoutData.exercise || '');
                setExerciseConfidence(workoutData.confidence || 0);
                setFeedback(workoutData.feedback || 'No feedback available');
                setAngle(workoutData.angle || 0);
                setReps(workoutData.reps || 0);
                setLandmarksDetected(workoutData.landmarks_detected || false);

                // Handle form_color - could be array or object
                if (workoutData.form_color) {
                  if (Array.isArray(workoutData.form_color)) {
                    setFormColor({
                      r: workoutData.form_color[0] || 255,
                      g: workoutData.form_color[1] || 255,
                      b: workoutData.form_color[2] || 255
                    });
                  } else {
                    setFormColor(workoutData.form_color as { r: number; g: number; b: number });
                  }
                }

                setSessionTime(workoutData.session_time || 0);
                setFrameCount(workoutData.frame_count || 0);
                break;
              }
              case 'system': {
                const systemData = data.payload as SystemData;
                console.log('🔧 System message:', systemData);

                // Update model loaded state
                if (typeof systemData.model_loaded === 'boolean') {
                  setIsModelLoaded(systemData.model_loaded);
                  console.log(`🤖 Model loaded status: ${systemData.model_loaded}`);
                }

                // Update supported exercises count
                if (typeof systemData.supported_exercises === 'number') {
                  setSupportedExercises(systemData.supported_exercises);
                  console.log(`🎯 Supported exercises: ${systemData.supported_exercises}`);
                }

                // Log additional system info
                if (systemData.class_names) {
                  console.log('📋 Supported exercise classes:', systemData.class_names);
                }

                break;
              }
              case 'error': {
                const errorData = data.payload as ErrorData;
                console.error('❌ Backend error:', errorData.message);
                setError(errorData.message);

                // Reset model loaded state on initialization errors
                if (errorData.status === 'initialization_failed') {
                  setIsModelLoaded(false);
                }
                break;
              }
              case 'summary': {
                const summaryData = data.payload as SessionSummary;
                setSessionSummary(summaryData);
                console.log('📊 Session summary received:', summaryData);
                break;
              }
              default:
                console.warn('🤷‍♀️ Unknown message type:', data.type);
            }
          } catch (err) {
            console.error('❌ WebSocket message parse error:', err);
            setError('Failed to parse server message');
          }
        };

        ws.onclose = (event) => {
          console.log('🔌 WebSocket closed:', event.code, event.reason);
          setIsConnected(false);
          setSocket(null);
          setIsModelLoaded(false); // Reset model loaded state on disconnect

          if (frameIntervalRef.current) {
            clearInterval(frameIntervalRef.current);
            frameIntervalRef.current = null;
          }

          // Don't try to reconnect if this was a normal closure
          if (event.code === 1000) {
            console.log('✅ WebSocket connection closed normally');
            return;
          }

          // Attempt to reconnect with exponential backoff
          if (reconnectAttempts < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
            console.log(`🔄 Attempting to reconnect in ${delay}ms... (attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`);
            reconnectTimeout = setTimeout(() => {
              reconnectAttempts++;
              connectWebSocket();
            }, delay);
          } else {
            const errorMsg = `❌ Failed to connect to WebSocket server after ${maxReconnectAttempts} attempts`;
            console.error(errorMsg);
            setError(errorMsg);
          }
        };

        ws.onerror = (errorEvent) => {
          console.error('❌ WebSocket connection error:', {
            type: errorEvent.type,
            readyState: ws.readyState,
            url: url,
            timestamp: new Date().toISOString()
          });

          // Provide more specific error messages
          let errorMessage = 'Failed to connect to WebSocket server';
          if (ws.readyState === WebSocket.CONNECTING) {
            errorMessage = `Cannot connect to WebSocket at ${url}. Please check if the server is running.`;
          } else if (ws.readyState === WebSocket.OPEN) {
            errorMessage = 'WebSocket connection lost unexpectedly';
          }

          setError(errorMessage);
          setIsModelLoaded(false); // Reset model loaded state on error

          // Only close if we're still connecting
          if (ws.readyState === WebSocket.CONNECTING) {
            ws.close(1006, 'Connection failed');
          }
        };

      } catch (err) {
        console.error('❌ Failed to create WebSocket:', err);
        setError('Failed to establish WebSocket connection');
        setIsModelLoaded(false);
      }
    };

    connectWebSocket();

    // Cleanup function
    return () => {
      console.log('🧹 Cleaning up WebSocket connection');

      // Clear any pending reconnection attempts
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }

      // Clear the frame interval if it exists
      if (frameIntervalRef.current) {
        clearInterval(frameIntervalRef.current);
        frameIntervalRef.current = null;
      }

      // Close the WebSocket connection if it exists
      if (wsInstance) {
        console.log('🔌 Closing WebSocket connection');
        wsInstance.close(1000, 'Component unmounting');
      } else if (socket) {
        console.log('🔌 Closing socket from state');
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [url, videoRef, onBackendData, isModelLoaded, isModalOpen]);

  return {
    // Connection state
    socket,
    isConnected,
    error,
    isModelLoaded,
    supportedExercises,

    // Current workout data
    currentExercise,
    exerciseConfidence,
    feedback,
    angle,
    reps,
    landmarksDetected,
    formColor,
    sessionTime: sessionTime,
    frameCount,

    // Session data
    sessionSummary,

    // Actions
    resetSession,
    getSessionSummary,
    sendMessage,
    testConnection,

    // Legacy compatibility (deprecated - use new fields above)
    workout: currentExercise,
    confidence: exerciseConfidence,
    modelConfidence: exerciseConfidence,
    landmarksCount: landmarksDetected ? 1 : 0,
  };
};