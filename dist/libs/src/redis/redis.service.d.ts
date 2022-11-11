import { ConfigService } from '@nestjs/config';
export declare class RedisService {
    private readonly config;
    private readonly _redis;
    constructor(config: ConfigService);
    setRedisKey(key: string, data: string, seconds?: number): Promise<"OK">;
    getRedisKey(key: string): Promise<string>;
    mset_redis(data: object): Promise<"OK">;
    del_key_redis(key: string): Promise<number>;
}
