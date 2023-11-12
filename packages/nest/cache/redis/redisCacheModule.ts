import { DynamicModule, Module } from "@nestjs/common";
import RedisCacheProvider from "./redisCacheProvider";
import { RedisClientType, createClient } from "redis";
import { ICache, RedisConnectionOptions } from "@hcmus/common";
import { REDIS_CLIENT_TYPE } from "../constant";

@Module({})
export default class RedisCacheModule {
    static registerAsync(options: RedisConnectionOptions): DynamicModule {
        return {
            module: RedisCacheModule,
            providers: [{
                provide: REDIS_CLIENT_TYPE,
                useFactory: async () => {
                    const redis = createClient(options) as RedisClientType;
                    await redis.connect();
                    return redis;
                },
                // inject: [] // inject into use factory
            }],
            exports: [{
                provide: ICache,
                useClass: RedisCacheProvider
            }]
        }

    }
}
