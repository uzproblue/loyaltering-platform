import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

/**
 * Connect to Socket.io server
 */
export const connectSocket = (restaurantId: string): Socket => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Disconnect existing socket if any
  if (socket && socket.connected) {
    socket.disconnect();
  }

  // Create new socket connection
  socket = io(API_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });

  // Join restaurant room once connected
  socket.on('connect', () => {
    console.log('Socket.io connected:', socket?.id);
    if (restaurantId) {
      socket?.emit('joinRestaurant', restaurantId);
    }
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log('Socket.io disconnected:', reason);
  });

  // Handle connection errors
  socket.on('connect_error', (error) => {
    console.error('Socket.io connection error:', error);
  });

  // Handle reconnection
  socket.on('reconnect', (attemptNumber) => {
    console.log('Socket.io reconnected after', attemptNumber, 'attempts');
    if (restaurantId) {
      socket?.emit('joinRestaurant', restaurantId);
    }
  });

  return socket;
};

/**
 * Disconnect from Socket.io server
 */
export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Get current socket instance
 */
export const getSocket = (): Socket | null => {
  return socket;
};

/**
 * Subscribe to transaction events
 */
export const subscribeToTransactions = (
  callback: (data: any) => void
): (() => void) => {
  if (!socket) {
    console.warn('Socket not connected, cannot subscribe to transactions');
    return () => {};
  }

  socket.on('newTransaction', callback);

  // Return unsubscribe function
  return () => {
    if (socket) {
      socket.off('newTransaction', callback);
    }
  };
};

/**
 * Check if socket is connected
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected || false;
};
