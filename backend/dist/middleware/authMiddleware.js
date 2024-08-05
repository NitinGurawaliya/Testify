"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header('authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!token) {
        return res.status(403).json({ msg: 'Not authorized' });
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.userId = user.id; // Attach userId to req
        next();
    }
    catch (err) {
        return res.status(403).json({ msg: 'Not authorized' });
    }
});
exports.userMiddleware = userMiddleware;
const adminMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.header('authorization') || '';
    const token = authHeader.split(' ')[1]; // Assumes 'Bearer <token>'
    if (!token) {
        return res.status(403).json({
            msg: 'Not authorized'
        });
    }
    try {
        const admin = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Attach adminId to req.user or req.admin for clarity
        req.adminId = admin.id; // Ensure you add this in the Request interface
        next();
    }
    catch (err) {
        return res.status(403).json({
            msg: 'Not authorized'
        });
    }
});
exports.adminMiddleware = adminMiddleware;
