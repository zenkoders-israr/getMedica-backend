import { Injectable } from '@nestjs/common';
import * as bunyan from 'bunyan';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BunyanLogger {
  private readonly logger: bunyan;

  constructor() {
    const logDir = path.join(__dirname, '..', 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    const logFile = path.join(logDir, 'app.log');
    const stream = fs.createWriteStream(logFile, { flags: 'a' });

    this.logger = bunyan.createLogger({
      name: 'Sample-App-Logger',
      streams: [
        {
          level: 'info',
          stream: process.stdout,
        },
        {
          level: 'info',
          stream,
        },
        {
          level: 'debug',
          stream,
        },
        {
          level: 'error',
          stream,
        },
        {
          level: 'fatal',
          stream,
        },
        {
          level: 'warn',
          stream,
        },
      ],
    });
  }

  log(message: any, ...params: any[]) {
    this.logger.info(message, ...params);
  }

  debug(message: any, ...params: any[]) {
    this.logger.debug(message, ...params);
  }

  warn(message: any, ...params: any[]) {
    this.logger.warn(message, ...params);
  }

  error(message: any, ...params: any[]) {
    this.logger.error(message, ...params);
  }

  fatal(message: any, ...params: any[]) {
    this.logger.fatal(message, ...params);
  }
}
