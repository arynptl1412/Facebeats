import Redis from "ioredis";
import "dotenv/config";

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

redis.on("connect", () => {
    console.log("Server is Connected To Redis.");
});

redis.on("error", (err) => {
    console.error("Redis connection error:", err);
});

export default redis;