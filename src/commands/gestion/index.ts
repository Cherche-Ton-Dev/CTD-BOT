import { commandModule } from "../../types/commands";

import * as createMissionButton from "./createMissionButton";

export default {
    subCommand: true,
    name: "gestion",
    description: "commandes pour gérer le serveur",
    commands: {
        "create-mission-button": createMissionButton,
    },
} as commandModule;
