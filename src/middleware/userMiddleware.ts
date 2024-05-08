import { Request, Response, NextFunction } from "express";
import CustomRequest from "../types/customRequest"; // Adjust the path as per your file structure
import jwt from 'jsonwebtoken'

async function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Access denied' });

    try {
        const decoded = jwt.verify(token, 'KP') as { userId: string };
        // console.log("d",decoded);
        
        req.userId = decoded.userId;
        // console.log(req.userId);
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

export default verifyToken;
