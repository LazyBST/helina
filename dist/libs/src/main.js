"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootService = void 0;
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const logger_1 = require("./logger");
const interceptors_1 = require("./interceptors");
const typeorm_1 = require("typeorm");
const instrumentation_1 = __importDefault(require("./instrumentation"));
async function bootstrap(appModule) {
    await instrumentation_1.default.start();
    const app = await core_1.NestFactory.create(appModule, new platform_fastify_1.FastifyAdapter());
    const db_conn = app.get(typeorm_1.DataSource);
    await db_conn.runMigrations();
    const config = app.get(config_1.ConfigService);
    console.log({ config });
    const logger = app.get(logger_1.LoggerService);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
    }));
    app.useGlobalInterceptors(new interceptors_1.LoggingInterceptor(logger));
    const serviceName = config.get('SERVICE_NAME');
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
        prefix: `${serviceName}/v`,
    });
    const port = config.get('PORT');
    if (!port) {
        logger.error('Error getting PORT from env');
        throw new Error('Error getting PORT from env');
    }
    console.log({ port });
    await app.listen(port, '0.0.0.0');
    return app;
}
exports.RootService = {
    start: bootstrap,
};
//# sourceMappingURL=main.js.map