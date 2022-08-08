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
import { postMission } from "$missions/postMission";

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
        await postMission(interaction, mission);

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
