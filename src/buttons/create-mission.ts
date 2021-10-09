import { ButtonInteraction, Client } from "discord.js";

import { CommandReturn } from "../types/commands";
import { createMission } from "../missions/createMissionInDm";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    const DM = await interaction.user.createDM();
    const sentMessage = await DM.send(
        "** **\n\n\n\n\n\n\n\n\n\n\n\nCreation d'une nouvelle mission.\n❗ Tu as **5 minutes** pour répondre à chaque question ❗",
    );
    createMission(DM); // not awaited: will run separated

    await interaction.reply({
        embeds: [
            {
                title: "Nouvelle Mission",
                description:
                    "Rdv dans tes messages privées pour me donner les informations sur ta mission.",
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
}
