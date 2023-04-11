/**
 * IN Guild, after create mission button cliqued
 */

import {
    ButtonInteraction,
    ButtonStyle,
    Client,
    Colors,
    ComponentType,
    GuildMember,
} from "discord.js";

import { CommandReturn } from "$types/commands";
import { createMission } from "$missions/createMissionInDm";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    await interaction.deferReply({
        ephemeral: true,
    });

    try {
        // eslint-disable-next-line no-var
        var DM = await interaction.user.createDM();
    } catch {
        interaction.editReply({
            content: "Merci d'ouvrir tes MPs pour remplir ta mission",
        });

        return {
            status: "ERROR",
            label: "NO MP",
        };
    }


    const sentMessage = await DM.send(
        "** **\n\n\n\n\n\n\n\n\n\n\n\nCreation d'une nouvelle mission.\n❗ Tu possèdes désormais **5 minutes** pour répondre à chaque question ❗",
    );

    await interaction.editReply({
        embeds: [
            {
                title: "Nouvelle Mission",
                description:
                    "Fais un tour dans tes messages privés pour nous donner les informations nécessaire à la création de la mission !",
                color: Colors.Green,
                thumbnail: { url: client.user?.avatarURL() || "" },
                url: sentMessage.url,
            },
        ],
        components: [
            {
                type: ComponentType.ActionRow,
                components: [
                    {
                        type: ComponentType.Button,
                        style: ButtonStyle.Link,
                        label: "Messages Privées",
                        url: sentMessage.url,
                    },
                ],
            },
        ],
    });

    await createMission(DM, interaction.member as GuildMember);

    return {
        status: "OK",
        label: "succès",
    };

}
