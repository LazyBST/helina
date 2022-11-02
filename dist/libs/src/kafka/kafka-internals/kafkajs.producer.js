"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkajsProducer = void 0;
const logger_1 = require("../../logger");
const kafkajs_1 = require("kafkajs");
const sleep_1 = require("../../utils/sleep");
const retry = __importStar(require("async-retry"));
class KafkajsProducer {
    constructor(topic, brokers, configService) {
        this.topic = topic;
        this.configService = configService;
        this.kafka = new kafkajs_1.Kafka({
            brokers,
        });
        this.producer = this.kafka.producer();
        this.logger = new logger_1.Logger(topic);
    }
    async produce(messages) {
        const retryCount = this.configService.get('KF_PRODUCER_RETRIES');
        retry(async () => this.producer.send({ topic: this.topic, messages: messages }), {
            retries: retryCount,
            onRetry: async (error, attempt) => {
                this.logger.error(`Error producing message, executing retry ${attempt}/${retryCount} :: ${error}`);
            },
        });
    }
    async connect() {
        try {
            await this.producer.connect();
        }
        catch (err) {
            this.logger.error(`Failed to connect to Kafka :: ${err}`);
            await (0, sleep_1.sleep)(this.configService.get('KF_RECONNECTION_INTERVAL_MS'));
            await this.connect();
        }
    }
    async disconnect() {
        await this.producer.disconnect();
    }
}
exports.KafkajsProducer = KafkajsProducer;
//# sourceMappingURL=kafkajs.producer.js.map