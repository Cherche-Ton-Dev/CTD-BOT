import {
    ChannelType,
    GuildMember,
    OverwriteResolvable,
    PermissionFlagsBits,
    APIEmbed,
    ActionRowData,
    APIActionRowComponent,
    APIMessageActionRowComponent,
    MessageActionRowComponentData,
    MessageActionRowComponentBuilder
} from "discord.js";

export async function createTicket(
    requester: GuildMember,
    title: string,
    rolesIDS?: string[],
    parentID?: string,
    embeds?: APIEmbed[],
    components?: (
        | APIActionRowComponent<APIMessageActionRowComponent>
        | ActionRowData<MessageActionRowComponentData | MessageActionRowComponentBuilder>
        | APIActionRowComponent<APIMessageActionRowComponent>
    )[],
) {
    const permissionOverwrites: OverwriteResolvable[] = [
        {
            id: requester.guild.id, // shortcut for @everyone role ID
            deny: PermissionFlagsBits.ViewChannel,
        },
        {
            id: requester.user.id,
            allow: PermissionFlagsBits.ViewChannel,
        },
    ];

    if (rolesIDS) {
        rolesIDS.forEach((roleID) => {
            permissionOverwrites.push({
                id: roleID,
                allow: PermissionFlagsBits.ViewChannel,
            });
        });
    }
    const channel = await requester.guild?.channels.create({
        name: title,
        type: ChannelType.GuildText,
    });

    await channel.send({
        embeds,
        components,
    });

    if (parentID) await channel.setParent(parentID);
    await channel.permissionOverwrites.set(permissionOverwrites);

    return channel;
}
