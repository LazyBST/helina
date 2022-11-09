import { ConsumerConfig, ConsumerSubscribeTopics, KafkaMessage } from 'kafkajs';

export interface KafkajsConsumerOptions {
  topics: ConsumerSubscribeTopics;
  config: ConsumerConfig;
  onMessage: (message: KafkaMessage) => Promise<void>;
}
