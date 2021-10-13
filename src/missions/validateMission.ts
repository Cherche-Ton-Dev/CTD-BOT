import { GuildMember, User } from "discord.js";
import { Mission } from "../db/schemas/mission";
import { context } from "../context/context";
import { Dev, IMission } from "../types/missions";
import { createOrGetMember } from "../db/api/member";
import { config } from "../context/config";
import { log } from "../utils/log";
import { generateMissionEmbed } from "./generateEmbed";

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
        embeds: [generateMissionEmbed(newMission, member.user)],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        label: "ACCEPTER",
                        style: "SUCCESS",
                        emoji: "✅",
                        customId: `event-accept-{${newMission.id}}`,
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
