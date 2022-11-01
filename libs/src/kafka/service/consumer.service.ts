import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkajsConsumer } from '../kafka-internals/kafkajs.consumer';
import { KafkajsConsumerOptions, IConsumer } from '../../interfaces';
import { ProducerService } from '../service/producer.service';

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  private readonly consumers: IConsumer[] = [];

  constructor(
    private readonly configService: ConfigService,
    private readonly ProducerService: ProducerService,
  ) {}

  async consume({ topics, config, onMessage }: KafkajsConsumerOptions) {
    const consumer = new KafkajsConsumer(
      this.ProducerService,
      topics,
      config,
      this.configService.get('KF_BROKER'),
      this.configService,
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
}
