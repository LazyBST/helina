import { Message, RecordMetadata } from 'kafkajs';
import { IProducer } from '../../interfaces';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger';
export declare class KafkajsProducer implements IProducer {
    private readonly configService;
    private readonly logger;
    private readonly topic;
    private readonly brokers;
    private readonly kafka;
    private readonly producer;
    constructor(configService: ConfigService, logger: LoggerService, topic: string, brokers: string[]);
    produce(messages: Message[]): Promise<RecordMetadata[]>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
