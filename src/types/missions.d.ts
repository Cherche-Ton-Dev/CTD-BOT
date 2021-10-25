import { Types } from "mongoose";

export type Dev = "web-dev" | "artist" | "dev";
export type Difficulty = "1" | "2" | "3" | "4" | "5";

export interface IMission {
    accepted: boolean;
    acceptedBy?: string;
    channel?: string;
    isPayed: boolean;
    price?: string;
    task: string;
    target: Dev;
    difficulty: Difficulty;
    author?: Types.ObjectId;
    authorUserID: string;
    authorGuildID: string;
}
