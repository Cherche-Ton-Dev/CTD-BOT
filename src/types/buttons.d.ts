import { Client, ButtonInteraction } from "discord.js";
import { CommandReturn } from "./commands";

declare interface IButtonList {
    [key: string]: {
        run: (
            client: Client,
            interaction: ButtonInteraction,
        ) => Promise<CommandReturn>;
    };
}
