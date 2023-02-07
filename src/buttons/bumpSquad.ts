import {
    ButtonInteraction,
    Client,
    GuildMember,
    GuildMemberRoleManager,
} from "discord.js";

import { CommandReturn } from "$types/commands";
import { config } from "$context/config";
import { getMember } from "$db/api/member";

export const subCommand = false;

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    if (!(interaction.member instanceof GuildMember))
        return { status: "IGNORE" };

    if (interaction.member.roles.cache.get(config.bumpSquadID)) {
        await interaction.member.roles.remove(config.bumpSquadID);
        await interaction.reply({
            ephemeral: true,
            content: "Tu ne seras plus prévenu des bumps.",
        });
    } else {
        await interaction.member.roles.add(config.bumpSquadID);
        await interaction.reply({
            ephemeral: true,
            content: "✅ Tu ne seras prévenu des prochains bumps.",
        });
    }

    return {
        status: "OK",
        label: "succès",
    };
}
