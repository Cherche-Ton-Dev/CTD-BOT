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
    args: string | undefined,
): Promise<CommandReturn> {
    if (!args)
        return {
            status: "IGNORE",
        };

    if (
        !(interaction.member?.roles as GuildMemberRoleManager).cache.find(
            (r) =>
                r.id in
                [
                    config.modoRoleId,
                    config.respDevRoleId,
                    config.respArtistRoleId,
                ],
        )
    ) {
        await interaction.reply({
            content: "Tu n'as pas la permission d'attribuer ce role.",
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "MISSING_PERMISSIONS",
        };
    }

    const [userID, roleID] = args?.split(",");

    const user = await interaction.guild?.members.fetch(userID);
    const role = await interaction.guild?.roles.fetch(roleID);

    await user?.roles.add(roleID);

    const dm = await user?.createDM();
    await dm?.send(`Tu as obtenu le role ${role?.name}`);

    await interaction.channel?.delete();

    if (!user)
        return {
            status: "ERROR",
            label: "No user",
        };
    const DBMember = await getMember(user);
    if (DBMember) {
        DBMember.roleTicketPending = false;
        DBMember.save();
    }

    return {
        status: "OK",
        label: "succès",
    };
}
