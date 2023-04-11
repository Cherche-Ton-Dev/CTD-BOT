/* eslint-disable indent */
import {
    ChannelType,
    Colors,
    GuildMember,
    PartialGuildMember,
} from "discord.js";
import { log } from "$utils/log";
import { config } from "$context/config";
import { addPoints, getMember } from "$db/api/member";
import { invitePoints } from "$utils/equations";

export async function handleMemberRemove(
    member: GuildMember | PartialGuildMember,
): Promise<void> {
    if (!(member instanceof GuildMember))
        return log("ERROR: received a partial member left");
    const channel = await member.guild.channels.fetch(config.welcomeChanelID);
    if (channel?.type != ChannelType.GuildText)
        return log("ERREUR: welcomeChanelID invalide");

    channel.send({
        embeds: [
            {
                title: `Au revoir ${
                    member.nickname || member.user?.username
                } !`,
                description: `${
                    member.nickname || member.user?.username
                } a quitté CTD 🥺.`,
                color: Colors.Red,
                thumbnail: {
                    url: member.user?.displayAvatarURL() || "",
                },
            },
        ],
    });

    const dbMem = await getMember(member as GuildMember);
    if (!dbMem || !dbMem.invitedBy) return;

    const contribPoints = -invitePoints();

    const inviter = await member.guild.members.fetch(dbMem.invitedBy);

    addPoints(inviter, contribPoints);

    return;
}
