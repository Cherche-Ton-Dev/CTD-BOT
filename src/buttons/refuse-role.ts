import {
    ButtonInteraction,
    Client,
    GuildMember,
    GuildMemberRoleManager,
} from "discord.js";

import { CommandReturn } from "../types/commands";
import { config } from "../context/config";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
    args: string | undefined,
): Promise<CommandReturn> {
    if (!args)
        return {
            status: "IGNORE",
        };

    const [userID, roleID] = args?.split(",");

    const user = await interaction.guild?.members.fetch(userID);
    const role = await interaction.guild?.roles.fetch(roleID);

    const dm = await user?.createDM();
    await dm?.send(`Le role ${role?.name} t'a été refusé.`);

    await interaction.channel?.delete();

    return {
        status: "OK",
        label: "succès",
    };
}
