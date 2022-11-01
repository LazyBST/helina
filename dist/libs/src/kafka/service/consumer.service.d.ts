import { OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkajsConsumerOptions } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
export declare class ConsumerService implements OnApplicationShutdown {
    private readonly configService;
    private readonly ProducerService;
    private readonly consumers;
    constructor(configService: ConfigService, ProducerService: ProducerService);
    consume({ topics, config, onMessage }: KafkajsConsumerOptions): Promise<void>;
    onApplicationShutdown(): Promise<void>;
}
