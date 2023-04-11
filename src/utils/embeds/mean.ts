import { IRating } from "$db/schemas/rating";
import { APIEmbed, Colors, GuildMember } from "discord.js";

export function generateMeanEmbed(
    member: GuildMember,
    ratings: IRating[],
): APIEmbed {
    const mean =
        ratings.reduce((acc, cur) => acc + cur.rating, 0) / ratings.length;
    return {
        title: `Note de ${member.displayName}`,
        description: `${member} a reçu ${ratings.length} avis.`,
        fields: [
            {
                name: "Moyenne",
                value:
                    "⭐".repeat(Math.round(mean)) +
                    ":curly_loop:".repeat(5 - Math.round(mean)) +
                    ` (${Math.round(mean * 10) / 10 || "-"}/5)`,
            },
        ],
        color: mean >= 4 ? Colors.Green : mean >= 2 ? Colors.Red : Colors.Red,
        thumbnail: {
            url: member.user.displayAvatarURL(),
        },
    };
}
