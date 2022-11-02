import { Inject, Injectable } from '@nestjs/common';
import * as winston from 'winston';
import * as colors from 'colors/safe';
import { LEVEL } from 'triple-beam';
import * as util from 'util';
import { MODULE_OPTIONS_TOKEN } from './logger.module-definition';
import { LoggerModuleOptions } from '../interfaces';

@Injectable()
export class LoggerService {
  myFormat: any = winston.format.printf((info) => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
  });

  options: winston.LoggerOptions = {
    exitOnError: false,
    level: 'debug',
  };

  logger: winston.Logger;

  private name: string;

  private colormap: any = {
    debug: colors.grey,
    info: colors.cyan,
    warn: colors.magenta,
    error: colors.red,
  };

  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private loggerOptions: LoggerModuleOptions,
  ) {
    const { appName: name } = this.loggerOptions;
    this.options.format = winston.format.combine(
      winston.format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      // winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({ label: name }),
      this.myFormat,
      winston.format.simple(),
      // winston.format.printf((info) => {
      //   return this.logprint(info);
      // }),
    );
    this.options.transports = [new winston.transports.Console()];

    this.logger = winston.createLogger(this.options);
    this.name = name;
  }

  toString(msgs: any): string {
    if (typeof msgs === 'string') {
      return msgs;
    }

    const mm: any[] = [];

    for (const m of msgs) {
      mm.push(util.format(m));
    }

    return mm.join(' ');
  }

  public logprint(info: any): string {
    const colorize: any = this.colormap[info[LEVEL]];

    let logmsg: string = `${colors.yellow(info.timestamp)} [${colors.green(
      info.label,
    )}] ${colorize(info.level)}: `;

    logmsg += colorize(this.toString(info.message));

    return logmsg;
  }

  get logopts(): any {
    return this.options;
  }

  debug(message: any): void {
    this.logger.debug(JSON.stringify(message));
  }

  info(message: any): void {
    this.logger.info(JSON.stringify(message));
  }

  warn(message: any): void {
    this.logger.warn(JSON.stringify(message));
  }

  error(message: any): void {
    this.logger.error(JSON.stringify(message));
  }
}
