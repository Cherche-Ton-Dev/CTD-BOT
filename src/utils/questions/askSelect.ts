import {
    DMChannel,
    MessageSelectOptionData,
    SelectMenuInteraction,
} from "discord.js";
import { disableComponent, fakeReply } from "./index";

export async function askSelectOne<T>(
    DM: DMChannel,
    timeout: number,
    text: string,
    options: MessageSelectOptionData[],
): Promise<T | null> {
    const sentMessage = await DM.send({
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
    });

    let selectInteraction: SelectMenuInteraction;
    try {
        selectInteraction = await sentMessage.awaitMessageComponent({
            time: timeout,
            componentType: "SELECT_MENU",
        });
        await fakeReply(selectInteraction);
    } catch (error) {
        return null;
    }

    await disableComponent(sentMessage);
    return selectInteraction.values[0] as unknown as T | null;
}
