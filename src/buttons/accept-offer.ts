import chalk from "chalk";
import {
    ButtonInteraction,
    ChannelType,
    Client,
    Colors,
    EmbedBuilder,
    Message,
    PermissionFlagsBits,
    ThreadChannel,
} from "discord.js";
import { config } from "$context/config";
import { Mission, Offer } from "$db/schemas/mission";
import { generateMissionEmbed } from "utils/embeds/mission";

import { CommandReturn } from "$types/commands";
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
                    color: Colors.Red,
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
    if (!(mission.offer as Offer)?.$isEmpty("")) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Une offre a déja été prise pour cette mission",
                    color: Colors.Red,
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
                    color: Colors.Red,
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
                    color: Colors.Red,
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
        {
            name: `Mission de ${interaction.user.tag}`,
            type: ChannelType.GuildText,
            permissionOverwrites: [
                {
                    id: interaction.guild.id, // shortcut for @everyone role ID
                    deny: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: interaction.user.id,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: modoRole,
                    allow: [PermissionFlagsBits.ViewChannel],
                },
                {
                    id: dealer.id,
                    allow: [PermissionFlagsBits.ViewChannel],
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
                    color: Colors.Red,
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
    const embed = new EmbedBuilder({
        title: "Deal Acceptée",
        timestamp: Date.now(),
        author: {
            name: interaction.user.tag,
            iconURL:
                interaction.user.avatarURL() || "",
        },
        color: Colors.Green,
    });
    await missionMessage.edit({
        embeds: [
            ...embeds,
            embed
        ],
        components: [],
    });

    await (interaction.channel as ThreadChannel).setName(
        "Mission déjà acceptée",
    );

    mission.channel = channel.id;
    mission.offer = offer as Offer;
    await mission.save();

    await interaction.reply({
        embeds: [
            {
                title: "Succès",
                description: `Un salon a été crée pour que tu puisse parler avec ${interaction.user}: ${channel}`,
                color: Colors.Green,
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
