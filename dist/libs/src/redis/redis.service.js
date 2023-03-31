"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
let RedisService = class RedisService {
    constructor(config) {
        this.config = config;
        const port = parseInt(config.get('PORT_REDIS'));
        const host = config.get('REDIS_HOST');
        const password = config.get('REDIS_PASS');
        const clusterNodes = [
            {
                host,
                port,
            },
        ];
        this._redis = new ioredis_1.Cluster(clusterNodes, {
            dnsLookup: (address, callback) => callback(null, address),
            redisOptions: {
                password,
                tls: {},
                enableReadyCheck: true,
                connectTimeout: 10000,
            },
        });
    }
    async setRedisKey(key, data, seconds) {
        if (seconds) {
            return await this._redis.set(key, data, 'EX', seconds);
        }
        else
            return await this._redis.set(key, data);
    }
    async getRedisKey(key) {
        const result = await this._redis.get(key);
        return result;
    }
    async mset_redis(data) {
        return await this._redis.mset(data);
    }
    async del_key_redis(key) {
        return await this._redis.del(key);
    }
};
RedisService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map