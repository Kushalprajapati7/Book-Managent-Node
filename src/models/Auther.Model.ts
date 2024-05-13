import mongoose from "mongoose";

export interface Iauthor{
    _id? : mongoose.Schema.Types.ObjectId;
    name: string;
    biography: string;
    nationality: string;
}

const authorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String, required: true },
    nationality: { type: String, required: true }
},{
    timestamps:true
});

export const authorModel = mongoose.model<Iauthor>('author',authorSchema);  