import { ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
export declare class ExceptionFilter extends BaseExceptionFilter {
    doNotReport(): Array<any>;
    catch(exception: any, host: ArgumentsHost): any;
}
