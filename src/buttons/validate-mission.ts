/**
 * IN Guild, admin channel, mission valid
 */

import { APIEmbed, ButtonInteraction, Client, Colors, Message } from "discord.js";

import { CommandReturn } from "$types/commands";
import { validateMission } from "$db/api/mission";
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
                ...(interaction.message.embeds as APIEmbed[]),
                {
                    author: {
                        icon_url: interaction.user.avatarURL() || "",
                        name: interaction.user.tag,
                    },
                    timestamp: (new Date()).toLocaleDateString() + " " + (new Date()).toLocaleTimeString(),
                    title: "Mission validée.",
                    color: Colors.Green,
                },
            ],
        });
    } else {
        await interaction.reply({
            content: "** **",
            embeds: [
                {
                    title: "Cet mission n'existe pas",
                    color: Colors.Red,
                },
            ],
        });
    }

    return {
        status: "OK",
        label: "succès",
    };
}
