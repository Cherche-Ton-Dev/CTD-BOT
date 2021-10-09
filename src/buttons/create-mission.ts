import chalk from "chalk";
import { ApplicationCommandOptionType } from "discord-api-types";
import {
    ButtonInteraction,
    Client,
    CommandInteraction,
    DMChannel,
    EmbedFieldData,
    Interaction,
    InteractionCollector,
    Message,
    MessageButton,
    MessageEmbed,
    MessageEmbedOptions,
    MessageSelectOption,
    MessageSelectOptionData,
    SelectMenuInteraction,
    User,
} from "discord.js";
import { config } from "../context/config";
import { context } from "../context/context";
import { ApplicationCommand, CommandReturn } from "../types/commands";
import { Dev, IMission, Difficulty } from "../types/missions";
import { log } from "../utils/log";

export const subCommand = false;

const timeout = 1000 * 60 * 5; // 5 min

export async function run(
    client: Client,
    interaction: ButtonInteraction,
): Promise<CommandReturn> {
    const DM = await interaction.user.createDM();
    const sentMessage = await DM.send(
        "** **\n\n\n\n\n\n\n\n\n\n\n\nCreation d'une nouvelle mission.\n❗ Tu as **5 minutes** pour répondre à chaque question ❗",
    );
    createMission(DM); // not awaited: will run separated
    await interaction.reply({
        embeds: [
            {
                title: "Nouvelle Mission",
                description:
                    "Rdv dans tes messages privées pour me donner les informations sur ta mission.",
                color: "GREEN",
                thumbnail: { url: client.user?.avatarURL() || "" },
                url: sentMessage.url,
            },
        ],
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        style: "LINK",
                        label: "Messages Privées",
                        url: sentMessage.url,
                    },
                ],
            },
        ],
        ephemeral: true,
    });

    return {
        status: "OK",
        label: "succès",
    };
}

export async function createMission(DM: DMChannel) {
    const mission: IMission = {
        accepted: false,
        difficulty: "1",
        isPayed: false,
        target: "dev",
        task: "",
    };

    let selectedDev = await askSelectOne<Dev>(
        DM,
        "Quel type de dev cherches-tu ?",
        config.devRoles,
    );
    if (selectedDev === null) return;
    mission.target = selectedDev;

    let isPayed = await askYesNo(
        DM,
        "Ta mission est rémunérée avec du vrai argent?",
        "OUI 💰",
        "NON ❌",
    );
    if (isPayed === null) return;
    mission.isPayed = isPayed;

    let price: string | null;
    if (isPayed) {
        price = await askText(DM, "Combien d'argent est tu prêt a donner?");
        if (!price) return;
        mission.price = price;
    } else {
        let hasPrice = await askYesNo(
            DM,
            "Offres tu une récompense autre que de l'argent?",
            "OUI 🎁",
            "NON ❌",
        );
        if (hasPrice === null) return;
        if (hasPrice) {
            price = await askText(DM, "Quel est ta récompense?");
            if (!price) return;
            mission.price = price;
        }
    }
    let task = await askText(DM, "Que veut tu que le dev fasse pour toi?");
    if (!task) return;
    mission.task = task;

    await previewMission(DM, mission);
    const done = await askYesNo(DM, "** **", "Valider", "Annuler la mission");
    if (!done) DM.send("Ta mission a été annulée");
    else
        DM.send(
            "Ta mission a été envoyée elle sera disponible après avoir été vérifiée par les modérateurs",
        );
}

async function askSelectOne<T>(
    DM: DMChannel,
    text: string,
    options: MessageSelectOptionData[],
): Promise<T | null> {
    let sentMessage = await DM.send({
        content: text,
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "SELECT_MENU",
                        customId: "dev-select",
                        options,
                    },
                ],
            },
        ],
    });

    let selectInteraction: SelectMenuInteraction;
    try {
        selectInteraction = await sentMessage.awaitMessageComponent({
            time: timeout,
            componentType: "SELECT_MENU",
        });
        await fakeReply(selectInteraction);
    } catch (error) {
        return cancelMission(sentMessage, DM);
    }

    // let selectedTargetRole = selectInteraction.values[0];
    await disableComponent(sentMessage);
    // await selectInteraction.reply(`tu as choisi ${selectedTargetRole}`);
    return selectInteraction.values[0] as unknown as T | null;
}

async function askYesNo(
    DM: DMChannel,
    text: string,
    labelYes?: string,
    labelNo?: string,
) {
    let sentMessage = await DM.send({
        content: text,
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        style: "SUCCESS",
                        label: labelYes || "OUI",
                        customId: "yes",
                    },
                    {
                        type: "BUTTON",
                        style: "DANGER",
                        label: labelNo || "NON",
                        customId: "no",
                    },
                ],
            },
        ],
    });

    let buttonInteraction: ButtonInteraction;
    try {
        buttonInteraction = await sentMessage.awaitMessageComponent({
            time: timeout, // 2 min
            componentType: "BUTTON",
        });
        await fakeReply(buttonInteraction);
    } catch (error) {
        return cancelMission(sentMessage, DM);
    }
    await disableComponent(sentMessage);
    // await selectInteraction.reply(`tu as choisi ${selectInteraction.customId}`);
    return buttonInteraction.customId === "yes";
}

async function askText(DM: DMChannel, text: string) {
    let sentMessage = await DM.send({
        content: text,
    });

    let value: string;
    try {
        let received = await DM.awaitMessages({
            time: timeout,
            max: 1,
        });
        value = received.first()?.content || "";
    } catch (error) {
        return cancelMission(sentMessage, DM);
    }

    return value;
}

function generateMissionEmbed(
    mission: IMission,
    user: User,
): MessageEmbedOptions {
    const fields: EmbedFieldData[] = [];

    if (mission.price) {
        fields.push({
            name: "**RÉCOMPENSE**",
            value: mission.price,
        });
    }
    fields.push({
        name: "**DIFFICULTÉ**",
        value: mission.difficulty + "/5",
    });

    return {
        author: {
            iconURL: user.avatarURL({ dynamic: true }) || "",
            name: user.username,
        },
        thumbnail: {
            url: "https://emoji.gg/assets/emoji/7169_ThisIsFine.png",
        },
        color: "DARK_BLUE",
        title: "Mission",
        description: mission.task,
        fields,
        timestamp: new Date(),
    };
}

async function previewMission(DM: DMChannel, mission: IMission) {
    return DM.send({
        content: "Est ce que tout est bon?",
        embeds: [generateMissionEmbed(mission, DM.recipient)],
    });
}

async function cancelMission(message: Message, DM: DMChannel) {
    log(
        "Aucune donnée entrée pendant 2m, annulation de la mission de",
        chalk.blue(DM.recipient.tag),
    );
    await disableComponent(message);
    DM.send("Trop lent, annulation de la mission.");
    return null;
}

async function disableComponent(message: Message) {
    const components = message.components;
    components.forEach((row) =>
        row.components.forEach((component) => component.setDisabled(true)),
    );
    message.edit({
        components,
    });
}

async function fakeReply(
    interaction: CommandInteraction | ButtonInteraction | SelectMenuInteraction,
) {
    await interaction.reply("** **");
    // await interaction.deleteReply();
}
