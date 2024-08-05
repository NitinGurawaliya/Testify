"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateTestSchema = exports.createTestSchema = exports.signinSchema = exports.signupSchema = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    name: zod_1.default.string()
});
exports.signinSchema = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
});
exports.createTestSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    scheduledAt: zod_1.default.string(),
    questions: zod_1.default.array(zod_1.default.object({
        questionText: zod_1.default.string(),
        options: zod_1.default.array(zod_1.default.object({
            optionText: zod_1.default.string(),
            isCorrect: zod_1.default.boolean()
        }))
    }))
});
exports.updateTestSchema = zod_1.default.object({
    title: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    scheduledAt: zod_1.default.string().datetime(),
    // questions:z.array(z.object({
    //     questionText:z.string(),
    //     options:z.array(z.object({
    //         optionText: z.string(),
    //         isCorrect: z.boolean()
    //     }))
    // }))
});
