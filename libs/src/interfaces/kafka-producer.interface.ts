import { RecordMetadata } from 'kafkajs';

export interface IProducer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  produce: (message: any) => Promise<RecordMetadata[]>;
}
