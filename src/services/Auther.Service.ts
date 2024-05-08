import { inject, injectable } from "inversify";
import {AutherModel, IAuther  } from "../models/Auther.Model";
import "reflect-metadata"

@injectable()
export class autherService{
    async createAuther(name:string, biography:string, nationality:string):Promise<IAuther>{
        const newAuther = await AutherModel.create({name,biography,nationality})
        return newAuther;
    }

    async updateAuther(id:string,name:string, biography:string, nationality:string ):Promise<IAuther>{
        const updatedAuther = await AutherModel.findByIdAndUpdate(id,{name,biography,nationality},{new:true})
        return updatedAuther;
    }

    async getAllAuther():Promise<IAuther[]>{
        const allAuther = await AutherModel.find()
        return allAuther;
    }

    async deleteAuther(id:string):Promise<void>{
        const auther = await AutherModel.findByIdAndDelete(id);
        // return profile;
    }
    async getAllAuthorsPaginated(page: number, limit: number): Promise<IAuther[]> {
        const skip = (page - 1) * limit;
        const allAuthors = await AutherModel.find().skip(skip).limit(limit);
        return allAuthors;
    }
    
    async searchAuthors(query: string): Promise<IAuther[]> {
        const searchResults = await AutherModel.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { biography: { $regex: query, $options: 'i' } },
                { nationality: { $regex: query, $options: 'i' } }
            ]
        });
        return searchResults;
    }

    async filterAuthorsByNationality(nationality: string): Promise<IAuther[]> {
        const filteredAuthors = await AutherModel.find({ nationality });
        return filteredAuthors;
    }

    async findAuthorById(id:string):Promise<IAuther>{
        // console.log("findbyIdfun");
        
        const author = await AutherModel.findById(id);
        return author
    }
    
    
}