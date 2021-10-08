import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import Discord from "discord.js";
import { log } from "./utils/log";
import { handleInteractionCreate } from "./events/interactionCreate";
import { connectDB } from "./db/init";

const intents: Discord.IntentsString[] = ["GUILDS", "GUILD_MESSAGES"];
const client = new Discord.Client({
    intents: intents,
});

client.once("ready", async () => {
    log(
        `🤖 Bot ${client.user?.username}#${client.user?.tag} successfully started 🚀`,
    );
});

client.on("interactionCreate", handleInteractionCreate);

connectDB().then(() => {
    client.login(process.env.BOT_TOKEN);
});
