import { OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'kafkajs';
import { LoggerService } from '@libs/logger';
export declare class ProducerService implements OnApplicationShutdown {
    private readonly configService;
    private readonly logger;
    private readonly producers;
    constructor(configService: ConfigService, logger: LoggerService);
    produce(topic: string, message: Message[]): Promise<void>;
    private getProducer;
    onApplicationShutdown(): Promise<void>;
}
