import { GuildMember, Message } from "discord.js";
import { addPoints } from "$db/api/member";
import { bumpPoints, messagePoints } from "$utils/equations";
import { config } from "$context/config";

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
        await message.channel.send({
            content: `${bumper} a reçu ${contribPoints} points de contribution pour son bump 👍.\n Clique ci dessous pour être prévenu quand tu pourras bump a nouveau.`,
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        {
                            type: "BUTTON",
                            label: "PRÉVIENS MOI",
                            emoji: "⏰",
                            customId: "event-bump-squad",
                            style: "SUCCESS",
                        },
                    ],
                },
            ],
        });

        setTimeout(() => {
            message.channel.send({
                content:
                    `Le bump est disponible: <&${config.bumpSquadID}>\n` +
                    `
\`\`\`
/bump
\`\`\
`,
            });
        }, 1000 * 60 * 60 * 2 + 1000 * 60);
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
