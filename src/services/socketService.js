// import { io } from 'socket.io-client';

// let socket;

// export const connectSocket = () => {
//   if (socket) return socket;
//   const token = localStorage.getItem('accessToken');
//   socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
//     auth: { token },
//   });
//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = undefined;
//   }
// };

import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem('accessToken');

  if (!import.meta.env.VITE_SOCKET_URL) {
    throw new Error("VITE_SOCKET_URL is not defined");
  }

  socket = io(import.meta.env.VITE_SOCKET_URL, {
    auth: { token },
    withCredentials: true,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = undefined;
  }
};
