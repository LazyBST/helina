import { ValidationOptions, ValidationArguments, ValidatorConstraintInterface } from 'class-validator';
import { ConfigService } from '@nestjs/config';
export declare class IsValueFromConfigConstraint implements ValidatorConstraintInterface {
    private config;
    constructor(config: ConfigService);
    validate(value: string, args: ValidationArguments): boolean;
    defaultMessage(args: ValidationArguments): string;
    private getValues;
}
export declare function IsValueFromConfig(options: Record<string, any>, validationOptions?: ValidationOptions): (object: Record<string, any>, propertyName: string) => void;
