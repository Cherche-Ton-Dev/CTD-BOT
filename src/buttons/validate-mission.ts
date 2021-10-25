import {
    ButtonInteraction,
    Client,
    Message,
    MessageEmbed,
    TextChannel,
} from "discord.js";

import { CommandReturn } from "../types/commands";
import { validateMission } from "../db/api/mission";
import { config } from "../context/config";
import { generateMissionEmbed } from "../missions/generateEmbed";

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
        const channelID =
            config.missionChannelIDS[mission.target][
                mission.isPayed ? "payed" : "free"
            ];

        const channel = (await interaction.guild?.channels.fetch(
            channelID,
        )) as TextChannel;

        const author = await client.users.fetch(mission.authorUserID);

        if (!author) {
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
            await channel.send({
                embeds: [generateMissionEmbed(mission, author)],
                components: [
                    {
                        type: "ACTION_ROW",
                        components: [
                            {
                                label: "Accept",
                                style: "SUCCESS",
                                type: "BUTTON",
                                customId: `event-accept{${mission.id}}`,
                            },
                        ],
                    },
                ],
            });
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
                        title: "Mission acceptée.",
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
