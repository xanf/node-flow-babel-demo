/* @flow */
import { createServer } from './http';

const server = createServer();
server.listen(process.env.PORT || 3000);

server.on('request', (req, res, socket) => {
  console.log('request');
  socket.end('It works');
});
