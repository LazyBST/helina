"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const _1 = require(".");
const unauthorized_1 = require("./unauthorized");
let ExceptionFilter = class ExceptionFilter extends core_1.BaseExceptionFilter {
    doNotReport() {
        return [
            common_1.NotFoundException,
            _1.ValidationFailed,
            _1.InvalidCredentials,
            _1.GenericException,
            unauthorized_1.Unauthorized,
            common_1.UnauthorizedException,
        ];
    }
    catch(exception, host) {
        console.error('ERRRR ==> ', exception);
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        if (exception instanceof _1.ValidationFailed) {
            return response.error({
                message: exception.message,
                errors: exception.getErrors(),
            }, exception.getStatus());
        }
        let message = exception.message || 'Something went wrong. Please try again later';
        const status = exception.status ? exception.status : 500;
        message = exception.status ? message : 'Internal Server Error';
        return response.status(status).json({
            success: false,
            code: status,
            message,
        });
    }
};
ExceptionFilter = __decorate([
    (0, common_1.Catch)()
], ExceptionFilter);
exports.ExceptionFilter = ExceptionFilter;
//# sourceMappingURL=filter.js.map