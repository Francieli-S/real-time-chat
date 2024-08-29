import { createContext, useContext, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/default';

// validation: user shouldn’t be able to access Messages and Rooms if it doesn’t have an username.
// To pass username down with the provider, we will save it inside state in our context file
// Now we can access username in every component inside our application
// TypeScript will warn us immediately about the Context type (because username is not in the Socket type),
// that’s why we will create Context
// interface and assign it as the type for createContext:

interface Context {
  socket: Socket;
  username?: string;
  setUsername: (value?: string) => void;
}

// initiate connection with the backend socket server
export const socket = io(SOCKET_URL);
// .., then we assign the type to the socket:
export const SocketContext = createContext<Context>({
  socket,
  setUsername: () => '',
});

const SocketsProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState<string | undefined>('');
  const userNameFromLocalStorage = localStorage.getItem('username')
  if (userNameFromLocalStorage && !username) {
    setUsername(userNameFromLocalStorage)
  }

  return (
    // We are passing the socket (connection) to every children
    <SocketContext.Provider value={{ socket, username, setUsername }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSockets = () => useContext(SocketContext);
export default SocketsProvider;
