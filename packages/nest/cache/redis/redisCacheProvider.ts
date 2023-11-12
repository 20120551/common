import { Injectable, Inject } from "@nestjs/common";
import { RedisClientType } from "redis";
import { REDIS_CLIENT_TYPE } from "../constant";
import { ICache, createRedisCache } from "@nguyengo2112/common";
@Injectable()
export default class RedisCacheProvider implements ICache {
    private readonly redisCacheProvider: ICache;
    constructor(@Inject(REDIS_CLIENT_TYPE) redis: RedisClientType) {
        this.redisCacheProvider = createRedisCache(redis);
    }
    get<TCache>(key: string): Promise<TCache> {
        return this.redisCacheProvider.get(key);
    }
    set<TCache>(key: string, payload: TCache, ttl: number): Promise<void> {
        return this.redisCacheProvider.set(key, payload, ttl);
    }
    del(key: string): Promise<boolean> {
        return this.redisCacheProvider.del(key);
    }
}