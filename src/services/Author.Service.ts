import { inject, injectable } from "inversify";
import { authorModel, Iauthor } from "../models/Auther.Model";
import "reflect-metadata"

@injectable()
export class authorService {
    async createauthor(name: string, biography: string, nationality: string): Promise<Iauthor> {
        const newauthor = await authorModel.create({ name, biography, nationality })
        return newauthor;
    }

    async updateauthor(id: string, name: string, biography: string, nationality: string): Promise<Iauthor> {
        const updatedauthor = await authorModel.findByIdAndUpdate(id, { name, biography, nationality }, { new: true })
        return updatedauthor;
    }

    async getAllauthor(): Promise<Iauthor[]> {
        const allauthor = await authorModel.find()
        return allauthor;
    }

    async deleteauthor(id: string): Promise<void> {
        const author = await authorModel.findByIdAndDelete(id);
        // return profile;
    }
    async getAllAuthorsPaginated(page: number, limit: number): Promise<Iauthor[]> {
        const skip = (page - 1) * limit;

        const pipe = [
            [
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ]
        ] as any[];
        // const allAuthors = await authorModel.find().skip(skip).limit(limit);
        const allAuthors = await authorModel.aggregate(pipe);
        return allAuthors;
    }

    async searchAuthors(query: string): Promise<Iauthor[]> {
        // const searchResults = await authorModel.find({
        //     $or: [
        //         { name: { $regex: query, $options: 'i' } },
        //         { biography: { $regex: query, $options: 'i' } },
        //         { nationality: { $regex: query, $options: 'i' } }
        //     ]
        // });
        const pipe = [
            {
                $match: {
                    $or: [
                        { name: { $regex: query, $options: "i" } },
                        { biography: { $regex: query, $options: "i" } },
                        { nationality: { $regex: query, $options: "i" } }
                    ]
                }
            }
        ];

        const searchResults = await authorModel.aggregate(pipe);
        return searchResults;
    }

    async filterAuthorsByNationality(nationality: string): Promise<Iauthor[]> {
        // const filteredAuthors = await authorModel.find({ nationality });
        // return filteredAuthors;

        const pipeline = [
            {
                $match: {
                    nationality: nationality
                }
            }
        ];

        // console.log("Aggregation Pipeline:", pipeline);

        const result = await authorModel.aggregate(pipeline);

        // console.log("Filtered Authors:", result);

        return result;
    }

    async findAuthorById(id: string): Promise<Iauthor> {
        // console.log("findbyIdfun");
        const author = await authorModel.findById(id);
        return author
    }

    async getTotalAuthorsByNationality(nationality: string): Promise<any[]> {
        const aggregationPipeline = [
            {
                $match: {
                    nationality: nationality
                }
            },
            {

                $group: {
                    _id: "$nationality",
                    totalAuthors: { $sum: 1 }
                }
            }
        ] as any[];

        const result = await authorModel.aggregate(aggregationPipeline);
        return result;
    }


}