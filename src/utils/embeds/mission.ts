import { APIEmbed, Colors, User, APIEmbedField } from "discord.js";
import { IMission } from "types/missions";

export function generateMissionEmbed(mission: IMission, user: User): APIEmbed {
    const fields: APIEmbedField[] = [];

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
            icon_url: user.avatarURL() || "",
            name: user.username,
        },
        thumbnail: {
            url: "https://emoji.gg/assets/emoji/7169_ThisIsFine.png",
        },
        color: Colors.DarkBlue,
        title: "Mission",
        description: mission.task,
        fields,
        timestamp:
            new Date().toLocaleDateString() +
            " " +
            new Date().toLocaleTimeString(),
    };
}
