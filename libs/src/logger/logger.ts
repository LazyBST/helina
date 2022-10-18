import * as winston from 'winston';
import * as colors from 'colors/safe';
import { LEVEL } from 'triple-beam';
import * as util from 'util';

export class Logger {
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
    info: colors.cyan, // (msg: string):string => { return msg; },
    warn: colors.magenta,
    error: colors.red,
  };

  constructor(name: string) {
    this.options.format = winston.format.combine(
      winston.format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      // winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'MMM DD hh:mm:ss' }),
      winston.format.label({ label: name }),
      winston.format.printf((info) => {
        return this.logprint(info);
      }),
    );
    this.options.transports = [new winston.transports.Console()];

    this.logger = winston.createLogger(this.options);
    this.name = name;
  }

  static toString(msgs: any): string {
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

    logmsg += colorize(Logger.toString(info.message));

    return logmsg;
  }

  public static getLogger(name: string): Logger {
    return new Logger(name);
  }

  get logopts(): any {
    return this.options;
  }

  debug(format: any, ...params: any[]): void {
    this.logger.debug([format].concat(params));
  }

  info(format: any, ...params: any[]): void {
    this.logger.info([format].concat(params));
  }

  warn(format: any, ...params: any[]): void {
    this.logger.warn([format].concat(params));
  }

  error(format: any, ...params: any[]): void {
    this.logger.error([format].concat(params));
  }
}
