import readline from "readline";
import dotenv from "dotenv";
import util from "util";
import axios from "axios";
import { commands } from "../commands/index";
dotenv.config();

const headers = {
    Authorization: `Bot ${process.env.BOT_TOKEN}`,
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function deploy() {
    process.stdout.write("deploying commads: ");

    const cleanedCommands = Object.values(commands).map((command) => {
        if (command) {
            if (command.subCommand === true) {
                const options = Object.values(command.commands).map(
                    (subCommand) => ({ ...subCommand.data, type: 1 }),
                );
                return {
                    name: command.name,
                    description: command.description,
                    options,
                };
            } else if (command.subCommand === false) {
                return command.data;
            }
        }
    });

    // console.log(cleanedCommands);
    console.log(
        util.inspect(cleanedCommands, {
            showHidden: false,
            depth: null,
            colors: true,
        }),
    );
    const result: string = await new Promise((resolve) =>
        rl.question("\nIs it ok? (y|n)", resolve),
    );
    const ok = result === "y" ? 1 : 0;
    if (!ok) {
        console.log("aborting...");
        process.exit();
    }
    const r = await axios({
        method: "PUT",
        url: `https://discord.com/api/v9/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`,
        headers,
        data: cleanedCommands,
    });

    if (r.status === 200) {
        process.stdout.write("✔️ ");
    } else {
        process.stdout.write("❌ ");
    }
    console.log(r.statusText);
    console.log(r.data);
    process.stdout.write("\n");
    process.exit();
}

deploy();
