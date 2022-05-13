import { GuildMember, Message } from "discord.js";
import { addPoints } from "../db/api/member";
import { messagePoints } from "../utils/equations";

const lastMessages: Map<string, Date> = new Map();

export async function handleMessageCreated(message: Message) {
    if (message.author.bot || !(message.member instanceof GuildMember)) {
        return;
    }

    const lastMessageDate = lastMessages.get(message.member.id);
    if (lastMessageDate && lastMessageDate.getTime() + 1000 * 10 > Date.now()) {
        return;
    }

    lastMessages.set(message.member.id, new Date());
    const contribPoints = messagePoints();
    await addPoints(message.member, contribPoints);
}
