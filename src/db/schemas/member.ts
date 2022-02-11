import { Document, model, Schema, Types } from "mongoose";

interface IDBMember {
    discordID: string;
    guildID: string;
    username: string;
    invites: number;
    roleTicketPending: boolean;
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
    roleTicketPending: { type: Boolean, default: false, required: false },
});

export const DBMember = model<IDBMember>("member", schema);
