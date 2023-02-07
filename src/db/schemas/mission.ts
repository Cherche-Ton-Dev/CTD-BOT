import { Document, model, Schema, Types } from "mongoose";
import { IMission, IOffer } from "$types/missions";

export type Mission = Document<unknown, unknown, IMission> &
    IMission & {
        _id: Types.ObjectId;
    };
export type Offer = Document<unknown, unknown, IOffer> &
    IOffer & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IMission>({
    accepted: { type: Boolean, required: true },
    // acceptedBy: { type: String, required: false },
    offer: {
        price: { type: String, required: false },
        delay: { type: String, required: false },
        info: { type: String, required: false },
        devDiscordID: { type: String, required: false },
        // type: "middleman" | "custom";
    },
    channel: { type: String, required: false },
    isPayed: { type: Boolean, required: true },
    price: { type: String, required: false },
    task: { type: String, required: true },
    target: { type: String, required: true },
    difficulty: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "member" },
    authorUserID: { type: String, required: true },
    authorGuildID: { type: String, required: true },
    finished: { type: Boolean, default: false },
    dealThreadID: { type: String, required: false },
});

export const Mission = model<IMission>("mission", schema);
