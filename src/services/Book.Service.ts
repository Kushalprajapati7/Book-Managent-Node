import { inject, injectable } from "inversify";
import { BookModel, IBook } from "../models/Book.Model";
import "reflect-metadata"

@injectable()
export class bookService {
    async addBook(userId: string, title: string, author: string, category: string, ISBN: string, description: string, price: number): Promise<IBook> {
        const newBook = await BookModel.create({ userId, title, author, category, ISBN, description, price })
        return newBook
    }

    async updateBook(id: string, title: string, author: string, category: string, ISBN: string, description: string, price: number): Promise<IBook> {
        const updatedBook = await BookModel.findByIdAndUpdate(id, { title, author, category, ISBN, description, price }, { new: true })
        return updatedBook
    }

    async deleteBook(id: string): Promise<void> {
        const deletedBook = await BookModel.findByIdAndDelete(id);
    }

    async findBookById(id: string): Promise<IBook> {
        const book = await BookModel.findById(id)
        return book
    }

    async showAllBooks(): Promise<IBook[]> {
        const books = await BookModel.find({})
        return books
    }

    async findBooksByUserId(id: string): Promise<IBook[]> {
        const userBooks = await BookModel.find({ userId: id })
        return userBooks
    }

    async getAllBooksPaginated(id: string, page: number, limit: number): Promise<any[]> {
        // const skip = (page-1)*limit;
        // // const allBooks = await BookModel.find([userId: new Types.ObjectId(userId)]).skip(skip).limit(limit);
        // const allBooks = await BookModel.find({ userId: id }).skip(skip).limit(limit);
        // return allBooks
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

        const result = await BookModel.aggregate(pipe);
        // console.log(result);
        return result;

    }

    // async searchBooks(id: string,query: string): Promise<IBook[]> {
    //     const searchResults = await BookModel.find({
    //         $and: [
    //             { userId: id },
    //             {
    //                 $or: [
    //                     { title: { $regex: query, $options: 'i' } },
    //                     { description: { $regex: query, $options: 'i' } },
    //                     { author: { $regex: query, $options: 'i' } }, 
    //                     { category: { $regex: query, $options: 'i' } } 
    //                 ]
    //             }
    //         ]
    //     });
    //     return searchResults;
    // }

    async searchBooks(id: string, query: string, minPrice?: number, maxPrice?: number): Promise<IBook[]> {
        const pipeline: any[] = [];
        pipeline.push({ $match: { userId: id } });

        if (query) {
            const searchCriteria = {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } },
                    { author: { $regex: query, $options: 'i' } },
                    { category: { $regex: query, $options: 'i' } }
                ]
            };
            pipeline.push({ $match: searchCriteria });
        }

        const priceCriteria: any = {};
        if (minPrice !== undefined && maxPrice !== undefined) {
            priceCriteria.$gte = minPrice;
            priceCriteria.$lte = maxPrice;
        } else if (minPrice !== undefined) {
            priceCriteria.$gte = minPrice;
        } else if (maxPrice !== undefined) {
            priceCriteria.$lte = maxPrice;
        }
        if (Object.keys(priceCriteria).length > 0) {
            pipeline.push({ $match: { price: priceCriteria } });
        }

        const searchResults = await BookModel.aggregate(pipeline);

        return searchResults;
    }


    async filterBooksByCategory(category: string): Promise<any> {

        // const filteredBooks = await BookModel.find({ category });
        // return filteredBooks;

        const pipe =[
            {
                $match:{
                    category: category
                }
            }
        ];

        const result= await BookModel.aggregate(pipe);
        // console.log(result);
        return result;
        

    }


}