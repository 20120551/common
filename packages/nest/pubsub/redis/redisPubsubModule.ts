import { DynamicModule, Module } from "@nestjs/common";
import RedisPubsubProvider from "./redisPubsubProvider";
import { RedisClientType, createClient } from "redis";
import EventBus from "../eventBus";
import { EVENT_BUS, EVENT_HANDLER, REDIS_CLIENT_TYPE } from "../constant";
import { IEventHandler, IPubsub, RedisOptions } from "@hcmus/common";

@Module({})
export default class RedisPubsubModule {
    static registerAsync({ options, referenceModules }: RedisOptions): DynamicModule {
        return {
            module: RedisPubsubModule,
            providers: [{
                provide: REDIS_CLIENT_TYPE,
                useFactory: async () => {
                    const redis = createClient(options) as RedisClientType;
                    await redis.connect();
                    return redis;
                },
                // inject: [] // inject into use factory
            }, {
                provide: EVENT_BUS,
                useFactory: async (handlers: IEventHandler[]) => {
                    const eventBus = new EventBus()
                    handlers.forEach(handler => eventBus.register(handler));
                    //TODO: get all event handler and register to eventBus
                    return eventBus;
                },
                inject: [EVENT_HANDLER]
            }, {
                provide: IPubsub,
                useClass: RedisPubsubProvider
            }],
            imports: [...referenceModules],
            exports: [{
                provide: IPubsub,
                useClass: RedisPubsubProvider
            }]
        }

    }
}
