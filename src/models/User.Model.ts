import mongoose from 'mongoose';

export interface IUser {
    _id?: mongoose.Schema.Types.ObjectId;
    username: string;
    password: string;
    email: string;
    role :string;
}

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    role: { type: String, enum: ['user', 'author'], default: 'user' }
}, {
    timestamps: true,
});

export const UserModel = mongoose.model<IUser>('User', userSchema);
