import { Request, Response, NextFunction } from "express";
import CustomRequest from "../types/customRequest";
import jwt from 'jsonwebtoken';

async function verifyAuthor(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, 'KP') as { userId: string, role: string };
        req.userId = decoded.userId;
        req.role = decoded.role;

        // console.log(req.userId,req.role);

        if (req.role !== 'author') {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.authorId = req.userId;
        console.log(req.authorId);
        

        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

export default verifyAuthor;