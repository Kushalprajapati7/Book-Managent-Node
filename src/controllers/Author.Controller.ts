import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { authorService } from "../services/Author.Service";
import { controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import CustomRequest from "../types/customRequest";
import { Err_CODES, Err_MESSAGES } from "../config/error";
import verifyToken from "../middleware/userMiddleware";
import { TYPES } from "../types/types";

@controller("/author")
export class authorController {
    constructor(@inject(TYPES.AuthorService) private authorService: authorService) { }

    @httpPost('/add', verifyToken)
    async addauthor(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { name, biography, nationality } = req.body;
            const newauthor = await this.authorService.createauthor(name, biography, nationality);
            res.status(Err_CODES.SUCCESSED).json(newauthor)
        }
        catch (error) {
            console.log("Error while Adding new author", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpPut('/update/:id', verifyToken)
    async updateauthor(req: CustomRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            const author = await this.authorService.findAuthorById(id);
            if(!author){
                res.status(Err_CODES.NOT_FOUND).json(Err_MESSAGES.NOT_FOUND)
                return
            }
            const { name, biography, nationality } = req.body;
            const updatedauthor = await this.authorService.updateauthor(id, name, biography, nationality);
            res.status(Err_CODES.SUCCESSED).json(updatedauthor)
        }
        catch (error) {
            console.log("Error while Updating author", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }


    @httpDelete('/remove/:id', verifyToken)
    async deleteauthor(req: CustomRequest, res: Response): Promise<void> {
        try {
            const id = req.params.id;
            // const {name,biography,nationality} =req.body;
            const author = await this.authorService.findAuthorById(id);
            if(!author){
                res.status(Err_CODES.BAD_REQUEST).json(Err_MESSAGES.BAD_REQUEST)
                return
            }
            const deleteauthor = await this.authorService.deleteauthor(id);
            res.status(Err_CODES.SUCCESSED).json(Err_MESSAGES.SUCCESSED)
        }
        catch (error) { 
            console.log("Error while Deleting author", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet('/', verifyToken)
    async getAllauthor(req: CustomRequest, res: Response): Promise<void> {
        try {
            // const id = req.params.id;
            // const {name,biography,nationality} =req.body;
            const allauthor = await this.authorService.getAllauthor();
            res.status(Err_CODES.SUCCESSED).json(allauthor)
        }
        catch (error) {
            console.log("Error while Showing all author", error);
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

            const allAuthors = await this.authorService.getAllAuthorsPaginated(page, limit);
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
            
            const searchResults = await this.authorService.searchAuthors(query);
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
            // console.log(nationality);
            
            const filteredAuthors = await this.authorService.filterAuthorsByNationality(nationality);
            // console.log("filteredAuthors0",filteredAuthors);
            
            res.status(Err_CODES.SUCCESSED).json(filteredAuthors);
        } catch (error) {
            console.log("Error while filtering authors", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }

    @httpGet('/bynatinality', verifyToken)
    async getTotalAuthorsByNationality(req:CustomRequest, res:Response):Promise<void>{
        try{
            const nationality:any = req.query.nationality;
            // console.log(    );
            
            const authors = await this.authorService.getTotalAuthorsByNationality(nationality);
            // console.log(authors);
            res.status(Err_CODES.SUCCESSED).json(authors);
            
        }
        catch (error) {
            console.log("Error while filtering authors", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }

    }
}