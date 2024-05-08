import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { autherService } from "../services/Auther.Service";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import CustomRequest from "../types/customRequest";
import { Err_CODES, Err_MESSAGES } from "../config/error";
import verifyToken from "../middleware/userMiddleware";

@controller("/auther")
export class autherController {
    constructor(@inject('autherService') private AutherService: autherService) { }

    @httpPost('/add', verifyToken)
    async addAuther(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { name, biography, nationality } = req.body;
            const newAuther = await this.AutherService.createAuther(name, biography, nationality);
            res.status(Err_CODES.SUCCESSED).json(newAuther)
        }
        catch (error) {
            console.log("Error while Adding new auther", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpPut('/update/:id', verifyToken)
    async updateAuther(req: CustomRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const author = await this.AutherService.findAuthorById(id);
            if(!author){
                res.status(Err_CODES.NOT_FOUND).json(Err_MESSAGES.NOT_FOUND)
                return
            }
            const { name, biography, nationality } = req.body;
            const updatedAuther = await this.AutherService.updateAuther(id, name, biography, nationality);
            res.status(Err_CODES.SUCCESSED).json(updatedAuther)
        }
        catch (error) {
            console.log("Error while Updating auther", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }


    @httpDelete('/remove/:id', verifyToken)
    async deleteAuther(req: CustomRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            // const {name,biography,nationality} =req.body;
            const author = await this.AutherService.findAuthorById(id);
            if(!author){
                res.status(Err_CODES.BAD_REQUEST).json(Err_MESSAGES.BAD_REQUEST)
                return
            }
            const deleteAuther = await this.AutherService.deleteAuther(id);
            res.status(Err_CODES.SUCCESSED).json(Err_MESSAGES.SUCCESSED)
        }
        catch (error) {
            console.log("Error while Deleting auther", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet('/', verifyToken)
    async getAllAuther(req: CustomRequest, res: Response): Promise<void> {
        try {
            // const id = req.params.id;
            // const {name,biography,nationality} =req.body;
            const allAuther = await this.AutherService.getAllAuther();
            res.status(Err_CODES.SUCCESSED).json(allAuther)
        }
        catch (error) {
            console.log("Error while Showing all auther", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet('/Pagination', verifyToken)
    async getAllAuthors(req: CustomRequest, res: Response): Promise<void> {
        try {
            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            // console.log(page);

            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            // console.log(limit);

            const allAuthors = await this.AutherService.getAllAuthorsPaginated(page, limit);
            res.status(Err_CODES.SUCCESSED).json(allAuthors);
        } catch (error) {
            console.log("Error while retrieving authors", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }

    @httpGet('/search', verifyToken)
    async searchAuthors(req: CustomRequest, res: Response): Promise<void> {
        try {
            const query = req.query.q as string;
            // console.log(query);
            
            const searchResults = await this.AutherService.searchAuthors(query);
            res.status(Err_CODES.SUCCESSED).json(searchResults);
        } catch (error) {
            console.log("Error while searching authors", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }

    @httpGet('/filter', verifyToken)
    async filterAuthors(req: CustomRequest, res: Response): Promise<void> {
        try {
            const nationality = req.query.nationality as string;
            const filteredAuthors = await this.AutherService.filterAuthorsByNationality(nationality);
            res.status(Err_CODES.SUCCESSED).json(filteredAuthors);
        } catch (error) {
            console.log("Error while filtering authors", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }

    @httpGet('/bynatinality', verifyToken)
    async getTotalAuthorsByNationality(req:CustomRequest, res:Response):Promise<void>{
        try{
            const authors = await this.AutherService.getTotalAuthorsByNationality();
            console.log(authors);
            res.status(Err_CODES.SUCCESSED).json(authors);
            
        }
        catch (error) {
            console.log("Error while filtering authors", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }

    }
}