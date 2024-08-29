import { Server, Socket } from 'socket.io';
import logger from './utils/logger';
import { v4 } from 'uuid';

interface Room {
  id: string;
  name: string;
}

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
  },
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
  },
};

const rooms: Room[] = [{ id: '', name: '' }];

function socket({ io }: { io: Server }) {
  logger.info('Sockets enabled');

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      logger.info(`Connection: ${socket.id} Created Room: ${roomName}`);
      // Create room
      const roomId = v4();
      rooms.push({ id: roomId, name: roomName });
      // Join room
      socket.join(roomId) // TODO: we are not saving the username here, so when we refresh we lose the rooms 
      // Broadcast event, alerting users about new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms)
      // Emit all the rooms back to the room creator
      socket.emit(EVENTS.SERVER.ROOMS, rooms)
      // Emit back to user that they joined the room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId)
    });
  });
}

export default socket;
