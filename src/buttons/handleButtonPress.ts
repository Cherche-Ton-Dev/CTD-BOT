import chalk from "chalk";
import { ButtonInteraction } from "discord.js";
import { commands } from ".";
import { CommandReturn } from "../types/commands";
import { log } from "../utils/log";
import { context } from "../context/context";

export async function handleButtonPress(interaction: ButtonInteraction) {
    if (!interaction.customId.startsWith("event-")) return;

    let command = commands[interaction.customId.replace("event-", "")];

    if (!command)
        return log(
            chalk.green(`🔲 ${interaction.customId}`),
            "appuyé par",
            chalk.blue(interaction.user.tag),
            "❌",
            chalk.bold(chalk.red("NO_EXIST")),
        );
    let result: CommandReturn = {
        status: "ERROR",
        label: "Unknown error",
    };
    let error: unknown;
    try {
        result = await command.run(context.client, interaction);
    } catch (err) {
        error = err;
    }

    log(
        chalk.green(`🔲 ${interaction.customId}`),
        "appuyé par",
        chalk.blue(interaction.user.tag),
        result.status === "OK" && !error ? "✔️" : "❌",
        result.label || "",
        error || result.status !== "OK"
            ? error || chalk.bold(chalk.red(result))
            : "",
    );
}
