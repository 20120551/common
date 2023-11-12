import { DynamicModule, Module } from "@nestjs/common";
import { connect } from "amqplib";
import EventBus from "../eventBus";
import RabbitmqPubsubProvider from "./rabbitmqPubsubProvider";
import { EVENT_BUS, EVENT_HANDLER, RABBITMQ_CLIENT_TYPE } from "../constant";
import { IEventHandler, IPubsub, RabbitMQOptions } from "@nguyengo2112/common";

@Module({})
export default class RabbitmqPubsubModule {
    static registerAsync({ options, referenceModules }: RabbitMQOptions): DynamicModule {
        return {
            module: RabbitmqPubsubModule,
            providers: [{
                provide: RABBITMQ_CLIENT_TYPE,
                useFactory: async () => {
                    const connection = connect(options);
                    return connection;
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
                useClass: RabbitmqPubsubProvider
            }],
            imports: [...referenceModules],
            exports: [{
                provide: IPubsub,
                useClass: RabbitmqPubsubProvider
            }]
        }

    }
}
