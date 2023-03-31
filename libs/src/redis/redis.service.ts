import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cluster } from 'ioredis';

@Injectable()
export class RedisService {
  private readonly _redis: Cluster;
  constructor(private readonly config: ConfigService) {
    const port = parseInt(config.get('PORT_REDIS'));
    const host = config.get('REDIS_HOST');
    const password = config.get('REDIS_PASS');

    const clusterNodes = [
      {
        host,
        port,
      },
    ];

    this._redis = new Cluster(clusterNodes, {
      dnsLookup: (address, callback) => callback(null, address),
      redisOptions: {
        password,
        tls: {},
        enableReadyCheck: true,
        connectTimeout: 10000,
      },
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
