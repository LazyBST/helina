import { DiscoveryService } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
export declare class HttpExplorer {
    private readonly config;
    private readonly discovery;
    constructor(config: ConfigService, discovery: DiscoveryService);
    onModuleInit(): void;
}
