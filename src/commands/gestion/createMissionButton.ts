import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { ButtonStyle, Client, Colors, CommandInteraction, ComponentType, Interaction } from "discord.js";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
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
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (!interaction.isChatInputCommand()) return { status: "IGNORE" };

    const message = interaction.options.getString("message");

    await interaction.channel?.send({
        content: message || "** **",
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        label: "👨‍💻 CRÉER UNE MISSION 🖌️",
                        type: ComponentType.Button,
                        style: ButtonStyle.Success,
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
                color: Colors.Green,
            },
        ],
        ephemeral: true,
    });
    return {
        status: "OK",
        label: "succès",
    };
}
