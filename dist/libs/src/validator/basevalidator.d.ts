import { Type } from '@nestjs/common';
export declare class BaseValidator {
    fire<T>(inputs: Record<string, any>, schemaMeta: Type<T>): Promise<T>;
    parseError(error: any): {};
}
