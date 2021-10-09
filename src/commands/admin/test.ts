import { ApplicationCommandOptionType } from "discord-api-types";
import { Client, Interaction } from "discord.js";
import { ApplicationCommand, CommandReturn } from "../../types/commands";

export const subCommand = false;
export const data: ApplicationCommand = {
    name: "test",
    description: "commande de test",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "suggestion",
            description: "Entrez le texte de votre suggestion",
            required: false,
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    await interaction.reply("ok");

    return {
        status: "OK",
        label: "succès",
    };
}
