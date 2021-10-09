import { APIApplicationCommand } from "discord-api-types";
import { Client, Interaction } from "discord.js";

declare interface ApplicationCommand
    extends Omit<Omit<APIApplicationCommand, "id">, "application_id"> {
    id?: string;
}

export type CommandReturn = {
    status: "OK" | "ERROR" | "IGNORE";
    /** le résultat de la commande, à afficher dans la console */
    label?: string;
};

interface rawCommandModule {
    subCommand?: false;
    data: ApplicationCommand;
    run: (client: Client, interaction: Interaction) => Promise<CommandReturn>;
}

type commandModule =
    | rawCommandModule
    | {
          subCommand?: true;
          name: string;
          description: string;
          commands: { [key: string]: rawCommandModule };
      };

/**
 * list of commands and sub commands
 *
 * @example
 * let commands = {} as ICommandList;
 * let e = commands[""];
 * if (e?.subCommand === true) {
 *     e.commands[""].data;
 * } else if (e?.subCommand === false) {
 *     e.data;
 * }
 */
declare interface ICommandList {
    [key: string]: commandModule | undefined;
}
