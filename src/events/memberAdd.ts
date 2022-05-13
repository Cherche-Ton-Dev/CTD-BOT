import { GuildMember } from "discord.js";
import { log } from "../utils/log";
import { InviteData, JoinType } from "../types/invites";
import { config } from "../context/config";
import { addPoints, createOrGetMember } from "../db/api/member";
import { invitePoints } from "../utils/equations";

export async function handleMemberAdd(
    member: GuildMember,
    joinType: JoinType,
    usedInvite: InviteData | null,
): Promise<void> {
    const channel = await member.guild.channels.fetch(config.welcomeChanelID);
    if (!channel || !channel.isText())
        return log("ERREUR: welcomeChanelID invalide");

    if (joinType === "normal") {
        log(
            `${member.user.tag} a été invité par ${usedInvite?.inviter.username}`,
        );
        channel.send({
            embeds: [
                {
                    title: `Bonjour ${member.user.username} !`,
                    description: `Bienvenue sur CTD.\nTu as été invité par ${usedInvite?.inviter}.`,
                    color: "GREEN",
                    thumbnail: {
                        url:
                            member.user.displayAvatarURL({
                                dynamic: true,
                            }) || "",
                    },
                    footer: {
                        text: usedInvite?.inviter.tag,
                        icon_url: usedInvite?.inviter.displayAvatarURL(),
                    },
                },
            ],
        });
        const dbMem = await createOrGetMember(member, false);
        const inviter = await member.guild.members.fetch(
            usedInvite?.inviter.id,
        );
        dbMem.invitedBy = usedInvite?.inviter.id;
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
                color: "GREEN",
                thumbnail: {
                    url:
                        member.user.displayAvatarURL({
                            dynamic: true,
                        }) || "",
                },
            },
        ],
    });
}
