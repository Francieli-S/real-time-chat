import { useState } from 'react';
import { useSockets } from './../context/socket.context';
import { EVENTS } from '../config/events';
import styles from '../styles/Rooms.module.css';

export const RoomsContainer = () => {
  const { socket, roomId, rooms } = useSockets();
  const [roomName, setRoomName] = useState<string>('');

  const handleCreateRoom = () => {
    if (roomName === undefined || typeof roomName !== 'string') return;
    roomName.trim();

    // emit created room event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });
    setRoomName('');
  };

  const handleJoinRoom = (id: string) => {
    console.log('from joinned room: ', id);
    if (roomId === id) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROMM, { roomId: id });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.createRoomWrapper}>
        <input
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          placeholder='room name'
        />
        <button className='cta' onClick={handleCreateRoom}>
          Create Room
        </button>
      </div>
      <ul className={styles.roomList}>
        {rooms.map(({ id, name }) => (
          <div key={id}>
            <button disabled={roomId === id} onClick={() => handleJoinRoom(id)}>
              {name}
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};
