import { ChannelType, Colors, GuildMember } from "discord.js";
import { log } from "$utils/log";
import { InviteData, JoinType } from "$types/invites";
import { config } from "$context/config";
import { addPoints, createOrGetMember } from "$db/api/member";
import { invitePoints } from "$utils/equations";

export async function handleMemberAdd(
    member: GuildMember,
    joinType: JoinType,
    usedInvite: InviteData | null,
): Promise<void> {
    const channel = await member.guild.channels.fetch(config.welcomeChanelID);
    if (channel?.type != ChannelType.GuildText)
        return log("ERREUR: welcomeChanelID invalide");

    if (joinType === "normal") {
        const inviterMem = await member.guild.members.fetch(
            usedInvite?.inviter,
        );
        log(`${member.user.tag} a été invité par ${inviterMem.user.username}`);
        channel.send({
            embeds: [
                {
                    title: `Bonjour ${member.user.username} !`,
                    description: `Bienvenue sur CTD.\nTu as été invité par ${inviterMem}.`,
                    color: Colors.Green,
                    thumbnail: {
                        url:
                            member.user.displayAvatarURL() || "",
                    },
                    footer: {
                        text: inviterMem.user.tag,
                        icon_url: inviterMem.displayAvatarURL(),
                    },
                },
            ],
        });
        const dbMem = await createOrGetMember(member, false);
        const inviter = await member.guild.members.fetch(inviterMem.id);
        dbMem.invitedBy = inviter.id;
        await dbMem.save();

        const contribPoints = invitePoints();
        await addPoints(inviter, contribPoints);

        return;
    }

    channel.send({
        embeds: [
            {
                title: `Bonjour ${member.user.username} !`,
                description: "Bienvenue sur CTD.",
                color: Colors.Green,
                thumbnail: {
                    url:
                        member.user.displayAvatarURL() || "",
                },
            },
        ],
    });
}
