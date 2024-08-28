import { useState } from 'react';
import { MessagesContainer, RoomsContainer } from './containers';
import { useSockets } from './context/socket.context';

function App() {
  const { socket, username, setUsername } = useSockets();
  const [userNameInput, setUserNameInput] = useState<string>('');

  const handleSetUserName = () => {
    if (!userNameInput) return
    setUsername(userNameInput)
    if (username !== undefined) {
      localStorage.setItem('username', userNameInput );
      setUserNameInput('')
    }
  };

  // if no username, display the input fields...
  if (!username)
    return (
      <div>
        <input
          // id='username-id'
          value={userNameInput}
          onChange={(e) => setUserNameInput(e.target.value)}
          placeholder='user name'
        />
        <button onClick={handleSetUserName}>Log in</button>
      </div>
    );
  // ... if username is valid, give access to rooms and messages
  return (
    <div>
      <RoomsContainer />
      <MessagesContainer />
    </div>
  );
}

export default App;

// import { useEffect, useState } from 'react';
// import { useSockets } from './context/socket.context';

// function App() {
//   // here we destructure socket(the connection to the be server) from the context...
//   const { socket } = useSockets();
//   const [socketId, setSocketId] = useState<string | undefined>('');

//   useEffect(() => {
//     // ... and here we have access to the events on, off
//     // every time user connects to the app, it generates a new socketId
//     socket.on('connect', () => setSocketId(socket.id));
//     console.log('ON', socket);

//     return () => {
//       // cleanup function called before the component unmounts,
//       // and it removes our event listener by using socket.off().
//       // it means turn off this connection
//       console.log('BEFORE OFF', socket);
//       socket.off('connect', () => setSocketId(socket.id));
//       console.log('AFTER OFF', socket);
//     };
//   }, [socket]);

//   return <div>{socketId}</div>;
// }

// export default App;
