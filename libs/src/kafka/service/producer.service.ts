import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Message } from 'kafkajs';
import { KafkajsProducer } from '../kafka-internals/kafkajs.producer';
import { IProducer } from '../../interfaces';
import { LoggerService } from '../../logger';

@Injectable()
export class ProducerService implements OnApplicationShutdown {
  private readonly producers = new Map<string, IProducer>();

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
  ) {}

  async produce(topic: string, message: Message[]) {
    const producer = await this.getProducer(topic);
    await producer.produce(message);
  }

  private async getProducer(topic: string) {
    let producer = this.producers.get(topic);
    if (!producer) {
      producer = new KafkajsProducer(
        this.configService,
        this.logger,
        topic,
        this.configService.get<string>('KF_BROKER').split(','),
      );
      await producer.connect();
      this.producers.set(topic, producer);
    }
    return producer;
  }

  async onApplicationShutdown() {
    for (const producer of this.producers.values()) {
      await producer.disconnect();
    }
  }
}
