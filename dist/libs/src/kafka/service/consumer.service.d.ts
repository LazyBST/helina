import { OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkajsConsumerOptions } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
import { LoggerService } from '@libs/logger';
export declare class ConsumerService implements OnApplicationShutdown {
    private readonly configService;
    private readonly ProducerService;
    private readonly logger;
    private readonly consumers;
    constructor(configService: ConfigService, ProducerService: ProducerService, logger: LoggerService);
    consume({ topics, config, onMessage }: KafkajsConsumerOptions): Promise<void>;
    onApplicationShutdown(): Promise<void>;
}
