import * as winston from 'winston';
import { LoggerModuleOptions } from '../interfaces';
export declare class LoggerService {
    private loggerOptions;
    myFormat: any;
    options: winston.LoggerOptions;
    logger: winston.Logger;
    private name;
    private colormap;
    constructor(loggerOptions: LoggerModuleOptions);
    toString(msgs: any): string;
    logprint(info: any): string;
    get logopts(): any;
    debug(message: any): void;
    info(message: any): void;
    warn(message: any): void;
    error(message: any): void;
}
