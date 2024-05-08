import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { UserService } from "../services/User.Service";
import { interfaces, controller, httpGet, httpPost, httpDelete, request, queryParam, response, requestParam } from "inversify-express-utils";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import verifyToken from '../middleware/userMiddleware'


@controller("/users")
export class userController {
    constructor(@inject('UserService') private userService: UserService) { }

    @httpPost('/signup')
    async createUser(req: Request, res: Response): Promise<void> {
        try {

            const { username, password,email,role } = req.body;
            await this.userService.createUser(username, password,email,role);
            res.status(200).send("User Created Successfully");
        }
        catch (error) {
            console.log('Error while signUp');
            res.status(500).json({ message: error })

        }
    }

    @httpPost("/login")
    async loginUser(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const user: any = await this.userService.getUserByUsername(username);
            console.log("userdata",user);
            

            if (!user) {
                res.status(401).json({ error: 'Authentication failed' });
                return
            }

            const passwordMatch = await bcrypt.compare(password, user.password)

            if (!passwordMatch) {
                res.status(401).json({ error: 'Authentication failed' });
                return
            }

            const payload = {
                userId: user._id,
                role: user.role // Assuming user.role contains the role of the user
            };
            // const token = jwt.sign({ userId: user._id }, 'KP', { expiresIn: '1h' })
            const token = jwt.sign(payload, 'KP', { expiresIn: '1h' })
            if (user.role === 'author') {
                res.status(403).json({ error: 'Forbidden' }); 
                return;
            }
            res.status(200).json({ token })
        }
        catch (error) {
            console.error("Error logging in");
            res.status(500).json({ message: error })
        }
    }

    @httpPost("/authorLogin")
    async authorLogin(req: Request, res: Response): Promise<void> {
        try {
            const { username, password } = req.body;
            const author: any = await this.userService.getUserByUsername(username);

            if (!author) {
                res.status(401).json({ error: 'Authentication failed' });
                return;
            }

            const passwordMatch = await bcrypt.compare(password, author.password);

            if (!passwordMatch) {
                res.status(401).json({ error: 'Authentication failed' });
                return;
            }

            if (author.role !== 'author') {
                res.status(403).json({ error: 'Forbidden' });
                return;
            }

            const payload = {
                userId: author._id,
                role: author.role
            }

            const token = jwt.sign(payload, 'KP', { expiresIn: '1h' });
            res.status(200).json({ token });
        }
        catch (error) {
            console.error("Error author login");
            res.status(500).json({ message: error });
        }
    }


    @httpGet('/',verifyToken)
    async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            console.error("Error retrieving users:", error);
            res.status(500).send('Failed to retrieve users');
        }
    }

}



