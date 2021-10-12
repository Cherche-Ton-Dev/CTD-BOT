import { GuildMember, User } from "discord.js";
import { Mission } from "../db/schemas/mission";
import { context } from "../context/context";
import { Dev, IMission } from "../types/missions";
import { createOrGetMember } from "../db/api/member";

export async function validateMission(
    rawMission: IMission,
    member: GuildMember,
) {
    const author = await createOrGetMember(member, true);

    rawMission.author = author._id;

    const newMission = new Mission(rawMission);
    await newMission.save();
}
