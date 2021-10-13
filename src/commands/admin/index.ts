import { commandModule } from "../../types/commands";

import * as test from "./test";

export default {
    subCommand: true,
    name: "admin",
    description: "commandes pour les administrateurs",
    commands: {
        test,
    },
} as commandModule;
