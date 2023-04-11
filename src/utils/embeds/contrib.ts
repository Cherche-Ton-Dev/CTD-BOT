import { APIEmbed, Colors, GuildMember, TextChannel } from "discord.js";
import { config } from "$context/config";
import { context } from "$context/context";
import { createOrGetMember } from "$db/api/member";
import { log } from "$utils/log";

export async function featureContrib(
    member: GuildMember,
    contribution?: number,
) {
    const channel = await context.client.guilds.cache
        .get(member.guild.id)
        ?.channels.fetch(config.contribChanelID);

    if (!channel || !(channel instanceof TextChannel)) {
        return log("Erreur: Le channel de contribution n'existe pas.");
    }

    let contribPoints = 0;
    if (contribution) {
        contribPoints = contribution;
    } else {
        const dbMem = await createOrGetMember(member, true);
        contribPoints = dbMem.contributionPoints;
    }

    const embed: APIEmbed = {
        title: "Contribution",
        description: `${member} a atteint les ${contribPoints} points de contribution. 🎉`,
        color: Colors.Green,
        thumbnail: {
            url: member.user.displayAvatarURL(),
        },
        author: {
            name: member.user.username,
            icon_url: member.user.displayAvatarURL(),
        },
    };
    channel.send({ embeds: [embed] });
}
