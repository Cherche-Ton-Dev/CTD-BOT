import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Client, GuildMember, Interaction } from "discord.js";
import { config } from "../context/config";
import { createOrGetMember } from "../db/api/member";
import { getRatings } from "../db/api/rating";
import { CommandReturn, PartialApplicationCommand } from "../types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "contrib",
    description: "Affiche vos points de contribution.",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "membre",
            description: "Membre dont vous voulez voir les points.",
            required: false,
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (
        !interaction.isCommand() ||
        !(interaction.member instanceof GuildMember)
    )
        return { status: "IGNORE" };

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

    const dbMember = await createOrGetMember(target);

    interaction.reply({
        embeds: [
            {
                title: `Points de ${target.displayName}`,
                description: `${target} possède **${dbMember.contributionPoints}** points de contribution.`,
                color: "BLURPLE",
                thumbnail: {
                    url: target.user.displayAvatarURL(),
                },
                author: {
                    name: target.displayName,
                    icon_url: target.user.displayAvatarURL(),
                },
                footer: {
                    text:
                        interaction.member.nickname ||
                        interaction.member.user.username,
                    icon_url: interaction.user.displayAvatarURL(),
                },
            },
        ],
    });

    return {
        status: "OK",
        label: "succès",
    };
}
