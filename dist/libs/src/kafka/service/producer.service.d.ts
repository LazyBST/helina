import { OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'kafkajs';
export declare class ProducerService implements OnApplicationShutdown {
    private readonly configService;
    private readonly producers;
    constructor(configService: ConfigService);
    produce(topic: string, message: Message[]): Promise<void>;
    private getProducer;
    onApplicationShutdown(): Promise<void>;
}
