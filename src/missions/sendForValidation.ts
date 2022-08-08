/**
 * IN MP, send the mission to the server for validation.
 */

import { GuildMember } from "discord.js";
import { Mission } from "$db/schemas/mission";
import { IMission } from "$types/missions";
import { createOrGetMember } from "$db/api/member";
import { config } from "context/config";
import { log } from "utils/log";
import { generateMissionEmbed } from "utils/embeds/mission";

export async function validateMission(
    rawMission: IMission,
    member: GuildMember,
) {
    const author = await createOrGetMember(member, true);

    rawMission.author = author._id;

    const newMission = new Mission(rawMission);
    await newMission.save();

    // SEND FOR VERIFICATION

    const channel = await member.guild.channels.fetch(config.pendingChannelId);
    if (!channel || !channel.isText()) {
        log("🟥 pendingChannelId is wrong 🟥");
        return;
    }
    channel.send({
        content: `nouvelle mission de ${member}`,
        embeds: [
            {
                title: "Infos",
                fields: [
                    {
                        name: "Développeur cible:",
                        value: newMission.target,
                    },
                    {
                        name: "Payée:",
                        value: newMission.isPayed ? "oui" : "non",
                    },
                ],
                color: "RANDOM",
            },
            generateMissionEmbed(newMission, member.user),
        ],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        label: "ACCEPTER",
                        style: "SUCCESS",
                        emoji: "✅",
                        customId: `event-validate-{${newMission.id}}`,
                    },
                    {
                        type: "BUTTON",
                        label: "REFUSER",
                        style: "DANGER",
                        emoji: "🗑️",
                        customId: `event-decline{${newMission.id}}`,
                    },
                ],
            },
        ],
    });
}
