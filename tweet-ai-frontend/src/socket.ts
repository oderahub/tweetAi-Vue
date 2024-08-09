// // src/socket.ts
// import { io, Socket } from 'socket.io-client';

// const socket: Socket = io('http://localhost:3000'); // Backend URL

// export default socket;
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3000', {
  transports: ['websocket'], // Ensure transport is set to WebSocket
  withCredentials: true // Include credentials if needed
});



export default socket;