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
exports.ConsumerService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const kafkajs_consumer_1 = require("../kafka-internals/kafkajs.consumer");
const producer_service_1 = require("../service/producer.service");
let ConsumerService = class ConsumerService {
    constructor(configService, ProducerService) {
        this.configService = configService;
        this.ProducerService = ProducerService;
        this.consumers = [];
    }
    async consume({ topics, config, onMessage }) {
        const consumer = new kafkajs_consumer_1.KafkajsConsumer(this.ProducerService, topics, config, this.configService.get('KF_BROKER'), this.configService);
        await consumer.connect();
        await consumer.consume(onMessage);
        this.consumers.push(consumer);
    }
    async onApplicationShutdown() {
        for (const consumer of this.consumers) {
            await consumer.disconnect();
        }
    }
};
ConsumerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        producer_service_1.ProducerService])
], ConsumerService);
exports.ConsumerService = ConsumerService;
//# sourceMappingURL=consumer.service.js.map