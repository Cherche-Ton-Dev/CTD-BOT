import { ApplicationCommandOptionType } from "discord-api-types";
import { Client, Interaction } from "discord.js";
import { ApplicationCommand, CommandReturn } from "../types/commands";

export const data: ApplicationCommand = {
    name: "example",
    description: "an example command",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "option1",
            description: "and option for this command",
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    interaction.reply("hello");

    return {
        status: "OK",
        label: "succès",
    };
}
