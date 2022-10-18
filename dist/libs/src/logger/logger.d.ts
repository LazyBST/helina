import * as winston from 'winston';
export declare class Logger {
    myFormat: any;
    options: winston.LoggerOptions;
    logger: winston.Logger;
    private name;
    private colormap;
    constructor(name: string);
    static toString(msgs: any): string;
    logprint(info: any): string;
    static getLogger(name: string): Logger;
    get logopts(): any;
    debug(format: any, ...params: any[]): void;
    info(format: any, ...params: any[]): void;
    warn(format: any, ...params: any[]): void;
    error(format: any, ...params: any[]): void;
}
