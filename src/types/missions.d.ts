import { ObjectId } from "mongoose";

export type Dev = "web-dev" | "artist" | "dev";
export type Difficulty = "1" | "2" | "3" | "4" | "5";

export interface IMission {
    accepted: boolean;
    isPayed: boolean;
    price?: string;
    task: string;
    target: Dev;
    difficulty: Difficulty;
    author?: ObjectId;
    authorUserID: string;
    authorGuildID: string;
}
