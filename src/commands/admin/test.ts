import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Client, Interaction } from "discord.js";
import { PartialApplicationCommand, CommandReturn } from "../../types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
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
