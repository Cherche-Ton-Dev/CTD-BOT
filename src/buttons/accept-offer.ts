/**
 * IN Server, take the mission, enter in contact with the client.
 */

import chalk from "chalk";
import {
    ButtonInteraction,
    Client,
    GuildMember,
    Message,
    MessageEmbed,
    MessageMentions,
} from "discord.js";
import { config } from "$context/config";
import { createOrGetMember } from "$db/api/member";
import { Mission, Offer } from "$db/schemas/mission";
import { generateMissionEmbed } from "utils/embeds/mission";

import { CommandReturn } from "$types/commands";
import { createTicket } from "$utils/ticket";
import { IOffer } from "$types/missions";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    const mission = (await Mission.findOne({
        dealThreadID: interaction.channelId,
    })) as Mission | undefined;

    if (!(interaction.message instanceof Message))
        return {
            status: "IGNORE",
        };

    const dealer = interaction.message.mentions.users?.first();
    if (!dealer) {
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: "Erreur",
                    description: "Le créateur du deal est introuvable",
                },
            ],
        });
        return {
            status: "ERROR",
            label: "Dealer not found",
        };
    }

    if (!mission) {
        // check if mission exists
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Cet mission n'existe plus 🤔",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "mission doesn't exits",
        };
    }
    // check if mission already accepted
    if (!mission.offer?.$isEmpty("")) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Une offre a déja été prise pour cette mission",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "offer already accepted",
        };
    }

    // check if user is mission owner
    if (interaction.user.id != mission.authorUserID) {
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: "Erreur",
                    description: "Ce n'est pas a toi d'accepter le deal.",
                    color: "RED",
                },
            ],
        });

        return {
            status: "ERROR",
            label: "Accepted by wrong user",
        };
    }
    const offerEmbed = interaction.message.embeds[1];
    if (!offerEmbed) {
        interaction.reply({
            ephemeral: true,
            content: "ERREUR: offre invalide",
        });
        return {
            status: "ERROR",
            label: "embed[1] dosen't have a offerEmbed",
        };
    }
    const price = offerEmbed.fields?.[0].value.replace(/`|\n/g, "");
    const delay = offerEmbed.fields?.[1].value.replace(/`|\n/g, "");
    const info = offerEmbed.fields?.[2].value.replace(/`|\n/g, "");

    const offer: IOffer = {
        price,
        delay,
        info,
        devDiscordID: dealer.id,
    };

    const modoRole = await interaction.guild?.roles.fetch(config.modoRoleId);
    if (!modoRole) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Role modo introuvable.",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: chalk.red("wrong modo role"),
        };
    }
    // create channel
    const channel = await interaction.guild?.channels.create(
        `Mission de ${interaction.user.tag}`,
        {
            type: "GUILD_TEXT",
            permissionOverwrites: [
                {
                    id: interaction.guild.id, // shortcut for @everyone role ID
                    deny: "VIEW_CHANNEL",
                },
                {
                    id: interaction.user.id,
                    allow: "VIEW_CHANNEL",
                },
                {
                    id: modoRole,
                    allow: "VIEW_CHANNEL",
                },
                {
                    id: dealer.id,
                    allow: "VIEW_CHANNEL",
                },
            ],
        },
    );
    if (!channel) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Impossible de créer un salon pour la mission.",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "can't create mission channel",
        };
    }

    // accept mission
    const missionMessage = (await interaction.channel?.messages.fetch(
        interaction.message.id,
    )) as Message;
    const { embeds } = missionMessage;
    embeds.push(
        new MessageEmbed({
            title: "Deal Acceptée",
            timestamp: Date.now(),
            author: {
                name: interaction.user.tag,
                iconURL:
                    interaction.user.avatarURL({
                        dynamic: true,
                    }) || "",
            },
            color: "GREEN",
        }),
    );
    await missionMessage.edit({
        embeds,
        components: [],
    });

    mission.channel = channel.id;
    mission.offer = offer as Offer;
    await mission.save();

    await interaction.reply({
        embeds: [
            {
                title: "Succès",
                description: `Un salon a été crée pour que tu puisse parler avec ${interaction.user}: ${channel}`,
                color: "GREEN",
            },
        ],
        ephemeral: true,
    });

    channel.send({
        content: "Utilisez la commande /finish une fois la mission terminée",
        embeds: [generateMissionEmbed(mission, interaction.user), offerEmbed],
    });

    return {
        status: "OK",
        label: "succès",
    };
}
