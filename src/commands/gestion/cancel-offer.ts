import { Client, Colors, CommandInteraction, GuildMember, Interaction, TextChannel } from "discord.js";
import { config } from "$context/config";
import {
    CommandReturn,
    PartialApplicationCommandSubCommand,
} from "$types/commands";
import { Mission } from "$db/schemas/mission";
import { postMission } from "$missions/postMission";

export const subCommand = false;
export const data: PartialApplicationCommandSubCommand = {
    name: "cancel-offer",
    description:
        "Annule une offre pour permettre a un nouveau dev de la prendre",
    options: [],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
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
                    color: Colors.Red,
                },
            ],
        });
        return { status: "IGNORE" };
    }

    const mission = await Mission.findOne({
        channel: interaction.channelId,
    });
    if (!mission) {
        interaction.reply({
            ephemeral: true,
            embeds: [
                {
                    title: "Error",
                    description:
                        "Aucune mission trouvée correspondant a ce salon",
                    color: Colors.Red,
                },
            ],
        });

        return {
            status: "ERROR",
            label: "no mission in channel",
        };
    }

    // Get channel to post mission
    const channelID =
        config.missionChannelIDS[mission.target][
        // eslint-disable-next-line indent
        mission.isPayed ? "payed" : "free"
        ];

    const channel = (await interaction.guild?.channels.fetch(
        channelID,
    )) as TextChannel;

    const oldThread = await channel.threads.fetch(mission.dealThreadID || "");
    const oldMessage = await oldThread?.fetchStarterMessage();
    if (!oldThread || !oldMessage) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Le la mission d'origine est introuvable",
                    color: Colors.Red,
                },
            ],
        });
        return {
            status: "ERROR",
            label: "old mission lost",
        };
    }

    await oldMessage?.delete();

    await postMission(interaction, mission);

    mission.offer = undefined;
    await mission.save();

    await interaction.channel?.delete();

    return {
        status: "OK",
        label: "succès",
    };
}
