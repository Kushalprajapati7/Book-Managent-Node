import { Request, Response, NextFunction } from "express";
import CustomRequest from "../types/customRequest"; // Adjust the path as per your file structure
import jwt from 'jsonwebtoken'
import { Err_CODES, Err_MESSAGES } from "../config/error";

async function verifyToken(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) return res.status(Err_CODES.UNAUTHORIZED).json({ error: Err_MESSAGES.Token });

    try {
        const decoded = jwt.verify(token, 'KP') as { userId: string };
        // console.log("d",decoded);
        
        req.userId = decoded.userId;
        // console.log(req.userId);
        
        next();
    } catch (error) {
        res.status(Err_CODES.UNAUTHORIZED).json({ error:Err_MESSAGES.TokenExpired});
    }
}

export default verifyToken;
