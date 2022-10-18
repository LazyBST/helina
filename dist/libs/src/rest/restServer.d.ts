import { ServerOptions } from './interfaces';
export declare class RestServer {
    private module;
    private options;
    static make(module: any, options?: ServerOptions): Promise<void>;
}
