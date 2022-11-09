import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
} from 'kafkajs';
import retry from 'async-retry';
import { sleep } from '../../utils/sleep';
import { IConsumer } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../../logger';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;

  private messageProccessedCount: number;
  private processingStartTime: Date;
  private readonly messageComitTimeLimit: number;
  private readonly messageComitCountLimit: number;

  constructor(
    private readonly producer: ProducerService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService,
    private readonly topics: ConsumerSubscribeTopics,
    private readonly config: ConsumerConfig,
    private readonly brokers: string[],
  ) {
    this.messageProccessedCount = 0;
    this.processingStartTime = new Date();

    this.messageComitTimeLimit = this.configService.get('KF_COMMIT_TIME_MS');
    this.messageComitCountLimit = this.configService.get(
      'KF_COMMIT_MESSAGE_COUNT',
    );

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
      this.consumer = this.kafka.consumer(this.config);
    } catch (err) {
      this.logger.error(`Error creating Kafka consumer :: ${err}`);
      return;
    }
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    await this.consumer.subscribe(this.topics);
    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await onMessage(message);
          this.messageProccessedCount++;

          const timeInterval =
            new Date().getTime() - this.processingStartTime.getTime();

          if (
            this.messageProccessedCount >= this.messageComitCountLimit ||
            timeInterval >= this.messageComitTimeLimit
          ) {
            this.logger.info(
              `Commit at ${this.messageProccessedCount} messages and timeInterval ${timeInterval}`,
            );
            await this.commit(
              topic,
              partition,
              (Number(message.offset) + 1).toString(),
            );

            this.messageProccessedCount = 0;
            this.processingStartTime = new Date();
          }
        } catch (err) {
          this.logger.error(
            `Error consuming message. Adding to dead letter queue :: ${err}`,
          );
          await this.addMessageToDlq([message]);
        }
      },
    });
  }

  private async addMessageToDlq(message: KafkaMessage[]) {
    const errorTopic = this.configService.get<string>('KF_ERROR_TOPIC');
    await this.producer.produce(errorTopic, message);
  }

  async connect() {
    try {
      await this.consumer.connect();
    } catch (err) {
      this.logger.error(`Failed to connect to Kafka :: ${err}`);
      await sleep(this.configService.get('KF_RECONNECTION_INTERVAL_MS'));
      await this.connect();
    }
  }

  async commit(topic: string, partition: number, offset: string) {
    await this.consumer.commitOffsets([{ topic, partition, offset }]);
  }

  async disconnect() {
    await this.consumer.disconnect();
  }
}
