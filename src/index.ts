import dotenv from "dotenv";
dotenv.config(); // load discord token from .env

import Discord from "discord.js";
import { log } from "./utils/log.js";
import { handleInteractionCreate } from "./events/interactionCreate.js";

const intents: Discord.IntentsString[] = [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_MEMBERS",
];
const client = new Discord.Client({
    intents: intents,
});

client.once("ready", async () => {
    log(
        `🤖 Bot ${client.user?.username}#${client.user?.tag} successfully started 🚀`,
    );
});

client.on("interactionCreate", handleInteractionCreate);

client.login(process.env.BOT_TOKEN);
