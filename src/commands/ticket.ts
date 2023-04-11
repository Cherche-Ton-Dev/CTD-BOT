import { ButtonStyle, ChannelType, Client, Colors, CommandInteraction, ComponentType, Interaction } from "discord.js";
import { PartialApplicationCommand, CommandReturn } from "$types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "ticket",
    description: "Ouvre un ticket.",
    options: [],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    const channel = await interaction.guild?.channels.create(
        {
            name: `ticket-de-${interaction.user.username}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild?.id,
                    deny: ["ViewChannel"],
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel"],
                },
            ],
        },
    );

    if (channel?.type != ChannelType.GuildText) {
        return {
            status: "ERROR",
            label: "Impossible de créer le salon",
        };
    }

    channel.send({
        embeds: [
            {
                title: "Ticket de " + interaction.user.username,
                color: Colors.Green,
            },
        ],
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        label: "Fermer",
                        style: ButtonStyle.Danger,
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
