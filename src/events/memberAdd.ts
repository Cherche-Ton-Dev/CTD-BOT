import { GuildMember } from "discord.js";
import { log } from "../utils/log";
import { InviteData, JoinType } from "../types/invites";
import { config } from "../context/config";

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
