import {
    ButtonInteraction,
    CommandInteraction,
    Message,
    SelectMenuInteraction,
} from "discord.js";

export { askSelectOne } from "./askSelect";
export { askText } from "./askText";
export { askYesNo } from "./askYesNo";

export async function disableComponent(message: Message) {
    const components = message.components;
    components.forEach((row) =>
        row.components.forEach((component) => component.setDisabled(true)),
    );
    await message.edit({
        components,
    });
}

export async function fakeReply(
    interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction,
) {
    await interaction.reply("** **");
    // await interaction.deleteReply();
}
