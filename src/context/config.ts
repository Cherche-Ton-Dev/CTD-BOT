import { Dev } from "../types/missions";

export const config = {
    suggestionsChanelId: "892774559147782154",
    pendingChannelId: "897503615357427732",
    missionChannelIDS: {
        "web-dev": {
            free: "902124287828312104",
            payed: "902124318530609193",
        },
        artist: {
            free: "902124492766216203",
            payed: "902124525024591912",
        },
        dev: {
            free: "902124390458728449",
            payed: "902124415934922772",
        },
    } as { [key in Dev]: { free: string; payed: string } },
    devRoles: [
        {
            label: "Programmeur",
            value: "dev" as Dev,
            emoji: "👨‍💻",
            description: "Pour créer un bot discord, programme, plugin, etc.",
            roleID: "902132191834804264",
        },
        {
            label: "Artiste",
            value: "artist" as Dev,
            emoji: "🎨",
            description:
                "Pour créer un design de site web, une bannière, une photo de profil, etc.",
            roleID: "902132141821919272",
        },
        {
            label: "Dev Web",
            value: "web-dev" as Dev,
            emoji: "🌐",
            description: "Pour créer un site web.",
            roleID: "902132166773833748",
        },
    ],
};
