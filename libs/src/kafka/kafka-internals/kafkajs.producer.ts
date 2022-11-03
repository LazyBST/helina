import { Kafka, Message, Producer } from 'kafkajs';
import { sleep } from '../../utils/sleep';
import { IProducer } from '../../interfaces';
import * as retry from 'async-retry';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger';

export class KafkajsProducer implements IProducer {
  private readonly kafka: Kafka;
  private readonly producer: Producer;

  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly topic: string,
    private readonly brokers: string[],
  ) {
    const kafkaMechnism = this.configService.get<string>('KF_MECHANISM');
    const kafkaUsername = this.configService.get<string>('KF_USERNAME');
    const kafkaPassword = this.configService.get<string>('KF_PASSWORD');

    if (kafkaMechnism !== 'plain') {
      this.logger.error(`Only PLAIN mechanism is supported for kafka`);
      return;
    }

    try {
      this.kafka = new Kafka({
        brokers: this.brokers,
        ssl: true,
        sasl: {
          mechanism: kafkaMechnism,
          username: kafkaUsername,
          password: kafkaPassword,
        },
      });
      this.producer = this.kafka.producer();
    } catch (err) {
      this.logger.error(`Error creating Kafka producer :: ${err}`);
      return;
    }
  }

  async produce(messages: Message[]) {
    const retryCount = this.configService.get('KF_PRODUCER_RETRIES');
    retry(async () => this.producer.send({ topic: this.topic, messages }), {
      retries: retryCount,
      onRetry: async (error, attempt) => {
        this.logger.error(
          `Error producing message, executing retry ${attempt}/${retryCount} :: ${error}`,
        );
      },
    });
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
