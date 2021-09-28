import { APIApplicationCommand } from "discord-api-types";

declare interface ApplicationCommand
    extends Omit<Omit<APIApplicationCommand, "id">, "application_id"> {
    id?: string;
}

export type CommandReturn = Promise<{
    status: "OK" | "ERROR" | "IGNORE";
    /** le résultat de la commande, à afficher dans la console */
    label?: string;
}>;
