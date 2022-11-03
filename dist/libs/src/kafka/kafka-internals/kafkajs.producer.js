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
const kafkajs_1 = require("kafkajs");
const sleep_1 = require("../../utils/sleep");
const retry = __importStar(require("async-retry"));
class KafkajsProducer {
    constructor(configService, logger, topic, brokers) {
        this.configService = configService;
        this.logger = logger;
        this.topic = topic;
        this.brokers = brokers;
        const kafkaMechnism = this.configService.get('KF_MECHANISM');
        const kafkaUsername = this.configService.get('KF_USERNAME');
        const kafkaPassword = this.configService.get('KF_PASSWORD');
        if (kafkaMechnism !== 'plain') {
            this.logger.error(`Only PLAIN mechanism is supported for kafka`);
            return;
        }
        try {
            this.kafka = new kafkajs_1.Kafka({
                brokers: this.brokers,
                ssl: true,
                sasl: {
                    mechanism: kafkaMechnism,
                    username: kafkaUsername,
                    password: kafkaPassword,
                },
            });
            this.producer = this.kafka.producer();
        }
        catch (err) {
            this.logger.error(`Error creating Kafka producer :: ${err}`);
            return;
        }
    }
    async produce(messages) {
        const retryCount = this.configService.get('KF_PRODUCER_RETRIES');
        retry(async () => this.producer.send({ topic: this.topic, messages }), {
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