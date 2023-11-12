import { Inject, Injectable } from "@nestjs/common";
import { Connection } from "amqplib";
import { EVENT_BUS, RABBITMQ_CLIENT_TYPE } from "../constant";
import {
    DomainException,
    IEvent, IEventBus, IPubsub, IRejectedEvent, PublisherOptions,
    SubscriberOptions, createRabbitmqPubsub
} from "@nguyengo2112/common";

@Injectable()
export default class RabbitmqPubsubProvider implements IPubsub {
    private readonly pubsub: IPubsub;
    constructor(
        @Inject(EVENT_BUS) eventBus: IEventBus,
        @Inject(RABBITMQ_CLIENT_TYPE) Rabbitmq: Connection) {
        this.pubsub = createRabbitmqPubsub(Rabbitmq, eventBus);
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