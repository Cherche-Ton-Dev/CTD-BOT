import { commandModule } from "$types/commands";

import * as createMissionButton from "./createMissionButton";
import * as addPoints from "./add-points";

export default {
    subCommand: true,
    name: "gestion",
    description: "commandes pour gérer le serveur",
    commands: {
        "create-mission-button": createMissionButton,
        "add-points": addPoints,
    },
} as commandModule;
