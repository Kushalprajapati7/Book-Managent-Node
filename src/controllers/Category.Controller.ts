import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { categoryService } from "../services/Category.Service";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import CustomRequest from "../types/customRequest";
import { Err_CODES, Err_MESSAGES } from "../config/error";
import verifyToken from "../middleware/userMiddleware";

@controller("/category")
export class categoryController{
    constructor(@inject('categoryService') private CategoryService: categoryService) { }

    @httpPost('/add',verifyToken)
    async addCategory(req: CustomRequest, res: Response): Promise<void> {
        try{
            const {name, description} = req.body;
            const newCategory = await this.CategoryService.createCategory(name,description)
            res.status(Err_CODES.SUCCESSED).json(newCategory)

        }
        catch(error){
            console.log("Error while Adding new Category", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpPut('/update/:id', verifyToken)
    async updateCategory(req: CustomRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const {name, description} = req.body;

            const updatedCategory = await this.CategoryService.updateCategory(id, name, description);
            res.status(Err_CODES.SUCCESSED).json(updatedCategory)
        }
        catch(error){
            console.log("Error while Updating  Category", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpDelete('/remove/:id', verifyToken)
    async deleteCategory(req: CustomRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            // const {name,biography,nationality} =req.body;
            const deleteCategory = await this.CategoryService.deleteCategory(id);
            res.status(Err_CODES.SUCCESSED).json(Err_MESSAGES.SUCCESSED)
        }
        catch (error) {
            console.log("Error while Deleting category", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet('/', verifyToken)
    async getAllCategory(req: CustomRequest, res: Response): Promise<void> {
        try {
            // const id = req.params.id;
            // const {name,biography,nationality} =req.body;
            const allCategory = await this.CategoryService.getAllCategory();
            res.status(Err_CODES.SUCCESSED).json(allCategory)
        }
        catch (error) {
            console.log("Error while Showing all category", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet('/pagination', verifyToken)
    async getAllCategories(req: CustomRequest, res: Response):Promise<void>{
        try{
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            const allCategory = await this.CategoryService.getAllCategoryPaginated(page,limit)
            res.status(Err_CODES.SUCCESSED).json(allCategory);
            
        }
        catch(error){
            console.log("Error while Showing all category", error);

            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)

        }
    }

    @httpGet('/search',verifyToken)
    async searchCategory(req: CustomRequest, res: Response):Promise<void>{
        try{
            const query = req.query.q as string;
            const allCategory = await this.CategoryService.searchCategory(query)
            res.status(Err_CODES.SUCCESSED).json(allCategory);
            
        }
        catch(error){
            console.log("Error while Showing all category", error);

            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)

        }
    }

    @httpGet('/filter',verifyToken)
    async filterCategoryies(req: CustomRequest, res: Response): Promise<void> {
        try {
            const name = req.query.name as string;
            const filteredCategory = await this.CategoryService.filterCategoryByName(name);
            res.status(Err_CODES.SUCCESSED).json(filteredCategory);
        } catch (error) {
            console.log("Error while filtering Category", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }

}   