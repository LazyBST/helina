"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('redis', () => ({
    redis_host: process.env.REDIS_HOST,
    redis_port: +process.env.REDIS_PORT,
    redis_pass: process.env.REDIS_PASS,
}));
//# sourceMappingURL=redis.js.map