import mongoose, { Schema } from 'mongoose';

export interface IBook {
    _id?: mongoose.Schema.Types.ObjectId;
    userId: mongoose.Schema.Types.ObjectId;
    title: string;
    author: mongoose.Types.ObjectId;
    category: mongoose.Types.ObjectId;
    ISBN : string;
    description : string;
    price : number;
}

const bookSchema = new mongoose.Schema({
    userId: { type: Schema.Types.String, ref: 'User', required: true },
    title: { type: String, required: true },
    author: { type: Schema.Types.String, ref: 'Author', required: true },
    category: {type:Schema.Types.String, ref: 'Category', required: true},
    ISBN: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true }
}, {
    timestamps: true,
});

export const BookModel = mongoose.model<IBook>('Book', bookSchema);
