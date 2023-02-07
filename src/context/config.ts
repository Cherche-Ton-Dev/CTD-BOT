import { Dev } from "$types/missions";

export const config = {
    suggestionsChanelId: "934916135491608702",
    pendingChannelId: "934916135051198471",
    bumpSquadID: "1072499795119321149",
    modoRoleId: "934916134329786387",
    respDevRoleId: "934916134329786381",
    respArtistRoleId: "934916134329786380",
    ticketCategoryId: "973257863977922640",
    welcomeChanelID: "934916135235752021",
    ratingChanelID: "934916135902654466",
    contribChanelID: "974593378115264514",
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
