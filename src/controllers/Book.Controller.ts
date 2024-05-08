import { inject, injectable } from "inversify";
import CustomRequest from "../types/customRequest";
import { Request, Response } from "express";
import verifyToken from "../middleware/userMiddleware";
import { Err_CODES, Err_MESSAGES } from "../config/error";
import { bookService } from "../services/Book.Service";
import { all, controller, httpDelete, httpGet, httpPost, httpPut } from "inversify-express-utils";
import { autherService } from "../services/Auther.Service";
import { categoryService } from "../services/Category.Service";
import verifyAuthor from "../middleware/authorMiddleware";


@controller("/book")
export class bookController {
    constructor(@inject('bookService') private BookService: bookService,
        @inject('autherService') private AuthService: autherService,
        @inject('categoryService') private CategoryService: categoryService
    ) { }


    @httpPost('/add', verifyToken)
    async addBook(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.userId;
            // console.log(userId);
            const { title, author, category, ISBN, description, price } = req.body;
            // console.log(author);
            const bookAuthor = await this.AuthService.findAuthorById(author)
            // console.log("auther",bookAuthor);
            if (!bookAuthor) {
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Author is required" });
                return
            }
            // console.log(bookAuthor.name);
            const bookCategory = await this.CategoryService.getCategoryById(category)
            // console.log("category",bookCategory);

            if (!bookCategory) {
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Invalid category" });
                return
            }
            // console.log(bookCategory.name);
            // console.log(author);
            const newBook = await this.BookService.addBook(userId,title, bookAuthor.name, bookCategory.name, ISBN, description, price)
            res.status(Err_CODES.SUCCESSED).json(newBook)
        }
        catch (error) {
            console.log("Error while Adding new book", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpPost('/addByAuthor', verifyAuthor)
    async addBookByAuthor(req: CustomRequest, res: Response): Promise<void> {
        try {
            const authorId = req.authorId;
            const userId = req.userId;
            console.log(authorId);
            
            // console.log(userId);
            const { title, author, category, ISBN, description, price } = req.body;
            
            // console.log(author);
            const bookAuthor = await this.AuthService.findAuthorById(author)
            // console.log("auther",bookAuthor);
            if (!bookAuthor) {
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Author is required" });
                return
            }
            // console.log(bookAuthor.name);
            const bookCategory = await this.CategoryService.getCategoryById(category)
            // console.log("category",bookCategory);

            if (!bookCategory) {
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Invalid category" });
                return
            }
            // console.log(bookCategory.name);
            // console.log(author);
            const newBook = await this.BookService.addBook(userId,title, bookAuthor.name, bookCategory.name, ISBN, description, price)
            res.status(Err_CODES.SUCCESSED).json(newBook)
        }
        catch (error) {
            console.log("Error while Adding new book", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpPut('/update/:id',verifyToken)
    async updateBook(req:CustomRequest, res:Response):Promise<void>{
        try{
            const id = req.params.id;
            const { title, author, category, ISBN, description, price } = req.body;

            const bookAuthor = await this.AuthService.findAuthorById(author)
            // console.log("auther",bookAuthor);
            if (!bookAuthor) {
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Author is required" });
                return
            }

            // console.log(bookAuthor.name);

            const bookCategory = await this.CategoryService.getCategoryById(category)
            // console.log("category",bookCategory);

            if (!bookCategory) {
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Invalid category" });
                return
            }
            // console.log(bookCategory.name);
            const updatedBook = await this.BookService.updateBook(id,title, bookAuthor.name, bookCategory.name, ISBN, description, price)
            res.status(Err_CODES.SUCCESSED).json(updatedBook)

        }
        catch(error){
            console.log("Error while Updating the book", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpDelete("/remove/:id",verifyToken)
    async deleteBook(req:CustomRequest,res:Response):Promise<void>{
        try{
            const id  = req.params.id;
            const book = await this.BookService.findBookById(id);
            console.log(book);
            
            if(!book){
                res.status(Err_CODES.BAD_REQUEST).json({ message: "Invalid book id" });
                return
            }

            const deletedBook = await this.BookService.deleteBook(id);
            res.status(Err_CODES.SUCCESSED).json(Err_MESSAGES.SUCCESSED)

        }
        catch(error){
            console.log("Error while Deleting Book", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet("/all",verifyToken)
    async showAllBook(req:CustomRequest,res:Response):Promise<void>{
        try{
            // const id  = req.params.id;
            // const book = await this.BookService.findBookById(id);
            // console.log(book);

            const userId = req.userId;
            console.log(userId);
            
            
            if(!userId){
                res.status(Err_CODES.BAD_REQUEST).json({ message: "No Such book found for loggedin user" });
                return
            }

            const allBook = await this.BookService.findBooksByUserId(userId);
            console.log(allBook);
            
            res.status(Err_CODES.SUCCESSED).json(allBook)

        }
        catch(error){
            console.log("Error while Showing books Book", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }

    @httpGet('/Pagination', verifyToken)
    async getBooksByUserPaginated(req: CustomRequest, res: Response): Promise<void> {
        try{
            // const id  = req.params.id;
            // const book = await this.BookService.findBookById(id);
            // console.log(book);

            const userId = req.userId;
            // console.log(userId);

            const page = req.query.page ? parseInt(req.query.page as string) : 1;
            // console.log(page);

            const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
            // console.log(limit);
            
            
            if(!userId){
                res.status(Err_CODES.BAD_REQUEST).json({ message: "No Such book found for loggedin user" });
                return
            }

            const allBook = await this.BookService.getAllBooksPaginated(userId,page,limit);
            console.log(allBook);
            
            res.status(Err_CODES.SUCCESSED).json(allBook)

        }
        catch(error){
            console.log("Error while Showing books Book", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR)
        }
    }
    

    @httpGet("/search",verifyToken)
    async searchBooks(req: CustomRequest, res: Response): Promise<void> {
        try {
            const userId = req.userId; 
            const query = req.query.q as string; 
            // console.log(query);
            
            const searchResults = await this.BookService.searchBooks(userId, query);
            res.status(200).json(searchResults);
        } catch (error) {
            console.error("Error while searching books:", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }

    @httpGet("/filter")
    async filterBooksByCategory(req: CustomRequest, res: Response): Promise<void> {
        try {
            const category = req.query.category as string;
            const filteredBooks = await this.BookService.filterBooksByCategory(category);
            res.status(Err_CODES.SUCCESSED).json(filteredBooks);
        } catch (error) {
            console.error("Error while filtering books by category:", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json(Err_MESSAGES.INTERNAL_SERVER_ERROR);
        }
    }



}