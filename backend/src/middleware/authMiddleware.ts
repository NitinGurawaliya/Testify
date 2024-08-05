import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: number;
}


export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

    if (!token) {
        return res.status(403).json({ msg: 'Not authorized' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        req.userId = user.id; // Attach userId to req
        next();
    } catch (err) {
        return res.status(403).json({ msg: 'Not authorized' });
    }
};



export const adminMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.header('authorization') || '';
    const token = authHeader.split(' ')[1]; // Assumes 'Bearer <token>'

    if (!token) {
        return res.status(403).json({
            msg: 'Not authorized'
        });
    }

    try {
        const admin = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload & { id: number };
        // Attach adminId to req.user or req.admin for clarity
        req.adminId = admin.id; // Ensure you add this in the Request interface
        next();
    } catch (err) {
        return res.status(403).json({
            msg: 'Not authorized'
        });
    }
};