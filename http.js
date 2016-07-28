/* @flow */
import { EventEmitter } from 'events';
import net from 'net';
import Request from './request';
import Response from './response';

class HttpServer extends EventEmitter {
  server: net.Server

  constructor() {
    super();
    this.server = net.createServer();
    this.server.on('connection', this.handleConnection);
  }

  handleConnection = (socket: net.Socket) => {
    const req = new Request(socket);
    const res = new Response(socket);
    req.once('headers', () => this.emit('request', req, res, socket));
  }

  listen(port: number|string): void {
    this.server.listen(port);
  }
}

export function createServer() { // eslint-disable-line import/prefer-default-export
  return new HttpServer();
}