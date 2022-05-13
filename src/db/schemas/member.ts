import { Document, model, Schema, Types } from "mongoose";

export interface IDBMember {
    discordID: string;
    guildID: string;
    username: string;
    invites: number;
    invitedBy: string;
    roleTicketPending: boolean;
    contributionPoints: number;
    lastContribFeatured: number;
}
export type DBMember = Document<unknown, unknown, IDBMember> &
    IDBMember & {
        _id: Types.ObjectId;
    };

const schema = new Schema<IDBMember>({
    discordID: { type: String, required: true },
    guildID: { type: String, required: true },
    username: { type: String, required: false },
    invites: { type: Number, default: 0, required: false },
    invitedBy: { type: String, required: false },
    roleTicketPending: { type: Boolean, default: false, required: false },
    contributionPoints: { type: Number, default: 0, required: true },
    lastContribFeatured: { type: Number, default: -1, required: true },
});

export const DBMember = model<IDBMember>("member", schema);
