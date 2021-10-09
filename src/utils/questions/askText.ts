import { DMChannel } from "discord.js";

export async function askText(
    DM: DMChannel,
    timeout: number,
    text: string,
): Promise<string | null> {
    await DM.send({
        content: text,
    });

    let value: string;
    try {
        let received = await DM.awaitMessages({
            time: timeout,
            max: 1,
        });
        value = received.first()?.content || "";
    } catch (error) {
        return null;
    }

    return value;
}
