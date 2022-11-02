import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ConfigurableModuleClass } from './logger.module-definition';

@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule extends ConfigurableModuleClass {}
