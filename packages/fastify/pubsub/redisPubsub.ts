import fp from "fastify-plugin";
import { FastifyPluginAsync } from "fastify";
import { RedisClientType, createClient } from "redis";
import { RedisPubsubOptions, createRedisPubsub } from "@nguyengo2112/common";
import { createEventBus } from "./eventBus";

const redisPubsubPlugin: FastifyPluginAsync = fp(async (fastify, { redisConfigs, handlers }: RedisPubsubOptions) => {
    // construct bus
    const eventBus = createEventBus();
    handlers.forEach(handler => eventBus.register(handler));

    const redis = createClient(redisConfigs);
    await redis.connect();
    const pubsub = createRedisPubsub(redis as RedisClientType, eventBus);
    fastify.decorate("pubsub", pubsub);
})

export { redisPubsubPlugin };