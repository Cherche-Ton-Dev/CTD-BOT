import { ButtonInteraction, DMChannel } from "discord.js";
import { disableComponent, fakeReply } from "./index";

export async function askYesNo(
    DM: DMChannel,
    timeout: number,
    text: string,
    labelYes?: string,
    labelNo?: string,
): Promise<boolean | null> {
    let sentMessage = await DM.send({
        content: text,
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        style: "SUCCESS",
                        label: labelYes || "OUI",
                        customId: "yes",
                    },
                    {
                        type: "BUTTON",
                        style: "DANGER",
                        label: labelNo || "NON",
                        customId: "no",
                    },
                ],
            },
        ],
    });

    let buttonInteraction: ButtonInteraction;
    try {
        buttonInteraction = await sentMessage.awaitMessageComponent({
            time: timeout, // 2 min
            componentType: "BUTTON",
        });
        await fakeReply(buttonInteraction);
    } catch (error) {
        return null;
    }
    await disableComponent(sentMessage);
    return buttonInteraction.customId === "yes";
}
