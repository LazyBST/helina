"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseValidator = void 0;
const lodash_1 = require("lodash");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const common_1 = require("@nestjs/common");
const exceptions_1 = require("../exceptions");
let BaseValidator = class BaseValidator {
    async fire(inputs, schemaMeta) {
        const schema = (0, class_transformer_1.plainToClass)(schemaMeta, inputs);
        const errors = await (0, class_validator_1.validate)(schema, {
            stopAtFirstError: true,
        });
        let bag = {};
        if (errors.length > 0) {
            for (const error of errors) {
                const errorsFromParser = this.parseError(error);
                const childErrorBag = {};
                for (const key in errorsFromParser) {
                    if (!(0, lodash_1.isEmpty)(errorsFromParser[key])) {
                        childErrorBag[key] = errorsFromParser[key];
                    }
                }
                bag = Object.assign(Object.assign({}, bag), childErrorBag);
            }
            throw new exceptions_1.ValidationFailed(bag);
        }
        return schema;
    }
    parseError(error) {
        const children = [];
        for (const child of error.children || []) {
            children.push(this.parseError(child));
        }
        const messages = [];
        for (const c in error.constraints) {
            let message = error.constraints[c];
            message = message.replace(error.property, (0, lodash_1.startCase)(error.property));
            messages.push(message);
        }
        const errors = {};
        if (!(0, lodash_1.isEmpty)(messages)) {
            errors[error.property] = messages;
        }
        for (const child of children) {
            for (const key in child) {
                errors[`${error.property}.${key}`] = child[key];
            }
        }
        return errors;
    }
};
BaseValidator = __decorate([
    (0, common_1.Injectable)()
], BaseValidator);
exports.BaseValidator = BaseValidator;
//# sourceMappingURL=basevalidator.js.map