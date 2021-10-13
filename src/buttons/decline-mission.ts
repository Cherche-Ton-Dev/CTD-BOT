import { ButtonInteraction, Client, Message } from "discord.js";

import { CommandReturn } from "../types/commands";
import { declineMission } from "../db/api/mission";
import { generateMissionEmbed } from "../missions/generateEmbed";
import { askTextInteraction } from "../utils/questions/askText";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
    id: string | undefined,
): Promise<CommandReturn> {
    await interaction.deferReply({ ephemeral: true });
    if (!id) {
        await interaction.editReply({
            content: "Erreur: cette mission est invalide",
        });
        return {
            status: "ERROR",
            label: "id of accept is missing",
        };
    }

    const reason = await askTextInteraction(
        interaction,
        1000 * 60,
        "Pour quelle raison?",
        true,
    );
    if (!reason) return { status: "ERROR", label: "no response" };
    // if (interaction.channel) {
    //     const validate = await askYesNo(
    //         interaction.channel as TextChannel,
    //         1000 * 60,
    //         "Annuler la mission pour la raison ```" + reason + "```",
    //         undefined,
    //         undefined,
    //         true,
    //     );
    //     if (!validate) return { status: "IGNORE", label: "cancel" };
    // }

    const mission = await declineMission(id);

    await (interaction.message as Message).delete();
    if (mission) {
        await interaction.editReply({
            content: "Mission supprimée.",
        });
    } else {
        await interaction.editReply({
            content: "** **",
            embeds: [
                {
                    title: "Cet mission n'existe plus",
                    color: "RED",
                },
            ],
        });
        return {
            status: "ERROR",
            label: "mission not exist",
        };
    }

    const target = await interaction.guild?.members.fetch(mission.authorUserID);
    const DM = await target?.createDM();

    if (target && DM) {
        await DM.send({
            content: "ta mission",
            embeds: [generateMissionEmbed(mission, target.user)],
        });
        await DM.send("à été refusée pour la raison: ```" + reason + "```");
    }

    return {
        status: "OK",
        label: "succès",
    };
}
