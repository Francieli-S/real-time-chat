// library build up on console.log
import logger from 'pino';
import dayjs from 'dayjs';

const log = logger({
  transport: { target: 'pino-pretty', options: { colorize: true } },
  base: {
    pid: false,
  },
  // timestamp: () => `,"time":"${dayjs().format()}"`,
  timestamp: () => `,"time":"${dayjs(new Date())}"`,
});

export default log;
