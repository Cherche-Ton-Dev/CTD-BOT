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

declare interface ICommandList {
    [key: string]:
        | {
              data: ApplicationCommand;
              run: (
                  client: Client,
                  interaction: Interaction,
              ) => Promise<CommandReturn>;
          }
        | undefined;
}
