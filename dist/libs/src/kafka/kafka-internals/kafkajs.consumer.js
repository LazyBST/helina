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
const kafkajs_1 = require("kafkajs");
const retry = __importStar(require("async-retry"));
const sleep_1 = require("../../utils/sleep");
class KafkajsConsumer {
    constructor(producer, configService, logger, topics, config, brokers) {
        this.producer = producer;
        this.configService = configService;
        this.logger = logger;
        this.topics = topics;
        this.config = config;
        this.brokers = brokers;
        this.messageProccessedCount = 0;
        this.processingStartTime = new Date();
        this.messageComitTimeLimit = this.configService.get('KF_COMMIT_TIME_MS');
        this.messageComitCountLimit = this.configService.get('KF_COMMIT_MESSAGE_COUNT');
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
            this.consumer = this.kafka.consumer(this.config);
        }
        catch (err) {
            this.logger.error(`Error creating Kafka consumer :: ${err}`);
            return;
        }
    }
    async consume(onMessage) {
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
                    this.messageProccessedCount++;
                    const timeInterval = new Date().getTime() - this.processingStartTime.getTime();
                    if (this.messageProccessedCount >= this.messageComitCountLimit ||
                        timeInterval >= this.messageComitTimeLimit) {
                        this.logger.info(`Commit at ${this.messageProccessedCount} messages and timeInterval ${timeInterval}`);
                        await this.commit(topic, partition, (Number(message.offset) + 1).toString());
                        this.messageProccessedCount = 0;
                        this.processingStartTime = new Date();
                    }
                }
                catch (err) {
                    this.logger.error(`Error consuming message. Adding to dead letter queue :: ${err}`);
                    await this.addMessageToDlq([message]);
                }
            },
        });
    }
    async addMessageToDlq(message) {
        const errorTopic = this.configService.get('KF_ERROR_TOPIC');
        await this.producer.produce(errorTopic, message);
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