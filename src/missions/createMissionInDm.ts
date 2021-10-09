import { DMChannel } from "discord.js";

import { askYesNo, askText, askSelectOne } from "../utils/questions/index";
import { config } from "../context/config";
import { Dev, IMission } from "../types/missions";
import { generateMissionEmbed } from "../missions/generateEmbed";
import chalk from "chalk";
import { log } from "../utils/log";

export const subCommand = false;

const timeout = 1000 * 60 * 5; // 5 min

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
    else
        DM.send(
            "Ta mission a été envoyée elle sera disponible après avoir été vérifiée par les modérateurs",
        );
}

async function cancelMission(DM: DMChannel) {
    log(
        "Aucune donnée entrée pendant 5m, annulation de la mission de",
        chalk.blue(DM.recipient.tag),
    );
    DM.send("Trop lent, annulation de la mission.");
    return null;
}
