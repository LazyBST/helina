import { Request } from '../rest';
export declare class Context {
    req: Request;
    setRequest(req: Request): this;
    getRequest(): Request;
}
