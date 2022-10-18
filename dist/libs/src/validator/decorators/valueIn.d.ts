import { ValidationOptions } from 'class-validator';
export declare function ValueIn(validValues: Array<any> | any, validationOptions?: ValidationOptions): (object: Record<string, any>, propertyName: string) => void;
