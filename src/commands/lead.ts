import {
    ApplicationCommandOptionType,
    ChatInputCommandInteraction,
    Client,
    Colors,
    CommandInteraction,
} from "discord.js";
import { DBMember } from "$db/schemas/member";
import { PartialApplicationCommand, CommandReturn } from "$types/commands";
import { GuildMember } from "discord.js";
import { config } from "$context/config";
import { log } from "$utils/log";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "lead",
    description: "Affiche le classement de contribution.",
    options: [
        {
            type: ApplicationCommandOptionType.Boolean,
            name: "staff",
            description: "Afficher les membres du staff",
            required: false,
        },
    ],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    if (!interaction.isChatInputCommand()) return { status: "IGNORE" };
    await interaction.deferReply();

    const staff = interaction.options.getBoolean("staff", false) || false;

    const members = await DBMember.find({})
        .sort({ contributionPoints: -1 })
        .limit(25);

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

    const list: {
        db: DBMember;
        member: GuildMember;
    }[] = [];

    for (const dbMember of members) {
        if (list.length >= 10) break;
        const member = await interaction.guild?.members
            .fetch(dbMember.discordID)
            .catch(() => log(`[lead] Failed to fetch ${dbMember.username}`));
        if (!member) continue;
        if (!staff && member.roles.cache.has(config.staffRoleId)) continue;

        list.push({
            db: dbMember,
            member,
        });
    }

    await interaction.editReply({
        content:
            "Voici le classement des contributeurs :" + staff
                ? "\n*Les membres du staff ne sont pas affichées.*"
                : "",
        embeds: list.map(({ db: dbMem, member }, i) => ({
            title: `${i + 1}. ${dbMem.username}`,
            description: `**${dbMem.contributionPoints}** points de contribution`,
            thumbnail: {
                url: member.user.displayAvatarURL() || "",
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
