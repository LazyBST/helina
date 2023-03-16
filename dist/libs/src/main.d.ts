import { NestFastifyApplication } from '@nestjs/platform-fastify';
declare function bootstrap(appModule: any): Promise<NestFastifyApplication>;
export declare const RootService: {
    start: typeof bootstrap;
};
export {};
