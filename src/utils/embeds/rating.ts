import { context } from "$context/context";
import { Rating } from "$db/schemas/rating";
import { APIEmbed, Colors } from "discord.js";

export async function generateRatingEmbed(rating: Rating): Promise<APIEmbed> {
    const devMember = await context.client.users
        .fetch(rating.dev)
        .catch(() => null);
    const clientMember = await context.client.users
        .fetch(rating.client)
        .catch(() => null);
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
            url: devMember?.displayAvatarURL() || "Invalid User",
        },
        footer: {
            text: clientMember?.tag || "Invalid User",
            icon_url: clientMember?.displayAvatarURL() || "Invalid User",
        },
    };
}
