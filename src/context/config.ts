import { Dev } from "../types/missions";

const rawConfig = {
    suggestionsChanelId: "934916135491608702",
    pendingChannelId: "934916135051198471",
    modoRoleId: "934916134329786383",
    ticketCategoryId: "934916136259182603",
    missionChannelIDS: {
        dev: {
            free: "934916135709724706",
            payed: "934916135709724707",
        },
        artist: {
            free: "934916135709724708",
            payed: "934916135709724709",
        },
        "web-dev": {
            free: "934916135709724710",
            payed: "934916135709724711",
        },
    } as { [key in Dev]: { free: string; payed: string } },
    devRoles: [
        {
            label: "Programmeur",
            value: "dev" as Dev,
            emoji: "👨‍💻",
            description: "Pour créer un bot discord, programme, plugin, etc.",
            roleID: "934916134329786378",
        },
        {
            label: "Artiste",
            value: "artist" as Dev,
            emoji: "🎨",
            description: "Pour créer un design de site web, une bannière, etc.",
            roleID: "934916134313033855",
        },
        {
            label: "Dev Web",
            value: "web-dev" as Dev,
            emoji: "🌐",
            description: "Pour créer un site web.",
            roleID: "934916134313033856",
        },
    ],
};

export const config = rawConfig;
