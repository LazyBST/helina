"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelinaModule = void 0;
const common_1 = require("@nestjs/common");
const index_1 = __importDefault(require("../../config/index"));
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const validator_1 = require("./validator");
const kafka_module_1 = require("./kafka/kafka.module");
const redis_1 = require("./redis");
let HelinaModule = class HelinaModule {
};
HelinaModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            core_1.DiscoveryModule,
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                expandVariables: true,
                load: index_1.default,
            }),
            kafka_module_1.KafkaModule,
        ],
        providers: [validator_1.BaseValidator, redis_1.RedisService],
        exports: [],
    })
], HelinaModule);
exports.HelinaModule = HelinaModule;
//# sourceMappingURL=module.js.map