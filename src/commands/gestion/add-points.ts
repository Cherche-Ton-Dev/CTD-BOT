import chalk from "chalk";
import { ApplicationCommandOptionType } from "discord-api-types/v9";
import { Client, GuildMember, Interaction } from "discord.js";
import { config } from "$context/config";
import { addPoints } from "$db/api/member";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { log } from "$utils/log";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
    name: "add-points",
    description: "Ajout un certain nombre de points a un membre.",
    options: [
        {
            type: ApplicationCommandOptionType.User,
            name: "cible",
            description: "Qui doit recevoir les points.",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Number,
            name: "points",
            description: "Nombre de points a donner (peut être négatif)",
            required: true,
        },
        {
            type: ApplicationCommandOptionType.String,
            name: "reason",
            description: "Raison du don de points.",
            required: false,
        },
    ],
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (
        !interaction.isCommand() ||
        !(interaction.member instanceof GuildMember)
    )
        return { status: "IGNORE" };

    if (
        !interaction.member.roles.cache.find((r) => r.id == config.modoRoleId)
    ) {
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Tu n'as pas la permission d'utiliser cette commande.",
                    color: "RED",
                },
            ],
        });
        return { status: "IGNORE" };
    }

    const target = interaction.options.getMember("cible", true);
    if (!(target instanceof GuildMember)) return { status: "IGNORE" };

    const points = interaction.options.getNumber("points", true);
    const reason = interaction.options.getString("reason", false);

    log(`ajout de ${chalk.green(points)}pts à ${chalk.blue(target.user.tag)}`);
    addPoints(target, points);

    interaction.reply({
        embeds: [
            {
                title: "Contribution",
                description:
                    `${target} à reçu **${points}pts**` +
                    (reason
                        ? `\nPour la raison: \n\`\`\`\n${reason}\n\`\`\``
                        : ""),
                color: "GREEN",
                thumbnail: {
                    url: target.displayAvatarURL({ dynamic: true }) || "",
                },
                author: {
                    name: interaction.user.tag,
                    icon_url: interaction.user.displayAvatarURL({
                        dynamic: true,
                    }),
                },
            },
        ],
    });

    return {
        status: "OK",
        label: "succès",
    };
}
