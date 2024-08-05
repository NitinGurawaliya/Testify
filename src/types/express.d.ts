import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            adminId?: number; // Use this if you attach adminId to req
            userId?:number;
        }
    }
}
