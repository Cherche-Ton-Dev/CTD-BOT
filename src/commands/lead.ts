import { Client, Colors, CommandInteraction, Interaction } from "discord.js";
import { DBMember } from "$db/schemas/member";
import { PartialApplicationCommand, CommandReturn } from "$types/commands";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "lead",
    description: "Affiche le classement de contribution.",
    options: [],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (!interaction.isCommand()) return { status: "IGNORE" };

    const members = await DBMember.find({})
        .sort({ contributionPoints: -1 })
        .limit(10);

    await Promise.all(
        members.map((member) => {
            return (
                interaction.guild?.members
                    .fetch(member.discordID)
                    // eslint-disable-next-line @typescript-eslint/no-empty-function
                    .catch(() => { })
            );
        }),
    );

    await interaction.reply({
        content: "Voici le classement des contributeurs :",
        embeds: members.map((member, i) => ({
            title: `${i + 1}. ${member.username}`,
            description: `**${member.contributionPoints}** points de contribution`,
            thumbnail: {
                url:
                    interaction.guild?.members.cache
                        .get(member.discordID)
                        ?.user.displayAvatarURL() || "",
            },
            // prettier-ignore
            color:
                i === 0
                    ? Colors.Gold
                    : i === 1
                        ? Colors.DarkGrey
                        : i === 2
                            ? Colors.DarkOrange
                            : Colors.Blurple,
        })),
    });

    return {
        status: "OK",
        label: "succès",
    };
}
