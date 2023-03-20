import { NestFastifyApplication } from '@nestjs/platform-fastify';
declare function bootstrap(appModule: any, serviceName: string): Promise<NestFastifyApplication>;
declare const RootService: {
    start: typeof bootstrap;
};
export { NestFastifyApplication, RootService };
