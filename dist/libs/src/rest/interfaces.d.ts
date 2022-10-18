import { Request as BaseRequest } from 'express';
import { Response as BaseResponse } from 'express';
export interface Request extends BaseRequest {
    all(): Record<string, any>;
    user: Record<string, any>;
}
export interface Response extends BaseResponse {
    success(data: Record<string, any> | Array<any> | string, status?: number | string): any;
    error(error: Record<string, any> | string, status?: number | string): any;
    noContent(): any;
}
export interface ServerOptions {
    addValidationContainer?: boolean;
    port?: number;
    globalPrefix?: string;
}
