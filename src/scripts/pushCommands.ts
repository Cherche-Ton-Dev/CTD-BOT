import dotenv from "dotenv";
import fetch from "node-fetch";
import { commands } from "../commands/index.js";
dotenv.config();

const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json",
};

async function deploy() {
    process.stdout.write("deploying commads: ");

    const commandsData = Object.values(commands).map((command) => command.data);
    // console.log(commandsData);
    // return;

    const r = await fetch(
        `https://discord.com/api/v9/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`,
        {
            method: "put",
            headers,
            body: JSON.stringify(commandsData),
        },
    );

    if (!r.ok) {
        process.stdout.write("❌ ");

        console.log(r.statusText);
        console.log(await r.json());
    } else {
        process.stdout.write("✔️   Ok.");
    }
    process.stdout.write("\n");
}

deploy();
