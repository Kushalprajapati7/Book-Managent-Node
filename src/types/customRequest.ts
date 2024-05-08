import { Request } from "express";


interface CustomRequest extends Request {
    userId?: string;
    authorId? :string;
    role?: string;
}

export default CustomRequest;
