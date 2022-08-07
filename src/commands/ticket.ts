import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Client, Interaction } from "discord.js";
import { config } from "../context/config";
import { PartialApplicationCommand, CommandReturn } from "../types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "ticket",
    description: "Ouvre un ticket.",
    options: [],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    const channel = await interaction.guild?.channels.create(
        `ticket-de-${interaction.user.username}`,
        {
            permissionOverwrites: [
                {
                    id: interaction.guild?.id,
                    deny: ["VIEW_CHANNEL"],
                },
                {
                    id: interaction.user.id,
                    allow: ["VIEW_CHANNEL"],
                },
            ],
        },
    );

    if (!channel) {
        return {
            status: "ERROR",
            label: "Impossible de créer le salon",
        };
    }

    channel.send({
        embeds: [
            {
                title: "Ticket de " + interaction.user.username,
                color: "GREEN",
            },
        ],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        label: "Fermer",
                        style: "DANGER",
                        emoji: "🗑️",
                        customId: "event-close-ticket",
                    },
                ],
            },
        ],
    });

    interaction.reply({
        embeds: [
            {
                title: "Ticket ouvert",
                description: `Ton ticket à été crée: ${channel}.`,
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
