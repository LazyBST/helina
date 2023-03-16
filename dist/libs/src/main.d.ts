import { NestFastifyApplication } from '@nestjs/platform-fastify';
declare function bootstrap(appModule: any): Promise<NestFastifyApplication>;
declare const service: {
    start: typeof bootstrap;
};
export default service;
