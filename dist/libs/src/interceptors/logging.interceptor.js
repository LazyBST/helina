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
exports.LoggingInterceptor = void 0;
const logger_1 = require("../logger");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const uuid_1 = require("uuid");
let LoggingInterceptor = class LoggingInterceptor {
    constructor(logger, serviceName) {
        this.logger = logger;
        this.serviceName = serviceName;
    }
    intercept(context, next) {
        const now = Date.now();
        const request = context.switchToHttp().getRequest();
        const { statusCode } = context.switchToHttp().getResponse();
        const { originalUrl, method, params, query, body, headers, hostname, url, protocol, } = request;
        const uniqueId = (0, uuid_1.v4)();
        this.logger.info(`Request: id-${uniqueId} Serice Name-${this.serviceName}  ${method} ${protocol}://${hostname}${url}  ${JSON.stringify({
            originalUrl,
            params,
            query,
            body,
            headers,
        })}`);
        return next.handle().pipe((0, rxjs_1.tap)((data) => this.logger.info(`Response: id-${uniqueId} Serice Name-${this.serviceName}  ${method} ${protocol}://${hostname}${url}  latency: ${Date.now() - now}ms  ${JSON.stringify({
            statusCode,
            data,
        })}`)));
    }
};
LoggingInterceptor = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [logger_1.LoggerService, String])
], LoggingInterceptor);
exports.LoggingInterceptor = LoggingInterceptor;
//# sourceMappingURL=logging.interceptor.js.map