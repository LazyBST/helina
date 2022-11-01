import { HttpException } from '@nestjs/common';
export declare class GenericException extends HttpException {
    constructor(message?: string);
}
