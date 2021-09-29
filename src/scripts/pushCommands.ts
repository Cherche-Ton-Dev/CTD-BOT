import readline from "readline";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { ApplicationCommand } from "../types/commands.js";
import { commands } from "../commands/index.js";
dotenv.config();

const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
    "Content-Type": "application/json",
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function deploy() {
    process.stdout.write("deploying commads: ");

    const commandsData = Object.values(commands).map(
        (command) => command?.data,
    ) as ApplicationCommand[];
    console.log(commandsData.map((c) => c.name));
    const result: string = await new Promise((resolve) =>
        rl.question("Is it ok? (y|n)", resolve),
    );
    const ok = result === "y" ? 1 : 0;
    if (!ok) {
        console.log("aborting...");
        process.exit();
    }
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
    process.exit();
}

deploy();
