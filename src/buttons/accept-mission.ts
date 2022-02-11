import chalk from "chalk";
import {
    ButtonInteraction,
    Client,
    GuildMember,
    Message,
    MessageEmbed,
} from "discord.js";
import { config } from "../context/config";
import { createOrGetMember } from "../db/api/member";
import { Mission } from "../db/schemas/mission";
import { generateMissionEmbed } from "../missions/generateEmbed";

import { CommandReturn } from "../types/commands";
import { createTicket } from "../utils/ticket";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
    id: string | undefined,
): Promise<CommandReturn> {
    if (!id) {
        interaction.reply({
            content: "Erreur: cette mission est invalide",
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "id of accept is missing",
        };
    }
    const modoRole = await interaction.guild?.roles.fetch(config.modoRoleId);
    if (!modoRole) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Problème de configuration du bot.",
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
    const mission = await Mission.findById(id);

    // check if mission exists
    if (!mission) {
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

    // check if user has required role
    const requiredRole = config.devRoles.find(
        (role) => role.value === mission.target,
    );

    if (
        !(interaction.member as GuildMember).roles.cache.some(
            (role) => role.id === requiredRole?.roleID,
        )
    ) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: `Tu n'as pas le role ${requiredRole?.label}`,
                    color: "RED",
                },
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "BUTTON",
                            label: "Obtenir le role",
                            style: "SUCCESS",
                            customId: "get-role",
                        },
                    ],
                },
            ],
            ephemeral: true,
        });

        interaction.channel
            ?.awaitMessageComponent({
                filter: (buttonInteraction) =>
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    buttonInteraction.member?.id === interaction.member?.id &&
                    buttonInteraction.component?.type === "BUTTON" &&
                    buttonInteraction.component.label === "Obtenir le role",
            })
            .then(async (buttonInteraction) => {
                if (!buttonInteraction.member) return;

                await buttonInteraction.deferReply({
                    ephemeral: true,
                });
                const DBMember = await createOrGetMember(
                    buttonInteraction.member as GuildMember,
                );
                if (DBMember.roleTicketPending)
                    return await buttonInteraction.editReply({
                        embeds: [
                            {
                                title: "Erreur",
                                description:
                                    "Tu as déjà un ticket de role ouvert, si ce n'est pas le cas, fais en part aux modérateurs",
                                color: "RED",
                            },
                        ],
                    });
                DBMember.roleTicketPending = true;
                DBMember.save();
                const channel = await createTicket(
                    interaction.member as GuildMember,
                    `${interaction.member?.user.username}-devenir-${requiredRole?.label}`,
                    [modoRole.id, interaction.user.id],
                    config.ticketCategoryId,
                    [
                        {
                            title: "Requête de rôle",
                            description: `${interaction.member?.user.username} souhaite devenir ${requiredRole?.label}`,
                            color: "BLUE",
                        },
                    ],
                    [
                        {
                            type: "ACTION_ROW",
                            components: [
                                {
                                    type: "BUTTON",
                                    style: "SUCCESS",
                                    label: "Accepter",
                                    customId: `event-give-role-{${interaction.member?.user.id},${requiredRole?.roleID}}`,
                                },
                                {
                                    type: "BUTTON",
                                    style: "DANGER",
                                    label: "Refuser",
                                    customId: `event-refuse-role-{${interaction.member?.user.id},${requiredRole?.roleID}}`,
                                },
                            ],
                        },
                    ],
                );
                await buttonInteraction.editReply({
                    embeds: [
                        {
                            title: "Ticket crée.",
                            description: `Va dans ton ticket ${channel} pour demander le role`,
                            color: "GREEN",
                        },
                    ],
                });
            });

        return {
            status: "ERROR",
            label: "missing role for accept",
        };
    }

    // check if mission owner still exists
    const author = await interaction.guild?.members.fetch(mission.authorUserID);
    if (!author) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Le propriétaire de cette mission a quitté le serveur",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "missing owner left",
        };
    }

    // create channel
    const channel = await interaction.guild?.channels.create(
        `Mission de ${author.user.tag}`,
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
                    id: author.user.id,
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
            title: "Mission Acceptée",
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

    mission.acceptedBy = interaction.user.id;
    mission.channel = channel.id;
    await mission.save();

    await interaction.reply({
        embeds: [
            {
                title: "Succès",
                description: `Un salon a été crée pour que tu puisse parler avec ${author}: ${channel}`,
                color: "GREEN",
            },
        ],
        ephemeral: true,
    });

    channel.send({
        content: "** **",
        embeds: [generateMissionEmbed(mission, author.user)],
    });

    return {
        status: "OK",
        label: "succès",
    };
}
