import { RedisClientType, createClient } from "redis";
import { FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { RedisConnectionOptions, createRedisCache } from "@hcmus/common";

const redisCachePlugin: FastifyPluginAsync = fp(async (fastify, opts: RedisConnectionOptions) => {
    const redis = createClient(opts);
    await redis.connect();
    const cache = createRedisCache(redis as RedisClientType);
    fastify.decorate("cache", cache);
})

export default redisCachePlugin;