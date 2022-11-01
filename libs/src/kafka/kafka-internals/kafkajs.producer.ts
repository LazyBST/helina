import { Logger } from '../../logger';
import { Kafka, Message, Producer } from 'kafkajs';
import { sleep } from '../../utils/sleep';
import { IProducer } from '../../interfaces';
import * as retry from 'async-retry';
import { ConfigService } from '@nestjs/config';

export class KafkajsProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;
  private readonly logger: Logger;

  constructor(
    private readonly topic: string,
    broker: string,
    private readonly configService: ConfigService,
  ) {
    this.kafka = new Kafka({
      brokers: [broker],
    });
    this.producer = this.kafka.producer();
    this.logger = new Logger(topic);
  }

  async produce(messages: Message[]) {
    const retryCount = this.configService.get('KF_RETRIES');
    retry(
      async () => this.producer.send({ topic: this.topic, messages: messages }),
      {
        retries: retryCount,
        onRetry: async (error, attempt) => {
          this.logger.error(
            `Error producing message, executing retry ${attempt}/${retryCount} :: ${error}`,
          );
        },
      },
    );
  }

  async connect() {
    try {
      await this.producer.connect();
    } catch (err) {
      this.logger.error(`Failed to connect to Kafka :: ${err}`);
      await sleep(this.configService.get('KF_RECONNECTION_INTERVAL_MS'));
      await this.connect();
    }
  }

  async disconnect() {
    await this.producer.disconnect();
  }
}
