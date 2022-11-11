import { Global, Module } from '@nestjs/common';
import config from '@config/index';
import { ConfigModule } from '@nestjs/config';
import { DiscoveryModule } from '@nestjs/core';
import { BaseValidator } from './validator';
import { KafkaModule } from './kafka/kafka.module';
import { RedisService } from './redis';

@Global()
@Module({
  imports: [
    DiscoveryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: config,
    }),
    KafkaModule,
  ],
  providers: [BaseValidator, RedisService],
  exports: [],
})
export class HelinaModule {}
