import { Document, model, Schema, Types } from "mongoose";
import { IMission } from "../../types/missions";

export type Mission = Document<any, any, IMission> &
    IMission & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IMission>({
    accepted: { type: Boolean, required: true },
    isPayed: { type: Boolean, required: true },
    price: { type: String, required: false },
    task: { type: String, required: true },
    target: { type: String, required: true },
    difficulty: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "member" },
    authorUserID: { type: String, required: true },
    authorGuildID: { type: String, required: true },
});

export const Mission = model<IMission>("mission", schema);