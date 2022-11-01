import { Message } from 'kafkajs';
import { IProducer } from '../../interfaces';
import { ConfigService } from '@nestjs/config';
export declare class KafkajsProducer implements IProducer {
    private readonly topic;
    private readonly configService;
    private readonly kafka;
    private readonly producer;
    private readonly logger;
    constructor(topic: string, broker: string, configService: ConfigService);
    produce(messages: Message[]): Promise<void>;
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}
