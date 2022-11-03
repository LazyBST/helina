import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';
import { IConsumer } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@libs/logger';
export declare class KafkajsConsumer implements IConsumer {
    private readonly producer;
    private readonly configService;
    private readonly logger;
    private readonly topics;
    private readonly config;
    private readonly brokers;
    private readonly kafka;
    private readonly consumer;
    private messageProccessedCount;
    private processingStartTime;
    private readonly messageComitTimeLimit;
    private readonly messageComitCountLimit;
    constructor(producer: ProducerService, configService: ConfigService, logger: LoggerService, topics: ConsumerSubscribeTopics, config: ConsumerConfig, brokers: string[]);
    consume(onMessage: (message: KafkaMessage) => Promise<void>): Promise<void>;
    private addMessageToDlq;
    connect(): Promise<void>;
    commit(topic: string, partition: number, offset: string): Promise<void>;
    disconnect(): Promise<void>;
}
