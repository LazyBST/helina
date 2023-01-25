"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkajsProducer = void 0;
const kafkajs_1 = require("kafkajs");
const sleep_1 = require("../../utils/sleep");
const async_retry_1 = __importDefault(require("async-retry"));
class KafkajsProducer {
    constructor(configService, logger, topic, brokers) {
        this.configService = configService;
        this.logger = logger;
        this.topic = topic;
        this.brokers = brokers;
        const kafkaMechnism = this.configService.get('KF_MECHANISM');
        const kafkaUsername = this.configService.get('KF_USERNAME');
        const kafkaPassword = this.configService.get('KF_PASSWORD');
        const kafkaSsl = this.configService.get('KF_SSL');
        if (kafkaMechnism !== 'plain') {
            this.logger.error(`Only PLAIN mechanism is supported for kafka`);
            return;
        }
        const sasl = kafkaUsername && kafkaPassword
            ? {
                mechanism: kafkaMechnism,
                username: kafkaUsername,
                password: kafkaPassword,
            }
            : undefined;
        try {
            this.kafka = new kafkajs_1.Kafka({
                brokers: this.brokers,
                ssl: kafkaSsl === 'true',
                sasl,
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
        return (0, async_retry_1.default)(async () => this.producer.send({ topic: this.topic, messages }), {
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