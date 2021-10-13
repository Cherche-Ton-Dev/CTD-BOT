import { ButtonInteraction, Client, Message, MessageEmbed } from "discord.js";

import { CommandReturn } from "../types/commands";
import { validateMission } from "../db/api/mission";

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
    const mission = await validateMission(id);
    if (mission) {
        (interaction.message as Message).edit({
            components: [],
            embeds: [
                interaction.message.embeds[0] as MessageEmbed,
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
