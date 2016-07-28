/* @flow */
import { Readable } from 'stream';
// FLOW SPECIFIC
import type { Socket } from 'net';
import debugGenerator from 'debug';

const debug = debugGenerator('myHttp:request');

const SEPARATOR = '\r\n\r\n';

export default class HttpRequest extends Readable {
  socket: Socket

  readRequested: bool = false

  constructor(socket: Socket) {
    super();
    this.socket = socket;

    socket
      .on('data', this.processHeaders)
      .on('end', () => this.push(null))
      .on('error', error => this.emit('error', error))
    ;
  }

  processHeaders = (chunk: Buffer) => {
    const { socket } = this;

    const position = chunk.indexOf(SEPARATOR);
    if (position === -1) { socket.unshift(chunk); return; }
    debug('Emitted headers');
    this.emit('headers');
    const rawHeaders = chunk.slice(0, position).toString();
    // TODO: распарсить и положить в this.headers
    socket.unshift(chunk.slice(position + SEPARATOR.length));
    socket.pause();
    if (this.readRequested) {
      this.push(socket.read());
    }
  }

  _read() {
    if (this.socket.isPaused()) {
      this.push(this.socket.read());
    } else {
      this.readRequested = true;
    }
  }
}
