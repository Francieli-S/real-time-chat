import { Server, Socket } from 'socket.io';
import logger from './utils/logger';
import { v4 } from 'uuid';

interface Room {
  id: string;
  name: string;
}

const rooms: Room[] = [];

interface Messages {
  [roomId: string]: {
    content: string;
    username: string;
    time: string;
  }[];
}
// messages = [
 // {roomIdstringAsTheProperty: {content:'', userName:'', time:''}},
 // {roomIdstringAsTheProperty: {content:'', userName:'', time:''}}
// ]
const messages: Messages = {};

const EVENTS = {
  connection: 'connection',
  CLIENT: {
    CREATE_ROOM: 'CREATE_ROOM',
    SEND_ROOM_MESSAGE: 'SEND_ROOM_MESSAGE',
    JOIN_ROMM: 'JOIN_ROOM',
  }, // events that client can emit and the server can listen
  SERVER: {
    ROOMS: 'ROOMS',
    JOINED_ROOM: 'JOINED_ROOM',
    ROOM_MESSAGE: 'ROOM_MESSAGE',
  }, // events that server can emit and the client can listen
};

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
      socket.join(roomId); // TODO: we are not saving the username here, so when we refresh we lose the rooms
      // Broadcast event, alerting users about new room
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);
      // Emit all the rooms back to the room creator
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      // Emit back to user that they joined the room
      socket.emit(EVENTS.SERVER.JOINED_ROOM, { roomId, messages: [] });
    });

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, content, username }) => {
        const date = new Date();

        logger.info(`New message by ${username} in room ${roomId}: ${content}`);
        socket.to(roomId).emit(EVENTS.SERVER.ROOM_MESSAGE, {
          content,
          username,
          time: `${date.getHours()}: ${date.getMinutes()}`,
        });

        messages[roomId] = messages[roomId] || [];
        messages[roomId].push({
          content,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
        console.log('messages arr: ', messages);
      }
    );

    socket.on(EVENTS.CLIENT.JOIN_ROMM, ({ roomId }) => {
      logger.info(`Connection ${socket.id} joined room ${roomId}`);
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, {
        roomId,
        messages: messages[roomId] || [],
      });
    });
  });
}

export default socket;
