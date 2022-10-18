"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('db', () => ({
    redis_host: process.env.REDIS_HOST,
    redis_port: +process.env.REDIS_PORT
}));
//# sourceMappingURL=redis.js.map