import mongoose from "mongoose";

export interface ICategory {
    _id? : mongoose.Schema.Types.ObjectId;
    name:string;
    description : string;
}

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
},{
    timestamps:true
})

export const CategoryModel = mongoose.model<ICategory>('Category',categorySchema)