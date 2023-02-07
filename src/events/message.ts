import { GuildMember, Message } from "discord.js";
import { addPoints } from "$db/api/member";
import { bumpPoints, messagePoints } from "$utils/equations";

const lastMessages: Map<string, Date> = new Map();

export async function handleMessageCreated(message: Message) {
    if (!(message.member instanceof GuildMember)) {
        return;
    }

    await points(message.member);
    if (
        message.author.id === "302050872383242240" /*disboard*/ &&
        message.interaction?.commandName === "bump"
    ) {
        const bumper = await message.guild?.members.fetch(
            message.interaction.user.id,
        );
        if (!bumper) return;
        const contribPoints = bumpPoints(bumper);
        await addPoints(bumper, contribPoints);
        await message.channel.send(
            `${bumper} a reçu ${contribPoints} points de contribution pour son bump 👍.`,
        );
    }
}

async function points(member: GuildMember) {
    const lastMessageDate = lastMessages.get(member.id);
    if (lastMessageDate && lastMessageDate.getTime() + 1000 * 10 > Date.now()) {
        return;
    }

    lastMessages.set(member.id, new Date());
    const contribPoints = messagePoints();
    await addPoints(member, contribPoints);
}
