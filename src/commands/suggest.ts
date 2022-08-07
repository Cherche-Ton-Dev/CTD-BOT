import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Client, Interaction } from "discord.js";
import { config } from "../context/config";
import { PartialApplicationCommand, CommandReturn } from "../types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "suggest",
    description: "Créez une suggestion pour améliorer CTD",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "suggestion",
            description: "Entrez le texte de votre suggestion",
            required: true,
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    const channel = await interaction.guild?.channels.fetch(
        config.suggestionsChanelId,
    );
    if (!channel || !channel.isText())
        return {
            status: "ERROR",
            label: "L'id du salon de suggestion n'est pas bon",
        };

    const suggestion = interaction.options.getString("suggestion");
    if (!suggestion) {
        await interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    color: "RED",
                    description: "la suggestion n'est pas valide",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "invalid suggestion",
        };
    }

    const sentMessage = await channel.send({
        embeds: [
            {
                title: `Suggestion de ${interaction.user.tag}`,
                color: "GREEN",
                description: "```" + suggestion + "```",
                thumbnail: {
                    url: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
                footer: {
                    text: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
            },
        ],
    });
    await sentMessage.react("✅");
    await sentMessage.react("❌");

    await interaction.reply({
        embeds: [
            {
                title: "Suggestion",
                description: "Votre suggestion a été crée",
                url: sentMessage.url,
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
