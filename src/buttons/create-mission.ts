/**
 * IN Guild, after create mission button cliqued
 */

import { ButtonInteraction, Client, GuildMember } from "discord.js";

import { CommandReturn } from "$types/commands";
import { createMission } from "$missions/createMissionInDm";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    try {
        const DM = await interaction.user.createDM();
        const sentMessage = await DM.send(
            "** **\n\n\n\n\n\n\n\n\n\n\n\nCreation d'une nouvelle mission.\n❗ Tu possèdes désormais **5 minutes** pour répondre à chaque question ❗",
        );

        createMission(DM, interaction.member as GuildMember); // not awaited: will run separated

        await interaction.reply({
            embeds: [
                {
                    title: "Nouvelle Mission",
                    description:
                        "Fais un tour dans tes messages privés pour nous donner les informations nécessaire à la création de la mission !",
                    color: "GREEN",
                    thumbnail: { url: client.user?.avatarURL() || "" },
                    url: sentMessage.url,
                },
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "BUTTON",
                            style: "LINK",
                            label: "Messages Privées",
                            url: sentMessage.url,
                        },
                    ],
                },
            ],
            ephemeral: true,
        });

        return {
            status: "OK",
            label: "succès",
        };
    } catch {
        interaction.reply({
            ephemeral: true,
            content: "Merci d'ouvrir tes MPs pour remplir ta mission",
        });

        return {
            status: "ERROR",
            label: "NO MP",
        };
    }
}
