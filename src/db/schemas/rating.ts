import { Document, model, ObjectId, Schema, Types } from "mongoose";
import { IMission } from "$types/missions";

export interface IRating {
    guildID: string;
    mission: string | ObjectId | IMission;
    dev: string;
    client: string;
    rating: number;
    comment: string;
}
export type Rating = Document<unknown, unknown, IRating> &
    IRating & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IRating>({
    guildID: { type: String, required: true },
    mission: { type: Schema.Types.ObjectId, ref: "mission" },
    dev: { type: String, required: true },
    client: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: false },
});

export const Rating = model<IRating>("rating", schema);
