import { Dev } from "../types/missions";

export const config = {
    suggestionsChanelId: "934916135491608702",
    pendingChannelId: "934916135051198471",
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

// TEST CONFIG
// export const config = {
//     suggestionsChanelId: "892774559147782154",
//     pendingChannelId: "897503615357427732",
//     modoRoleId: "905389455765037116",
//     ticketCategoryId: "961269635414634566",
//     welcomeChanelID: "892774431728996375",
//     ratingChanelID: "962352346430603315",
//     missionChannelIDS: {
//         dev: {
//             free: "902124390458728449",
//             payed: "902124415934922772",
//         },
//         artist: {
//             free: "902124492766216203",
//             payed: "902124525024591912",
//         },
//         "web-dev": {
//             free: "902124287828312104",
//             payed: "902124318530609193",
//         },
//     } as { [key in Dev]: { free: string; payed: string } },
//     devRoles: [
//         {
//             label: "Programmeur",
//             value: "dev" as Dev,
//             emoji: "👨‍💻",
//             description: "Pour créer un bot discord, programme, plugin, etc.",
//             roleID: "902132191834804264",
//         },
//         {
//             label: "Artiste",
//             value: "artist" as Dev,
//             emoji: "🎨",
//             description: "Pour créer un design de site web, une bannière, etc.",
//             roleID: "902132141821919272",
//         },
//         {
//             label: "Dev Web",
//             value: "web-dev" as Dev,
//             emoji: "🌐",
//             description: "Pour créer un site web.",
//             roleID: "902132166773833748",
//         },
//     ],
// };
