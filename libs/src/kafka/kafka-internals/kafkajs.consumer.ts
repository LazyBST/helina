import { Logger } from '../../logger';
import {
  Consumer,
  ConsumerConfig,
  ConsumerSubscribeTopics,
  Kafka,
  KafkaMessage,
  Producer,
} from 'kafkajs';
import * as retry from 'async-retry';
import { sleep } from '../../utils/sleep';
import { IConsumer } from '../../interfaces';
import { ProducerService } from '../service/producer.service';
import { ConfigService } from '@nestjs/config';

export class KafkajsConsumer implements IConsumer {
  private readonly kafka: Kafka;
  private readonly consumer: Consumer;
  private readonly logger: Logger;

  commitMessageCount: number;
  commitTimeMs: number;

  constructor(
    private readonly producer: ProducerService,
    private readonly topics: ConsumerSubscribeTopics,
    config: ConsumerConfig,
    broker: string,
    private readonly configService: ConfigService,
  ) {
    this.kafka = new Kafka({ brokers: [broker] });
    this.consumer = this.kafka.consumer(config);
    this.logger = new Logger(`${topics.topics}-${config.groupId}`);
  }

  async consume(onMessage: (message: KafkaMessage) => Promise<void>) {
    let messageProccessedCount = 0;
    let processingStartTime = new Date();
    await this.consumer.subscribe(this.topics);
    await this.consumer.run({
      autoCommit: false,
      eachMessage: async ({ topic, message, partition }) => {
        this.logger.debug(`Processing message partition: ${partition}`);
        try {
          await retry(async () => onMessage(message), {
            retries: 3,
            onRetry: (error, attempt) =>
              this.logger.error(
                `Error consuming message, executing retry ${attempt}/3 :: ${error}`,
              ),
          });

          messageProccessedCount++;

          const timeInterval =
            new Date().getTime() - processingStartTime.getTime();

          if (
            messageProccessedCount >= this.commitMessageCount ||
            timeInterval >= this.commitTimeMs
          ) {
            await this.commit(
              topic,
              partition,
              (Number(message.offset) + 1).toString(),
            );
          }
        } catch (err) {
          this.logger.error(
            `Error consuming message. Adding to dead letter queue :: ${err}`,
          );
          await this.addMessageToDlq(message);
        }
      },
    });
  }

  private async addMessageToDlq(message: KafkaMessage) {
    await this.producer.produce('Error_topic', message);
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
