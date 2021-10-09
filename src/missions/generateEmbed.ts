import { EmbedFieldData, MessageEmbedOptions, User } from "discord.js";
import { IMission } from "../types/missions";

export function generateMissionEmbed(
    mission: IMission,
    user: User,
): MessageEmbedOptions {
    const fields: EmbedFieldData[] = [];

    if (mission.price) {
        fields.push({
            name: "**RÉCOMPENSE**",
            value: mission.price,
        });
    }
    fields.push({
        name: "**DIFFICULTÉ**",
        value: mission.difficulty + "/5",
    });

    return {
        author: {
            iconURL: user.avatarURL({ dynamic: true }) || "",
            name: user.username,
        },
        thumbnail: {
            url: "https://emoji.gg/assets/emoji/7169_ThisIsFine.png",
        },
        color: "DARK_BLUE",
        title: "Mission",
        description: mission.task,
        fields,
        timestamp: new Date(),
    };
}
