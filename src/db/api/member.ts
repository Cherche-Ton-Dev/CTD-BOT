import { GuildMember } from "discord.js";
import { featureContrib } from "../../utils/contrib";
import { DBMember } from "../schemas/member";

export async function getMember(member: GuildMember): Promise<DBMember | null> {
    return await DBMember.findOne({
        discordID: member.id,
        guildID: member.guild.id,
    });
}
export function createMember(member: GuildMember): DBMember {
    return new DBMember({
        discordID: member.id,
        guildID: member.guild.id,
        username: member.user.username,
    });
}
export async function createOrGetMember(
    member: GuildMember,
    save = false,
): Promise<DBMember> {
    let dbMember = await getMember(member);
    if (!dbMember) {
        dbMember = createMember(member);
        if (save) await dbMember.save();
    }
    return dbMember;
}
export async function addInvite(member: GuildMember) {
    let target = await getMember(member);
    if (!target) {
        target = createMember(member);
    }
    target.invites++;
    await target.save();
}
export async function removeInvite(member: GuildMember) {
    let target = await getMember(member);
    if (!target) {
        target = new DBMember({
            discordID: member.id,
            username: member.user.username,
        });
    }
    target.invites--;
    await target.save();
}

export async function addPoints(member: GuildMember, points: number) {
    let dbMem = await DBMember.findOneAndUpdate(
        { discordID: member.id, guildID: member.guild.id },
        { $inc: { contributionPoints: points } },
        { new: true },
    );

    if (!dbMem) {
        dbMem = createMember(member);
        dbMem.contributionPoints = points;
        await dbMem.save();
    }

    const contrib_steps = [
        100, 300, 500, 700, 1000, 1500, 2000, 2500, 3000, 3500,
    ].reverse();
    for (const step of contrib_steps) {
        if (
            dbMem.contributionPoints > step &&
            dbMem.lastContribFeatured < step
        ) {
            dbMem.lastContribFeatured = step;
            featureContrib(dbMem);
        }
    }

    return dbMem;
}
