import { inject, injectable } from "inversify";
import "reflect-metadata"
import { CategoryModel, ICategory } from "../models/Category.Model";

@injectable()
export class categoryService {
    async createCategory(name: string, description: string): Promise<ICategory> {
        const newCategory = await CategoryModel.create({ name, description })
        return newCategory;
    }

    async updateCategory(id: string, name: string, description: string): Promise<ICategory> {
        const updatedCategory = await CategoryModel.findByIdAndUpdate(id, { name, description }, { new: true })
        return updatedCategory;
    }

    async getAllCategory(): Promise<ICategory[]> {
        const allCategory = await CategoryModel.find()
        return allCategory;
    }

    async deleteCategory(id: string): Promise<void> {
        const Category = await CategoryModel.findByIdAndDelete(id);
        // return profile;
    }

    async getAllCategoryPaginated(page: number, limit: number): Promise<ICategory[]> {
        const skip = (page - 1) * limit;

        // const allCategory = await CategoryModel.find().skip(skip).limit(limit);
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
        const allCategory = await CategoryModel.aggregate(pipe)
        return allCategory
    }

    async searchCategory(query: string): Promise<ICategory[]> {
        // const searchResult = await CategoryModel.find({
        //     $or: [
        //         {
        //             name: {$regex:query,$options:'i'}
        //         }
        //     ]
        // });
        const pipe = [
            {
                $match: {
                    $or: [
                        {
                            name: { $regex: query, $options: "i" }
                        }
                    ]
                }
            }
        ];

        const searchResult = await CategoryModel.aggregate(pipe);

        return searchResult;
    }

    async filterCategoryByName(name: string): Promise<ICategory[]> {
        // const filteredCategory = await CategoryModel.find({name });
        const pipe = [
            {
                $match: {
                    name: name
                }
            }
        ];
        const filteredCategory = await CategoryModel.aggregate(pipe);
        return filteredCategory
    }

    async getCategoryById(id: string): Promise<ICategory> {
        const category = await CategoryModel.findById(id);
        return category
    }
}
