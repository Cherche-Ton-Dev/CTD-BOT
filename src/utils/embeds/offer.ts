import { IOffer } from "$types/missions";
import { APIEmbed, Colors, GuildMember } from "discord.js";

export function generateOfferEmbed(
    offer: IOffer,
    creator: GuildMember,
): APIEmbed {
    return {
        title: "Offre",
        description: `offre de la part de ${creator}`,
        author: {
            icon_url: creator.avatarURL() || "",
            name: creator.displayName,
        },
        fields: [
            {
                name: "Récompense",
                value: "```\n" + (offer.price || "Aucune") + "\n```",
            },
            {
                name: "Délai",
                value: "```\n" + (offer.delay || "Non précisé") + "\n```",
            },
            {
                name: "Informations complémentaires",
                value: "```\n" + (offer.info || "Aucunes") + "\n```",
            },
        ],
        color: Colors.Green,
    };
}
