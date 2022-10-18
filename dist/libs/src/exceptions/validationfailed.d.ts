import { HttpException } from '@nestjs/common';
export declare class ValidationFailed extends HttpException {
    private errors;
    constructor(errors: Record<string, any>);
    getErrors(): Record<string, any>;
}
