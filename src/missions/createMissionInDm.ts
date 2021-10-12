import { DMChannel, GuildMember } from "discord.js";

import { askYesNo, askText, askSelectOne } from "../utils/questions/index";
import { config } from "../context/config";
import { Dev, IMission } from "../types/missions";
import { generateMissionEmbed } from "../missions/generateEmbed";
import chalk from "chalk";
import { log } from "../utils/log";
import { validateMission } from "./validateMission";
import { ObjectId } from "mongoose";

export const subCommand = false;

const timeout = 1000 * 60 * 5; // 5 min

export async function createMission(DM: DMChannel, member: GuildMember) {
    const mission: IMission = {
        accepted: false,
        difficulty: "1",
        isPayed: false,
        target: "dev",
        task: "",
        authorGuildID: member.guild.id,
        authorUserID: member.user.id,
    };

    let selectedDev = await askSelectOne<Dev>(
        DM,
        timeout,
        "Quel type de dev cherches-tu ?",
        config.devRoles,
    );
    if (selectedDev === null) return cancelMission(DM);
    mission.target = selectedDev;

    let isPayed = await askYesNo(
        DM,
        timeout,
        "Ta mission est rémunérée avec du vrai argent?",
        "OUI 💰",
        "NON ❌",
    );
    if (isPayed === null) return cancelMission(DM);
    mission.isPayed = isPayed;

    let price: string | null;
    if (isPayed) {
        price = await askText(
            DM,
            timeout,
            "Combien d'argent est tu prêt a donner?",
        );
        if (!price) return cancelMission(DM);
        mission.price = price;
    } else {
        let hasPrice = await askYesNo(
            DM,
            timeout,
            "Offres tu une récompense autre que de l'argent?",
            "OUI 🎁",
            "NON ❌",
        );
        if (hasPrice === null) return cancelMission(DM);
        if (hasPrice) {
            price = await askText(DM, timeout, "Quel est ta récompense?");
            if (!price) return cancelMission(DM);
            mission.price = price;
        }
    }

    let task = await askText(
        DM,
        timeout,
        "Que veut tu que le dev fasse pour toi?",
    );
    if (!task) return cancelMission(DM);
    mission.task = task;

    let difficulty = await askSelectOne<"1" | "2" | "3" | "4" | "5">(
        DM,
        timeout,
        "Quel est la difficulté?",
        [
            {
                label: "1",
                value: "1",
                emoji: "1️⃣",
            },
            {
                label: "2",
                value: "2",
                emoji: "2️⃣",
            },
            {
                label: "3",
                value: "3",
                emoji: "3️⃣",
            },
            {
                label: "4",
                value: "4",
                emoji: "4️⃣",
            },
            {
                label: "5",
                value: "5",
                emoji: "5️⃣",
            },
        ],
    );
    if (!difficulty) return cancelMission(DM);
    mission.difficulty = difficulty;

    await DM.send({
        content: "Est ce que tout est bon?",
        embeds: [generateMissionEmbed(mission, DM.recipient)],
    });

    const done = await askYesNo(
        DM,
        timeout,
        "** **",
        "Valider",
        "Annuler la mission",
    );
    if (!done) DM.send("Ta mission a été annulée");
    else {
        validateMission(mission, member);
        DM.send(
            "Ta mission a été envoyée elle sera disponible après avoir été vérifiée par les modérateurs",
        );
    }
}

async function cancelMission(DM: DMChannel) {
    log(
        "Aucune donnée entrée pendant 5m, annulation de la mission de",
        chalk.blue(DM.recipient.tag),
    );
    DM.send("Trop lent, annulation de la mission.");
    return null;
}
