import { registerAs } from '@nestjs/config';

export default registerAs('db', () => ({
    redis_host: process.env.REDIS_HOST,
    redis_port: +process.env.REDIS_PORT,
    redis_pass: process.env.REDIS_PASS,
}));