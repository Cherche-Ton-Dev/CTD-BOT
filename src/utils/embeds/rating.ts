import { MessageEmbedOptions } from "discord.js";
import { context } from "$context/context";
import { Rating } from "$db/schemas/rating";

export async function generateRatingEmbed(
    rating: Rating,
): Promise<MessageEmbedOptions> {
    const devMember = await context.client.guilds.cache
        .get(rating.guildID)
        ?.members.fetch(rating.dev);
    const clientMember = await context.client.guilds.cache
        .get(rating.guildID)
        ?.members.fetch(rating.client);
    return {
        title: "Avis",
        description: `${devMember} a été noté **${rating.rating}/5** par ${clientMember}`,
        color: "GREEN",
        fields: [
            {
                name: "Commentaire",
                value: rating.comment,
            },
            {
                name: "Note:",
                value: "⭐".repeat(rating.rating),
            },
        ],
        thumbnail: {
            url: devMember?.user.displayAvatarURL(),
        },
        footer: {
            text: clientMember?.user.tag,
            icon_url: clientMember?.user.displayAvatarURL(),
        },
    };
}
