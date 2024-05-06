import mongoose from "mongoose";

export interface IAuther{
    _id? : mongoose.Schema.Types.ObjectId;
    name: string;
    biography: string;
    nationality: string;
}

const autherSchema = new mongoose.Schema({
    name: { type: String, required: true },
    biography: { type: String, required: true },
    nationality: { type: String, required: true }
},{
    timestamps:true
});

export const AutherModel = mongoose.model<IAuther>('Auther',autherSchema);  