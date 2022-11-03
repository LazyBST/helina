import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../logger';
import { ConsumerService } from './service/consumer.service';
import { ProducerService } from './service/producer.service';

@Module({
  // TODO: test if this solve resolving in client app
  imports: [ConfigModule, LoggerModule],
  providers: [ProducerService, ConsumerService],
  exports: [ProducerService, ConsumerService],
})
export class KafkaModule {}
