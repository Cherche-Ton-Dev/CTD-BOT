import { ApplicationCommandOptionType } from "discord-api-types";
import { Client, Interaction } from "discord.js";
import { ApplicationCommand, CommandReturn } from "../../types/commands";

export const subCommand = false;
export const data: ApplicationCommand = {
    name: "create-mission-button",
    description: "crée un bouton pour créer une mission",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "Message que doit dire le bot avant le message",
            required: false,
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    const message = interaction.options.getString("message");

    await interaction.channel?.send({
        content: message || "** **",
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        label: "👨‍💻 CRÉER UNE MISSION 🖌️",
                        type: "BUTTON",
                        style: "SUCCESS",
                        customId: "event-create-mission",
                    },
                ],
            },
        ],
    });

    await interaction.reply({
        embeds: [
            {
                title: "✅ Fait.",
                description: "Le bouton à été crée.",
                color: "GREEN",
            },
        ],
        ephemeral: true,
    });
    return {
        status: "OK",
        label: "succès",
    };
}
