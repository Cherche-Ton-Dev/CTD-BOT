import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Client, GuildMember, Interaction } from "discord.js";
import { config } from "../context/config";
import { getRatings } from "../db/api/rating";
import { PartialApplicationCommand, CommandReturn } from "../types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "moyenne",
    description: "Affiche la moyenne d'avis d'un dev.",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Membre dont vous voulez lire la moyenne de note.",
            required: false,
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    const rawTarget = interaction.options.getUser("membre") || interaction.user;
    const target = await interaction.guild?.members.fetch(rawTarget.id);

    if (!(target instanceof GuildMember)) {
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: "Erreur",
                    description: "Ce membre n'existe pas.",
                    color: "RED",
                },
            ],
        });
        return {
            status: "ERROR",
            label: "TARGET_INVALID",
        };
    }

    const ratings = await getRatings(target);
    const mean =
        ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length;

    interaction.reply({
        embeds: [
            {
                title: `Note de ${target.displayName}`,
                description: `${target} a noté ${ratings.length} fois.`,
                fields: [
                    {
                        name: "Moyenne",
                        value:
                            "⭐".repeat(Math.round(mean)) +
                            ":curly_loop:".repeat(5 - Math.round(mean)) +
                            ` (${mean}/5)`,
                    },
                ],
                color: mean >= 4 ? "GREEN" : mean >= 2 ? "YELLOW" : "RED",
                thumbnail: {
                    url: target.user.displayAvatarURL(),
                },
            },
        ],
    });

    return {
        status: "OK",
        label: "succès",
    };
}
