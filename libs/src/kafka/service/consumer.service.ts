import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkajsConsumer } from '../kafka-internals/kafkajs.consumer';
import { KafkajsConsumerOptions, IConsumer } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
import { LoggerService } from '../../logger';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly ProducerService: ProducerService,
    private readonly logger: LoggerService,
  ) {}

  async consume({ topics, config, onMessage }: KafkajsConsumerOptions) {
    const brokers = this.configService.get<string>('KF_BROKER').split(',');

    const consumer = new KafkajsConsumer(
      this.ProducerService,
      this.configService,
      this.logger,
      topics,
      config,
      brokers,
    );
    await consumer.connect();
    await consumer.consume(onMessage);
    this.consumers.push(consumer);
  }

  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }

  getConsumers():IConsumer[] {
    return this.consumers
  }
}