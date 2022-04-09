import { ApplicationCommandOptionType } from "discord-api-types";
import {
    Client,
    GuildMember,
    GuildMemberRoleManager,
    Interaction,
    TextChannel,
} from "discord.js";
import { config } from "../context/config";
import { Mission } from "../db/schemas/mission";
import { ApplicationCommand, CommandReturn } from "../types/commands";
import { log } from "../utils/log";
import { askSelectOne } from "../utils/questions";
import { askTextInteraction } from "../utils/questions/askText";

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
        !(interaction.member instanceof GuildMember)
    )
        return { status: "IGNORE" };

    const mission = await Mission.findOne({
        channel: interaction.channel.id,
    });

    if (!mission) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Vous ne vous trouvez pas dans une mission.",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            label: "NO_MISSION",
            status: "ERROR",
        };
    }

    if (
        mission.authorUserID !== interaction.member.user.id ||
        !interaction.member.roles.cache.find((r) => r.id == config.modoRoleId)
    ) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Vous n'avez pas la permission de terminer cette mission.",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            label: "MISSING_PERMISSIONS",
            status: "ERROR",
        };
    }

    const rank = await askSelectOne(
        interaction.channel,
        1000 * 60 * 5,
        "Note:",
        [
            {
                label: "",
                value: "0",
            },
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
    );
    

    log("Fin de mission:", rank, "/5", mission.task.slice(0, 20));

    const comment = await askTextInteraction()

    return {
        status: "OK",
        label: "succès",
    };
}
