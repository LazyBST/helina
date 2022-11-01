import { Module } from '@nestjs/common';
import { ConsumerService } from './service/consumer.service';
import { ProducerService } from './service/producer.service';

@Module({
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
