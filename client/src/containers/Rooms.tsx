import { useState } from 'react';
import { useSockets } from './../context/socket.context';
import { EVENTS } from '../config/events';

export const RoomsContainer = () => {
  const { socket, roomId, rooms } = useSockets();
  const [roomName, setRoomName] = useState<string>('');

  const handleCreateRoom = () => {
    if (roomName === undefined || typeof roomName !== 'string') return;
    roomName.trim();

    // emit created room event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, roomName);

    setRoomName('');
  };

  return (
    <div>
      <div>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder='room name'
        />
        <button onClick={handleCreateRoom}>Create Room</button>
      </div>
      {rooms.map(({id, name}) => (
        <div key={id}>{name}</div>
      ))}
    </div>
  );
};
