import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';
import { IConsumer } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
import { ConfigService } from '@nestjs/config';
export declare class KafkajsConsumer implements IConsumer {
    private readonly producer;
    private readonly topics;
    private readonly configService;
    private readonly kafka;
    private readonly consumer;
    private readonly logger;
    commitMessageCount: number;
    commitTimeMs: number;
    constructor(producer: ProducerService, topics: ConsumerSubscribeTopics, config: ConsumerConfig, brokers: string[], configService: ConfigService);
    consume(onMessage: (message: KafkaMessage) => Promise<void>): Promise<void>;
    private addMessageToDlq;
    connect(): Promise<void>;
    commit(topic: string, partition: number, offset: string): Promise<void>;
    disconnect(): Promise<void>;
}
