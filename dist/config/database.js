"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('db', () => ({
    db_host: process.env.DB_HOST,
    db_username: process.env.DB_USERNAME,
    db_password: process.env.DB_PASSWORD,
    db_run_migrations: process.env.DB_RUN_MIGRATIONS,
    db_port: +process.env.DB_PORT
}));
//# sourceMappingURL=database.js.map