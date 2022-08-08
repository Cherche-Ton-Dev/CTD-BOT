/**
 * IN Guild, admin channel, mission valid
 */

import {
    ButtonInteraction,
    Client,
    Message,
    MessageEmbed,
    TextChannel,
} from "discord.js";

import { CommandReturn } from "$types/commands";
import { validateMission } from "$db/api/mission";
import { config } from "$context/config";
import { generateMissionEmbed } from "utils/embeds/mission";

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
            label: "id of validate is missing",
        };
    }
    const mission = await validateMission(id);
    if (mission) {
        const author = await client.users.fetch(mission.authorUserID);

        if (!author) {
            // If the author of the mission left the server
            interaction.reply({
                content: "** **",
                embeds: [
                    {
                        timestamp: new Date(),
                        title: "L'utilisateur est introuvable",
                        color: "RED",
                    },
                ],
            });

            return {
                status: "ERROR",
                label: "user not found",
            };
        } else {
            // get target channel
            const channelID =
                config.missionChannelIDS[mission.target][
                    mission.isPayed ? "payed" : "free"
                ];

            const channel = (await interaction.guild?.channels.fetch(
                channelID,
            )) as TextChannel;

            const targetRoleID =
                config.devRoles.find((role) => role.value === mission.target)
                    ?.roleID || "";
            const targetRole = await channel.guild.roles.fetch(targetRoleID);
            if (!targetRole) {
                interaction.reply({
                    embeds: [
                        {
                            title: "Erreur",
                            description: "Le role cible est introuvable",
                        },
                    ],
                });

                return {
                    status: "ERROR",
                    label: "Can't find target role",
                };
            }
            // Send mission to corresponding channel
            const sentMissionMessage = await channel.send({
                embeds: [generateMissionEmbed(mission, author)],
                content: mission.isPayed
                    ? `Mention: ${targetRole}`
                    : "Nouvelle mission",
            });
            // Create thread
            const thread = await channel.threads.create({
                name: "Accepter la mission 👆",
                startMessage: sentMissionMessage,
                type: "GUILD_PUBLIC_THREAD",
            });
            mission.dealThreadID = thread.id;
            mission.save();
            thread.send({
                content:
                    "Mettez vous d’accords ici sur **la récompense** et **les choses a réaliser**. \n" +
                    "Ensuite effectuez la commande `/offer` pour créer une offre.\n" +
                    `||${author}||`,
            });

            // Edit validation message
            (interaction.message as Message).edit({
                components: [],
                embeds: [
                    ...(interaction.message.embeds as MessageEmbed[]),
                    {
                        author: {
                            iconURL: interaction.user.avatarURL() || "",
                            name: interaction.user.tag,
                        },
                        timestamp: new Date(),
                        title: "Mission validée.",
                        color: "GREEN",
                    },
                ],
            });
        }
    } else {
        await interaction.reply({
            content: "** **",
            embeds: [
                {
                    title: "Cet mission n'existe pas",
                    color: "RED",
                },
            ],
        });
    }

    return {
        status: "OK",
        label: "succès",
    };
}
