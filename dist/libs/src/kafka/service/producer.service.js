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
exports.ProducerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_producer_1 = require("../kafka-internals/kafkajs.producer");
const logger_1 = require("../../logger");
let ProducerService = class ProducerService {
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.producers = new Map();
    }
    async produce(topic, message) {
        const producer = await this.getProducer(topic);
        return await producer.produce(message);
    }
    async getProducer(topic) {
        let producer = this.producers.get(topic);
        if (!producer) {
            producer = new kafkajs_producer_1.KafkajsProducer(this.configService, this.logger, topic, this.configService.get('KF_BROKER').split(','));
            await producer.connect();
            this.producers.set(topic, producer);
        }
        return producer;
    }
    async onApplicationShutdown() {
        for (const producer of this.producers.values()) {
            await producer.disconnect();
        }
    }
};
ProducerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        logger_1.LoggerService])
], ProducerService);
exports.ProducerService = ProducerService;
//# sourceMappingURL=producer.service.js.map