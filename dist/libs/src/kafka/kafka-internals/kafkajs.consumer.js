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
exports.KafkajsConsumer = void 0;
const logger_1 = require("../../logger");
const kafkajs_1 = require("kafkajs");
const retry = __importStar(require("async-retry"));
const sleep_1 = require("../../utils/sleep");
class KafkajsConsumer {
    constructor(producer, topics, config, brokers, configService) {
        this.producer = producer;
        this.topics = topics;
        this.configService = configService;
        const kafkaMechnism = this.configService.get('KF_MECHANISM');
        const kafkaUsername = this.configService.get('KF_USERNAME');
        const kafkaPassword = this.configService.get('KF_PASSWORD');
        if (kafkaMechnism !== 'plain') {
            return;
        }
        this.kafka = new kafkajs_1.Kafka({
            brokers,
            sasl: {
                mechanism: kafkaMechnism,
                username: kafkaUsername,
                password: kafkaPassword,
            },
        });
        this.consumer = this.kafka.consumer(config);
        this.logger = new logger_1.Logger(`${topics.topics}-${config.groupId}`);
    }
    async consume(onMessage) {
        let messageProccessedCount = 0;
        let processingStartTime = new Date();
        await this.consumer.subscribe(this.topics);
        await this.consumer.run({
            autoCommit: false,
            eachMessage: async ({ topic, message, partition }) => {
                this.logger.debug(`Processing message partition: ${partition}`);
                const retryCount = this.configService.get('KF_CONSUMER_RETRIES');
                try {
                    await retry(async () => onMessage(message), {
                        retries: retryCount,
                        onRetry: (error, attempt) => this.logger.error(`Error consuming message, executing retry ${attempt}/3 :: ${error}`),
                    });
                    messageProccessedCount++;
                    const timeInterval = new Date().getTime() - processingStartTime.getTime();
                    if (messageProccessedCount >= this.commitMessageCount ||
                        timeInterval >= this.commitTimeMs) {
                        await this.commit(topic, partition, (Number(message.offset) + 1).toString());
                    }
                }
                catch (err) {
                    this.logger.error(`Error consuming message. Adding to dead letter queue :: ${err}`);
                    await this.addMessageToDlq(message);
                }
            },
        });
    }
    async addMessageToDlq(message) {
        await this.producer.produce('Error_topic', message);
    }
    async connect() {
        try {
            await this.consumer.connect();
        }
        catch (err) {
            this.logger.error(`Failed to connect to Kafka :: ${err}`);
            await (0, sleep_1.sleep)(this.configService.get('KF_RECONNECTION_INTERVAL_MS'));
            await this.connect();
        }
    }
    async commit(topic, partition, offset) {
        await this.consumer.commitOffsets([{ topic, partition, offset }]);
    }
    async disconnect() {
        await this.consumer.disconnect();
    }
}
exports.KafkajsConsumer = KafkajsConsumer;
//# sourceMappingURL=kafkajs.consumer.js.map