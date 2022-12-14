import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly _redis: Redis;
  constructor(private readonly config: ConfigService) {
    this._redis = new Redis({
      port: +config.get('REDIS_PORT'),
      host: config.get('REDIS_HOST'),
      password: config.get('REDIS_PASS'),
    });
  }

  async setRedisKey(key: string, data: string, seconds?: number) {
    if (seconds) {
      return await this._redis.set(key, data, 'EX', seconds);
    } else return await this._redis.set(key, data);
  }

  async getRedisKey(key: string) {
    const result = await this._redis.get(key);
    return result;
  }

  async mset_redis(data: object) {
    return await this._redis.mset(data);
  }

  async del_key_redis(key: string) {
    return await this._redis.del(key);
  }
}
