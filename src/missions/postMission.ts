import { config } from "$context/config";
import { Mission } from "$db/schemas/mission";
import { generateMissionEmbed } from "$utils/embeds/mission";
import {
    ButtonInteraction,
    CommandInteraction,
    TextChannel,
} from "discord.js";

export async function postMission(
    interaction: ButtonInteraction | CommandInteraction,
    mission: Mission,
) {
    const author = (
        await interaction.guild?.members.fetch(mission.authorUserID)
    )?.user;

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
    }

    // get target channel
    const channelID =
        config.missionChannelIDS[mission.target][
            mission.isPayed ? "payed" : "free"
        ];

    const channel = (await interaction.guild?.channels.fetch(
        channelID,
    )) as TextChannel;

    const targetRoleID =
        config.devRoles.find((role) => role.value === mission.target)?.roleID ||
        "";
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
    await mission.save();
    thread.send({
        content:
            "Mettez vous d’accords ici sur **la récompense** et **les choses a réaliser**. \n" +
            "Ensuite effectuez la commande `/offer` pour créer une offre.\n" +
            `||${author}||`,
    });
}
