import { NestFastifyApplication } from '@nestjs/platform-fastify';
declare function bootstrap(appModule: any, serviceName: string): Promise<NestFastifyApplication>;
declare const service: {
    start: typeof bootstrap;
};
export default service;
