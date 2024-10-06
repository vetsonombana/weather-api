import { createClient, RedisClientType } from "redis";

export const InitRedis = async (): Promise<RedisClientType> => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on("error", (err) => console.log("Redis Client Error", err));

  await client.connect();

  return client as RedisClientType;
};
