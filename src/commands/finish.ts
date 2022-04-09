import { ApplicationCommandOptionType } from "discord-api-types";
import {
    Client,
    Guild,
    GuildMember,
    GuildMemberRoleManager,
    Interaction,
    TextChannel,
} from "discord.js";
import { config } from "../context/config";
import { createRating } from "../db/api/rating";
import { Mission } from "../db/schemas/mission";
import { ApplicationCommand, CommandReturn } from "../types/commands";
import { log } from "../utils/log";
import { askSelectOne } from "../utils/questions";
import { askTextInteraction } from "../utils/questions/askText";
import { generateRatingEmbed } from "../utils/rating";

export const subCommand = false;
export const data: ApplicationCommand = {
    name: "finish",
    description: "Terminer une mission",
};

export async function run(
    client: Client,
    interaction: Interaction,
): Promise<CommandReturn> {
    if (
        !interaction.isCommand() ||
        !(interaction.channel instanceof TextChannel) ||
        !(interaction.member instanceof GuildMember) ||
        !(interaction.guild instanceof Guild)
    )
        return { status: "IGNORE" };

    await interaction.deferReply({ ephemeral: true });

    const mission = await Mission.findOne({
        channel: interaction.channel.id,
    });

    if (!mission) {
        interaction.editReply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Vous ne vous trouvez pas dans une mission.",
                    color: "RED",
                },
            ],
        });
        return {
            label: "NO_MISSION",
            status: "ERROR",
        };
    }

    if (
        mission.authorUserID !== interaction.member.user.id &&
        !interaction.member.roles.cache.find((r) => r.id == config.modoRoleId)
    ) {
        interaction.editReply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Vous n'avez pas la permission de terminer cette mission.",
                    color: "RED",
                },
            ],
        });
        return {
            label: "MISSING_PERMISSIONS",
            status: "ERROR",
        };
    }

    const { interaction: rankInter, value: rank } = await askSelectOne(
        interaction.channel,
        1000 * 60 * 5,
        "Note:",
        [
            {
                label: "⭐",
                value: "1",
            },
            {
                label: "⭐⭐",
                value: "2",
            },
            {
                label: "⭐⭐⭐",
                value: "3",
            },
            {
                label: "⭐⭐⭐⭐",
                value: "4",
            },
            {
                label: "⭐⭐⭐⭐⭐",
                value: "5",
            },
        ],
        interaction,
    );
    if (!rankInter) return { status: "ERROR", label: "TIMEOUT" };
    await rankInter.deferReply({ ephemeral: true });

    log("Fin de mission:", rank + "/5", mission.task.slice(0, 20));

    const comment = await askTextInteraction(
        rankInter,
        1000 * 60 * 5,
        "Commentaire:",
        true,
        (i) => i.author.id == interaction.member?.user.id,
    );
    if (!comment) return { status: "ERROR", label: "TIMEOUT" };
    log("Commentaire:", comment.slice(0, 20));

    const dev = await interaction.guild.members.fetch(mission.acceptedBy || "");
    const missionClient = await interaction.guild.members.fetch(
        mission.authorUserID,
    );

    const rating = await createRating(
        mission,
        parseInt(rank || "0"),
        comment,
        dev,
        missionClient,
    );
    await rating.save();

    const embed = generateRatingEmbed(rating);
    await interaction.channel.send({ embeds: [embed] });

    const ratingChannel = await interaction.guild.channels.fetch(
        config.ratingChanelID,
    );

    if (!(ratingChannel instanceof TextChannel))
        return { status: "ERROR", label: "WRONG_RATING_CHANNEL" };

    await ratingChannel.send({ embeds: [embed] });

    mission.finished = true;
    await mission.save();

    interaction.channel.send({
        embeds: [
            {
                title: "Mission terminée",
                description:
                    "La mission a été terminée avec succès. Merci de vérifier le channel des avis.",
                color: "GREEN",
            },
        ],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        customId: "event-close-ticket",
                        label: "Fermer",
                        emoji: "🗑️",
                        style: "DANGER",
                    },
                ],
            },
        ],
    });

    return {
        status: "OK",
        label: "succès",
    };
}
