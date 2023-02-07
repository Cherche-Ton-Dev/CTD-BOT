import { Client, CommandInteraction, GuildMember, Modal } from "discord.js";
import { PartialApplicationCommand, CommandReturn } from "$types/commands";
import { Mission } from "$db/schemas/mission";
import { generateMeanEmbed } from "$utils/embeds/mean";
import { generateOfferEmbed } from "$utils/embeds/offer";
import { getRatings } from "$db/api/rating";
import { config } from "$context/config";

export const subCommand = false;
export const data: PartialApplicationCommand = {
    name: "offer",
    description: "Soumets une offre au créateur d'une mission.",
    options: [],
};

export async function run(
    client: Client,
    interaction: CommandInteraction,
): Promise<CommandReturn> {
    const channel = interaction.channel;
    if (!interaction.member || !(interaction.member instanceof GuildMember))
        return {
            status: "IGNORE",
        };
    if (!channel?.isThread()) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Tu ne peux pas utiliser cette commande ici",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "not in a thread",
        };
    }

    const mission = await Mission.findOne({
        dealThreadID: channel.id,
    });

    if (!mission) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: "Tu ne peux pas utiliser cette commande ici",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "not in a deal thread",
        };
    }

    // Check if deal is not made by the mission author
    if (interaction.user.id == mission.authorUserID) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description:
                        "Tu ne peux pas créer d'offre, c'est au dev ou graphiste de le faire.",
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "offer from author",
        };
    }

    // Check if the dealer has the required role
    const requiredRole = config.devRoles.find(
        (role) => role.value === mission.target,
    );

    if (
        !(interaction.member as GuildMember).roles.cache.some(
            (role) => role.id === requiredRole?.roleID,
        )
    ) {
        interaction.reply({
            embeds: [
                {
                    title: "Erreur",
                    description: `Tu n'as pas le role ${requiredRole?.label}`,
                    color: "RED",
                },
            ],
            ephemeral: true,
        });
        return {
            status: "ERROR",
            label: "missing role for offer",
        };
    }

    const modal = new Modal({
        title: "Création de deal",
        components: [],
        customId: "offer-{" + mission.id + "}",
    });

    modal.addComponents(
        {
            type: "ACTION_ROW",
            components: [
                {
                    label: "Récompense",
                    value: mission.price,
                    custom_id: "price",
                    type: "TEXT_INPUT",
                    required: false,
                    style: "SHORT",
                },
            ],
        },
        {
            type: "ACTION_ROW",
            components: [
                {
                    label: "Délai",
                    custom_id: "delay",
                    type: "TEXT_INPUT",
                    required: false,
                    placeholder: "ex: 2 semaines, le 10/08/2021",
                    style: "SHORT",
                },
            ],
        },
        {
            type: "ACTION_ROW",
            components: [
                {
                    label: "Détails supplémentaires",
                    custom_id: "info",
                    type: "TEXT_INPUT",
                    required: false,
                    placeholder:
                        "Codé en javascript\nMoitié payée avant\n200 de tes pts de contribution",
                    style: "PARAGRAPH",
                },
            ],
        },
    );

    // if (mission.isPayed) {
    //     modal.addComponents({
    //         type: "ACTION_ROW",
    //         components: [
    //             {
    //                 type: "SELECT_MENU",
    //                 label: "Type de payment",
    //                 customId: "payment-type",
    //                 placeholder: "Type de payement",
    //                 options: [
    //                     {
    //                         emoji: "🔐",
    //                         label: "Middleman CTD",
    //                         value: "middleman",
    //                         description:
    //                             "CTD s'occupe de gérer l'argent pour éviter les arnaques",
    //                         default: true,
    //                     },
    //                     {
    //                         emoji: "🥷",
    //                         label: "Payment particulier",
    //                         value: "custom",
    //                         description:
    //                             "Vous vous débrouillez pour le payment, risque d'arnaque.",
    //                     },
    //                 ],
    //             } as MessageSelectMenuOptions,
    //         ],
    //     });
    // }

    await interaction.showModal(modal);

    const submit = await interaction.awaitModalSubmit({
        time: 1000 * 60 * 15,
        filter: (inter) => inter.customId == "offer-{" + mission.id + "}",
    });

    const price = submit.fields.getTextInputValue("price");
    const delay = submit.fields.getTextInputValue("delay");
    const info = submit.fields.getTextInputValue("info");

    const ratings = await getRatings(interaction.member);
    const meanEmbed = generateMeanEmbed(interaction.member, ratings);
    const offerEmbed = generateOfferEmbed(
        {
            delay,
            price,
            info,
            devDiscordID: interaction.member.id,
        },
        interaction.member,
    );

    submit.reply({
        content: `Nouvelle offre de ${interaction.member}`,
        embeds: [meanEmbed, offerEmbed],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        label: "Accepter",
                        emoji: "✅",
                        style: "SUCCESS",
                        customId: "event-accept-offer",
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
