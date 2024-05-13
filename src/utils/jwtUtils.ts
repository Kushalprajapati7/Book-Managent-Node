//Jwt Utills
import jwt  from "jsonwebtoken";
import * as env from 'dotenv'
env.config()
// const secretKey = 'KP';

export class JwtUtils {
    // private static secretKey: string = 'KP';
    private static secretKey = process.env.secretKey;
    
    
    static generateToken(userId: string): string {
        return jwt.sign({ userId }, this.secretKey, { expiresIn: '1h' });
    }
    
    static verifyToken(token: string): string | object {
        try {
            const decoded = jwt.verify(token, this.secretKey);
            return decoded;
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
    
}