import {
    CommandInteraction,
    DMChannel,
    Interaction,
    Message,
    MessageOptions,
    MessageSelectOptionData,
    SelectMenuInteraction,
    TextBasedChannels,
    TextChannel,
} from "discord.js";
import { disableComponent, fakeReply } from "./index";

export async function askSelectOne<T>(
    channel: DMChannel | TextChannel,
    timeout: number,
    text: string,
    options: (MessageSelectOptionData & { value: T })[],
    interaction?: CommandInteraction,
) {
    const msgOptions: MessageOptions = {
        content: text,
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "SELECT_MENU",
                        customId: "dev-select",
                        options,
                    },
                ],
            },
        ],
    };
    let sentMessage: Message;
    if (interaction)
        sentMessage = (await interaction.editReply(msgOptions)) as Message;
    else sentMessage = await channel.send(msgOptions);

    let selectInteraction: SelectMenuInteraction;
    try {
        selectInteraction = await sentMessage.awaitMessageComponent({
            time: timeout,
            componentType: "SELECT_MENU",
        });
        // await fakeReply(selectInteraction);
    } catch (error) {
        return {
            interaction: null,
            value: null,
        };
    }

    if (!interaction) await disableComponent(sentMessage);
    return {
        interaction: selectInteraction,
        value: selectInteraction.values[0] as unknown as T,
    };
}
