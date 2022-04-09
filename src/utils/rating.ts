import { MessageEmbedOptions } from "discord.js";
import { context } from "../context/context";
import { Rating } from "../db/schemas/rating";

export function generateRatingEmbed(rating: Rating): MessageEmbedOptions {
    return {
        title: "Avis",
        description: `<@${rating.dev}> a été noté **${rating.rating}/5** par <@${rating.client}>`,
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
    };
}
