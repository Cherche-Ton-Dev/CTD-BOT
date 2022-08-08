import { IRating } from "$db/schemas/rating";
import { GuildMember, MessageEmbedOptions } from "discord.js";

export function generateMeanEmbed(
    member: GuildMember,
    ratings: IRating[],
): MessageEmbedOptions {
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
                    ` (${mean}/5)`,
            },
        ],
        color: mean >= 4 ? "GREEN" : mean >= 2 ? "YELLOW" : "RED",
        thumbnail: {
            url: member.user.displayAvatarURL(),
        },
    };
}
