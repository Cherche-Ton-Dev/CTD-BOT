import {
    BaseMessageComponentOptions,
    GuildMember,
    MessageActionRow,
    MessageActionRowOptions,
    MessageEmbedOptions,
    OverwriteResolvable,
} from "discord.js";

export async function createTicket(
    requester: GuildMember,
    title: string,
    rolesIDS?: string[],
    parentID?: string,
    embeds?: MessageEmbedOptions[],
    components?: (
        | MessageActionRow
        | (Required<BaseMessageComponentOptions> & MessageActionRowOptions)
    )[],
) {
    const permissionOverwrites: OverwriteResolvable[] = [
        {
            id: requester.guild.id, // shortcut for @everyone role ID
            deny: "VIEW_CHANNEL",
        },
        {
            id: requester.user.id,
            allow: "VIEW_CHANNEL",
        },
    ];

    if (rolesIDS) {
        rolesIDS.forEach((roleID) => {
            permissionOverwrites.push({
                id: roleID,
                allow: "VIEW_CHANNEL",
            });
        });
    }
    const channel = await requester.guild?.channels.create(title, {
        type: "GUILD_TEXT",
    });

    await channel.send({
        embeds,
        components,
    });

    if (parentID) await channel.setParent(parentID);
    await channel.permissionOverwrites.set(permissionOverwrites);

    return channel;
}
