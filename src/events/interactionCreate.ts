import chalk from "chalk";
import { commands } from "../commands/index";
import { context } from "../context/context";
import { GuildMember, Interaction } from "discord.js";
import { CommandReturn } from "../types/commands";
import { log } from "../utils/log";
import { addInvite } from "../db/api/member";

export async function handleInteractionCreate(
    interaction: Interaction,
): Promise<void> {
    if (interaction.isCommand()) {
        const command = commands[interaction.commandName];
        if (!command)
            return log(
                chalk.green(`/${interaction.commandName}`),
                "exécuté par",
                chalk.blue(interaction.user.tag),
                "❌",
                chalk.bold(chalk.red("NO_EXIST")),
            );
        let result: CommandReturn = { status: "ERROR", label: "Unknown error" };
        let error: unknown;
        try {
            result = await command.run(context.client, interaction);
        } catch (err) {
            error = err;
        }

        log(
            chalk.green(`/${interaction.commandName}`),
            "exécuté par",
            chalk.blue(interaction.user.tag),
            result.status === "OK" && !error ? "✔️" : "❌",
            result.label || "",
            error || result.status !== "OK"
                ? error || chalk.bold(chalk.red(result))
                : "",
        );
    }
}
