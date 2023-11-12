import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { connect } from "amqplib";
import { createRabbitmqPubsub, AmqpPubsubOptions } from "@hcmus/common";
import { createEventBus } from "./eventBus";

const amqpPubsubPlugin: FastifyPluginAsync = fp(async (fastify, { amqpConfigs, handlers }: AmqpPubsubOptions) => {
    // construct bus
    const eventBus = createEventBus();
    handlers.forEach(handler => eventBus.register(handler));

    const amqp = await connect(amqpConfigs);
    const pubsub = createRabbitmqPubsub(amqp, eventBus);
    fastify.decorate("pubsub", pubsub);
})

export { amqpPubsubPlugin };