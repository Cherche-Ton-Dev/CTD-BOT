import { Client, Interaction } from "discord.js";
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
    interaction: Interaction,
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
                    .catch(() => {})
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
                        ?.user.displayAvatarURL({ dynamic: true }) || "",
            },
            // prettier-ignore
            color:
                i === 0
                    ? "GOLD"
                    : i === 1
                        ? "DARK_GREY"
                        : i === 2
                            ? "DARK_ORANGE"
                            : "BLURPLE",
        })),
    });

    return {
        status: "OK",
        label: "succès",
    };
}
