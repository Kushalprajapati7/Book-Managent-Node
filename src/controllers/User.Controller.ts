import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { UserService } from "../services/User.Service";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam } from "inversify-express-utils";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/userMiddleware'
import { Err_CODES, Err_MESSAGES } from "../config/error";
import { JwtUtils } from "../utils/jwtUtils";
import { TYPES } from "../types/types";


@controller("/users")
export class userController {
    constructor(@inject(TYPES.UserService) private userService: UserService) { }

    @httpPost('/signup')
    async createUser(req: Request, res: Response): Promise<void> {
        try {

            const { username, password,email,role } = req.body;
            await this.userService.createUser(username, password,email,role);
            res.status(Err_CODES.CREATED).send(Err_MESSAGES.UserCreate);
        }
        catch (error) {
            console.log('Error while signUp',error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json({ message: error })

        }
    }

    @httpPost("/login")
    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const user: any = await this.userService.getUserByUsername(username);

            if (!user) {
                res.status(Err_CODES.UNAUTHORIZED).json({ error: Err_MESSAGES.InvalidUserName  });
                return
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                res.status(Err_CODES.UNAUTHORIZED).json({ error:Err_MESSAGES.InvalidPassword  });
                return
            }
            // const token = jwt.sign({ userId: user._id }, 'KP', { expiresIn: '1h' })
            const token = JwtUtils.generateToken(user._id);
            if (user.role === 'author') {
                res.status(Err_CODES.Forbidden).json({ error: Err_MESSAGES.Forbidden });
                return;
            }
            res.status(Err_CODES.SUCCESSED).json({ token })
        }
        catch (error:any) {
            console.error("Error logging in");
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message })
        }
    }

    @httpPost("/authorLogin")
    async authorLogin(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const author: any = await this.userService.getUserByUsername(username);

            if (!author) {
                res.status(Err_CODES.UNAUTHORIZED).json({ error: Err_MESSAGES.InvalidAuthorName });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, author.password);

            if (!passwordMatch) {
                res.status(Err_CODES.UNAUTHORIZED).json({ error: Err_MESSAGES.InvalidPassword });
                return;
            }

            if (author.role !== 'author') {
                res.status(Err_CODES.Forbidden).json({ error: Err_MESSAGES.Forbidden });
                return;
            }

            // const token = jwt.sign({ userId: author._id }, 'KP', { expiresIn: '1h' });
            const token = JwtUtils.generateToken(author._id);
            res.status(Err_CODES.SUCCESSED).json({ token });
        }
        catch (error) {
            
            console.error("Error author login");
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).json({ message: error.message })

        }
    }


    @httpGet('/',verifyToken)
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(Err_CODES.SUCCESSED).json(users);
        } catch (error) {
            console.error("Error retrieving users:", error);
            res.status(Err_CODES.INTERNAL_SERVER_ERROR).send('Failed to retrieve users');
        }
    }

}


