import { context } from "$context/context";
import { Rating } from "$db/schemas/rating";
import { APIEmbed, Colors } from "discord.js";

export async function generateRatingEmbed(rating: Rating): Promise<APIEmbed> {
    const devMember = await context.client.guilds.cache
        .get(rating.guildID)
        ?.members.fetch(rating.dev);
    const clientMember = await context.client.guilds.cache
        .get(rating.guildID)
        ?.members.fetch(rating.client);
    return {
        title: "Avis",
        description: `${devMember} a été noté **${rating.rating}/5** par ${clientMember}`,
        color: Colors.Green,
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
            url: devMember?.user.displayAvatarURL() || "",
        },
        footer: {
            text: clientMember?.user.tag || "",
            icon_url: clientMember?.user.displayAvatarURL(),
        },
    };
}
