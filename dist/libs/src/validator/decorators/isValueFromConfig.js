"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IsValueFromConfig = exports.IsValueFromConfigConstraint = void 0;
const class_validator_1 = require("class-validator");
const lodash_1 = require("lodash");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let IsValueFromConfigConstraint = class IsValueFromConfigConstraint {
    constructor(config) {
        this.config = config;
    }
    validate(value, args) {
        const [options] = args.constraints;
        const validValues = this.getValues(options.key);
        if ((0, lodash_1.isEmpty)(validValues) || !(0, lodash_1.isArray)(validValues)) {
            return false;
        }
        if (validValues.includes(value)) {
            return true;
        }
        return false;
    }
    defaultMessage(args) {
        const [options] = args.constraints;
        const validValues = this.getValues(options.key);
        return `${args.property} should have either of ${validValues.join(', ')} as value`;
    }
    getValues(key) {
        let validValues = this.config.get(key);
        if ((0, lodash_1.isObject)(validValues)) {
            validValues = Object.values(validValues);
        }
        return validValues;
    }
};
IsValueFromConfigConstraint = __decorate([
    (0, common_1.Injectable)(),
    (0, class_validator_1.ValidatorConstraint)({ async: false }),
    __metadata("design:paramtypes", [config_1.ConfigService])
], IsValueFromConfigConstraint);
exports.IsValueFromConfigConstraint = IsValueFromConfigConstraint;
function IsValueFromConfig(options, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsValueFromConfigConstraint,
        });
    };
}
exports.IsValueFromConfig = IsValueFromConfig;
//# sourceMappingURL=isValueFromConfig.js.map