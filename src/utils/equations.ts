import { GuildMember } from "discord.js";

export const ratingPoints = (rating: number) => 35 * rating - 60;
export const messagePoints = () => 0.75;
export const bumpPoints = (member: GuildMember) =>
    member.id == "778182909119037441" ? 5 : 10;
export const invitePoints = () => 15;
