import { Injectable, Inject } from "@nestjs/common";
import { RedisClientType } from "redis";
import { EVENT_BUS, REDIS_CLIENT_TYPE } from "../constant";
import {
    DomainException, IEvent, IEventBus, IPubsub, IRejectedEvent,
    PublisherOptions, SubscriberOptions, createRedisPubsub
} from "@nguyengo2112/common";

@Injectable()
export default class RedisPubsubProvider implements IPubsub {
    private readonly pubsub: IPubsub;
    constructor(
        @Inject(EVENT_BUS) eventBus: IEventBus,
        @Inject(REDIS_CLIENT_TYPE) redis: RedisClientType) {
        this.pubsub = createRedisPubsub(redis, eventBus);
    }
    publish<TEvent extends IEvent>(topic: string, message: TEvent, options?: PublisherOptions): Promise<void> {
        return this.pubsub.publish(topic, message, options);
    }

    subscribe<TEvent extends IEvent>(
        topic: string, options?: SubscriberOptions,
        onError?: ((event: TEvent, error: DomainException) => IRejectedEvent) | undefined): Promise<void> {
        return this.pubsub.subscribe(topic, options, onError);
    }

}