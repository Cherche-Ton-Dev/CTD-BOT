import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { ChannelType, Client, Colors, CommandInteraction } from "discord.js";
import { config } from "$context/config";
import { PartialApplicationCommand, CommandReturn } from "$types/commands";

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
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (!interaction.isChatInputCommand()) return { status: "IGNORE" };

    const channel = await interaction.guild?.channels.fetch(
        config.suggestionsChanelId,
    );
    if (channel?.type != ChannelType.GuildText)
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
                    color: Colors.Red,
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
                color: Colors.Green,
                description: "```" + suggestion + "```",
                thumbnail: {
                    url: interaction.user.displayAvatarURL(),
                },
                footer: {
                    text: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL(),
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
