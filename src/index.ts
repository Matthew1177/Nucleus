import dotenv from "dotenv";
import { ShardingManager } from "discord.js";
import { join } from "path";

dotenv.config();

const manager = new ShardingManager(join(__dirname,"bot.js"),{
    totalShards: Number(process.env.TOTAL_SHARDS), 
    shardList: process.env.SHARD_LIST!.split(/, */).map(Number), 
    token: process.env.TOKEN});

manager.on("shardCreate", shard => console.log(`Launched shard ${shard.id}`));

manager.spawn();
