import net from 'net';
import crypto from 'crypto';
import { EventEmitter } from 'events';
import debug from 'debug';
import { parseTPMS } from './parsers/parseTPMS';
import { parseEnvironment } from './parsers/parseEnvironment';
import { parseFirmware } from './parsers/parseFirmware';
import { parseStatus } from './parsers/parseStatus';
import { parseLocation } from './parsers/parseLocation';

const log = debug('OVMS');
const b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export enum DataStale {
  NoValue,
  Stale,
  Good,
}

export class OVMSClient extends EventEmitter {
  private socket = new net.Socket();
  private clientToken: string;

  private serverToken: Buffer = Buffer.alloc(0);
  private serverDigest: Buffer = Buffer.alloc(0);

  private decipher: crypto.Decipher | undefined;
  private cipher: crypto.Cipher | undefined;

  private onSocketData = (data: Buffer) => {
    const res = data.toString('utf8');
    const [firstLine, ...rest] = res.split('\r\n');
    const [mps, , serverToken, serverDigest] = firstLine.split(' ');

    if (mps === 'MP-S') {
      this.serverToken = Buffer.from(serverToken, 'utf8');
      this.serverDigest = Buffer.from(serverDigest, 'base64');

      const serverCheck = crypto
        .createHmac('md5', this.password)
        .update(this.serverToken)
        .digest();

      if (serverCheck.equals(this.serverDigest)) {
        log('Server authentication OK.');
      } else {
        log(
          'Server authentication failed. Expected %s Got %s',
          this.serverDigest.toString('hex'),
          serverCheck.toString('hex')
        );
      }

      log('RX:', res);

      const serverClientToken = Buffer.from(
        serverToken + this.clientToken,
        'utf-8'
      );
      const clientKey = crypto
        .createHmac('md5', this.password)
        .update(serverClientToken)
        .digest();

      this.cipher = crypto.createCipheriv('rc4', clientKey, '');
      this.decipher = crypto.createDecipheriv('rc4', clientKey, '');

      for (let i = 0; i < 1024; i++) {
        this.cipher.update(Buffer.from('0', 'utf-8'));
        this.decipher.update(Buffer.from('0', 'utf-8'));
      }

      this.emit('connected');

      if (rest.length) {
        // we got more data, pass it down
        this.onSocketData(Buffer.from(rest.join('\r\n')));
      }
    } else {
      const msgs = res.split('\r\n');
      msgs.forEach(msg => {
        this.handleMessage(
          this.decipher!.update(Buffer.from(msg, 'base64'), 'binary', 'utf8')
        );
      });
    }
  };

  private onSocketError = (err: Error) => {
    log('socket error', err);
    this.emit('error', err);
  };

  private onSocketClose = () => {
    log('socket closed');
    this.emit('closed');
  };

  private handleMessage = (msg: string) => {
    if (msg.trim() === '') {
      return;
    }

    const code = msg.substr(5, 1);
    const message = msg.substr(6);

    this.emit('raw', msg);

    switch (code) {
      case 'L':
        this.emit('location', parseLocation(message));
        break;
      case 'S':
        this.emit('status', parseStatus(message));
        break;
      case 'F':
        this.emit('firmware', parseFirmware(message));
        break;
      case 'D':
        this.emit('environment', parseEnvironment(message));
        break;
      case 'W':
        this.emit('tpms', parseTPMS(message));
        break;
      case 'a':
        this.emit('serverAck', message);
        break;
      case 'c':
        this.emit('commandReceived', message);
        break;
      case 'P':
        this.emit('pushNotification', message);
        break;
      case 'Z':
        this.emit('carsConnected', parseInt(message, 10));
        break;
      case 'T':
        this.emit(
          'lastUpdated',
          new Date(Date.now() - parseFloat(message) * 1000)
        );
        break;
      default:
        this.emit('message', message);
    }
  };

  constructor(
    protected hostname: string,
    protected port: number,
    protected vehicleId: string,
    protected password: string
  ) {
    super();
    this.clientToken = Array.from({ length: 22 })
      .map(() => b64[Math.floor(Math.random() * 64)])
      .join('');
    this.socket.on('data', this.onSocketData);
    this.socket.on('error', this.onSocketError);
    this.socket.on('close', this.onSocketClose);
  }

  connect() {
    this.socket.connect(this.port, this.hostname, () => {
      log('connected to socket');
      const digest = crypto
        .createHmac('md5', this.password)
        .update(this.clientToken)
        .digest('base64');
      this.socket.write(
        Buffer.from(
          `MP-A 0 ${this.clientToken} ${digest} ${this.vehicleId}\r\n`
        )
      );
    });
  }

  sendRaw = (msg: string) => {
    this.socket.write(
      Buffer.from(this.cipher!.update(Buffer.from(msg))).toString('base64') +
        '\r\n'
    );
  };

  send = (msg: string) => this.sendRaw(`MP-0 C${msg}`);

  disconnect() {
    this.socket.end();
  }
}
