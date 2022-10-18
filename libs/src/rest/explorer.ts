import { Injectable } from '@nestjs/common';
import { DiscoveryService } from '@nestjs/core';
import { HttpMetadata } from './metadata';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HttpExplorer {
  constructor(
    private readonly config: ConfigService,
    private readonly discovery: DiscoveryService,
  ) {}

  onModuleInit() {
    HttpMetadata.setBaseUrl(this.config.get('app.url'));

    const wrappers = this.discovery.getControllers();

    wrappers.forEach((w) => {
      const { instance, metatype } = w;
      if (
        !instance ||
        typeof instance === 'string' ||
        !Object.getPrototypeOf(instance)
      ) {
        return;
      }
    });
  }
}
