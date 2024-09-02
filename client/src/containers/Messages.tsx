import { useState } from 'react';
import { useSockets } from './../context/socket.context';
import { EVENTS } from '../config/events';
import styles from '../styles/Messages.module.css';

export const MessagesContainer = () => {
  const { socket, messages, roomId, username, setMessages } = useSockets();
  const [messageInput, setMessageInput] = useState<string>('');

  const handleSendMessage = () => {
    console.log('room id: ', roomId);
    if (messageInput === undefined || typeof messageInput !== 'string') return;
    messageInput.trim();

    // emit send room message
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
      roomId,
      content: messageInput,
      username,
    });

    // we generate the date here just to show to this cliente
    // because this one will not receive back the message createde for they from the server/broadcasting

    if (messages && messageInput) {
      const date = new Date();
      setMessages([
        ...messages,
        {
          username: 'You',
          content: messageInput,
          time: `${date.getHours()}: ${date.getMinutes()}`,
        },
      ]);
    }
    setMessageInput('');
  };

  return (
    <div className={styles.wrapper}>
      <ul className={styles.messageList}>
        {messages?.map((message, index) => (
          <li key={index} className={styles.message}>
            <p className={styles.messageInner}>
              <span className={styles.messageSender}>
                {message.time} -{' '}
                {message.username === username ? 'You' : message.username}:{' '}
                <br />
                <span className={styles.messageBody}>{message.content}</span>
              </span>
            </p>
          </li>
        ))}
      </ul>
      <div className={styles.messageBox}>
        <textarea
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          rows={1}
          placeholder='message'
        />
        <button className='cta' onClick={handleSendMessage}>
          Send
        </button>
      </div>
    </div>
  );
};
