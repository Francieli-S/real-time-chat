import { createContext, useContext, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/default';
import { EVENTS } from '../config/events';

// validation: user shouldn’t be able to access Messages and Rooms if it doesn’t have an username.
// To pass username down with the provider, we will save it inside state in our context file
// Now we can access username in every component inside our application
// TypeScript will warn us immediately about the Context type (because username is not in the Socket type),
// that’s why we will create Context
// interface and assign it as the type for createContext:

interface Room {
  id: string;
  name: string;
}

interface Context {
  socket: Socket;
  username?: string;
  setUsername: (value?: string) => void;
  roomId?: string; // the room that user joined
  rooms: Room[];
}

// initiate connection with the backend socket server
export const socket = io(SOCKET_URL);
// .., then we assign the type to the socket:
export const SocketContext = createContext<Context>({
  socket,
  setUsername: () => '',
  rooms: [{ id: '', name: '' }],
});

const SocketsProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | undefined>('');
  const [roomId, setRoomId] = useState<string | undefined>('');
  const [rooms, setRooms] = useState([{ id: '', name: '' }]);

  const userNameFromLocalStorage = localStorage.getItem('username');
  if (userNameFromLocalStorage && !username) {
    setUsername(userNameFromLocalStorage);
  }

  // BE will fire an event send us these details
  // FE need to have an event listener for these events that are fired
  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);
  });

  return (
    // We are passing the socket (connection) to every children
    <SocketContext.Provider
      value={{ socket, username, setUsername, roomId, rooms }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSockets = () => useContext(SocketContext);
export default SocketsProvider;
