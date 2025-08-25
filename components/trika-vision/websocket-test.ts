// WebSocket Connection Test Utility
// This utility helps debug WebSocket connection issues

export interface ConnectionTestResult {
  success: boolean;
  error?: string;
  details: {
    url: string;
    timestamp: string;
    readyState?: number;
    responseTime?: number;
  };
}

export const testWebSocketConnection = async (url: string): Promise<ConnectionTestResult> => {
  const startTime = Date.now();
  const timestamp = new Date().toISOString();

  try {
    console.log(`🧪 Testing WebSocket connection to: ${url}`);

    // Validate URL format
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
      return {
        success: false,
        error: 'Invalid WebSocket URL format. Must start with ws:// or wss://',
        details: { url, timestamp }
      };
    }

    // Test the connection
    return new Promise((resolve) => {
      const ws = new WebSocket(url);
      let resolved = false;

      const timeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          ws.close();
          resolve({
            success: false,
            error: 'Connection timeout (10 seconds)',
            details: {
              url,
              timestamp,
              readyState: ws.readyState,
              responseTime: Date.now() - startTime
            }
          });
        }
      }, 10000);

      ws.onopen = () => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          const responseTime = Date.now() - startTime;
          console.log(`✅ WebSocket connection test successful (${responseTime}ms)`);
          ws.close();
          resolve({
            success: true,
            details: {
              url,
              timestamp,
              readyState: ws.readyState,
              responseTime
            }
          });
        }
      };

      ws.onerror = (error) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          console.error('❌ WebSocket connection test failed:', error);

          // Extract meaningful error message
          let errorMessage = 'Connection failed - server may not be running or URL is incorrect';
          if (error && typeof error === 'object') {
            if ('message' in error && error.message) {
              errorMessage = `Connection failed: ${error.message}`;
            } else if ('type' in error && error.type) {
              errorMessage = `Connection failed: ${error.type}`;
            }
          }

          resolve({
            success: false,
            error: errorMessage,
            details: {
              url,
              timestamp,
              readyState: ws.readyState,
              responseTime: Date.now() - startTime
            }
          });
        }
      };

      ws.onclose = (event) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(timeout);
          resolve({
            success: false,
            error: `Connection closed immediately (code: ${event.code}, reason: ${event.reason})`,
            details: {
              url,
              timestamp,
              readyState: ws.readyState,
              responseTime: Date.now() - startTime
            }
          });
        }
      };
    });

  } catch (error) {
    let errorMessage = 'Unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      errorMessage = JSON.stringify(error);
    }

    return {
      success: false,
      error: errorMessage,
      details: {
        url,
        timestamp,
        responseTime: Date.now() - startTime
      }
    };
  }
};

// Helper function to get WebSocket ready state as string
export const getReadyStateString = (readyState: number): string => {
  switch (readyState) {
    case WebSocket.CONNECTING: return 'CONNECTING';
    case WebSocket.OPEN: return 'OPEN';
    case WebSocket.CLOSING: return 'CLOSING';
    case WebSocket.CLOSED: return 'CLOSED';
    default: return 'UNKNOWN';
  }
};

// Helper function to check if WebSocket server is likely running
export const checkServerStatus = async (url: string): Promise<void> => {
  console.log('🔍 Checking WebSocket server status...');

  const result = await testWebSocketConnection(url);

  if (result.success) {
    console.log('✅ WebSocket server is running and accessible');
  } else {
    console.error('❌ WebSocket server check failed:', {
      error: result.error,
      details: result.details
    });

    // Provide helpful debugging information
    console.log('🔧 Debugging tips:');
    console.log('1. Check if your WebSocket server is running');
    console.log('2. Verify the URL is correct:', url);
    console.log('3. Check for firewall or network issues');
    console.log('4. Ensure the server accepts WebSocket connections');
  }
};
