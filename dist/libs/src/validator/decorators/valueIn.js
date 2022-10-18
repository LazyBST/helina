"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValueIn = void 0;
const class_validator_1 = require("class-validator");
let ValueInConstraint = class ValueInConstraint {
    async validate(value, args) {
        const [validValues] = args.constraints;
        if (typeof value === 'string') {
            return validValues.includes(value);
        }
        if (value instanceof Array) {
            const difference = value.filter((x) => validValues.indexOf(x) === -1);
            return !difference.length;
        }
        return false;
    }
    defaultMessage(args) {
        const property = args.property;
        return `${property} contains invalid values`;
    }
};
ValueInConstraint = __decorate([
    (0, class_validator_1.ValidatorConstraint)({ async: true })
], ValueInConstraint);
function ValueIn(validValues, validationOptions) {
    return function (object, propertyName) {
        (0, class_validator_1.registerDecorator)({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [validValues],
            validator: ValueInConstraint,
        });
    };
}
exports.ValueIn = ValueIn;
//# sourceMappingURL=valueIn.js.map