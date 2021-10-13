import {
    ButtonInteraction,
    CommandInteraction,
    DMChannel,
    SelectMenuInteraction,
} from "discord.js";

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
        const received = await DM.awaitMessages({
            time: timeout,
            max: 1,
        });
        value = received.first()?.content || "";
    } catch (error) {
        return null;
    }

    return value;
}
export async function askTextInteraction(
    interaction: ButtonInteraction | SelectMenuInteraction | CommandInteraction,
    timeout: number,
    text: string,
    remove = false,
): Promise<string | null> {
    await interaction.editReply({
        content: text,
    });

    let value: string;
    try {
        const received = await interaction.channel?.awaitMessages({
            time: timeout,
            max: 1,
        });
        value = received?.first()?.content || "";
        if (remove) await received?.first()?.delete();
    } catch (error) {
        return null;
    }

    return value;
}
