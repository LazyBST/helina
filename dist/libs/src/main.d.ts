import { NestFastifyApplication } from '@nestjs/platform-fastify';
declare function bootstrap(appModule: any): Promise<NestFastifyApplication>;
export declare const service: {
    start: typeof bootstrap;
};
export {};
