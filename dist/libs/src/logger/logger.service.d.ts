import * as winston from 'winston';
export declare class LoggerService {
    myFormat: any;
    options: winston.LoggerOptions;
    logger: winston.Logger;
    private name;
    private colormap;
    constructor(name: string);
    toString(msgs: any): string;
    logprint(info: any): string;
    get logopts(): any;
    debug(message: any): void;
    info(message: any): void;
    warn(message: any): void;
    error(message: any): void;
}
