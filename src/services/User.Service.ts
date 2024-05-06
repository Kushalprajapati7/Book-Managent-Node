import { inject, injectable } from "inversify";
import { UserModel } from "../models/User.Model";
import bcrypt from 'bcrypt'
import "reflect-metadata"
import jwt from 'jsonwebtoken'

@injectable()
export class UserService {
    async createUser(username: string, password: string, email: string, role: string): Promise<void> {
        const hashedPass = await bcrypt.hash(password, 10);
        await UserModel.create({ username, password: hashedPass, email, role });
    }

    async loginUser(username:string, password:string):Promise<any>{
        const user = await UserModel.findOne({ username, role: 'user' });
        if (!user) {
            throw new Error("User not found");
        }
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            throw new Error("Invalid password");
        }
        const token = jwt.sign({ userId: user._id }, 'KP', { expiresIn: '1h' })

        return token;
    }

    async loginAuthor(username: string, password: string): Promise<string> {
        const author = await UserModel.findOne({ username, role: 'author' }); 
        if (!author) {
            throw new Error("Author not found");
        }

        const passwordMatch = await bcrypt.compare(password, author.password);
        if (!passwordMatch) {
            throw new Error("Invalid password");
        }

        const token = jwt.sign({ userId: author._id }, 'KP', { expiresIn: '1h' });
        return token;
    }

    async getUserByUsername(username: string): Promise<any> {
        const user = await UserModel.findOne({ username });
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    }

    async getAllUsers(): Promise<any[]> {
        const users = await UserModel.find({});
        return users;
    }
}

