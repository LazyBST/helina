"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestServer = void 0;
const core_1 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const config_1 = require("@nestjs/config");
const guards_1 = require("./guards");
const exceptions_1 = require("../exceptions");
class RestServer {
    static async make(module, options) {
        const app = await core_1.NestFactory.create(module);
        if (options === null || options === void 0 ? void 0 : options.addValidationContainer) {
            (0, class_validator_1.useContainer)(app.select(module), { fallbackOnErrors: true });
        }
        app.enableCors({ origin: true });
        app.useGlobalGuards(new guards_1.RequestGuard());
        const { httpAdapter } = app.get(core_1.HttpAdapterHost);
        app.useGlobalFilters(new exceptions_1.ExceptionFilter(httpAdapter));
        options.globalPrefix && app.setGlobalPrefix(options.globalPrefix);
        const config = app.get(config_1.ConfigService, { strict: false });
        await app.listen(options.port || config.get('app.port'));
    }
}
exports.RestServer = RestServer;
//# sourceMappingURL=restServer.js.map