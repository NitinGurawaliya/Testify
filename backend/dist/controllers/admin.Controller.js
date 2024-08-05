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
exports.testById = exports.getAllTest = exports.createTest = exports.signin = exports.signup = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../zod/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["BADREQ"] = 400] = "BADREQ";
    StatusCode[StatusCode["NOTFOUND"] = 404] = "NOTFOUND";
    StatusCode[StatusCode["NOTPERMISSION"] = 403] = "NOTPERMISSION";
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
})(StatusCode || (StatusCode = {}));
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL
        }
    }
});
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success, error } = index_1.signupSchema.safeParse(body);
    if (!success) {
        return res.status(StatusCode.BADREQ).json({
            msg: "Invalid inputs",
            errors: error.errors
        });
    }
    try {
        const existingUser = yield prisma.admin.findUnique({
            where: {
                email: body.email
            }
        });
        if (existingUser) {
            return res.status(StatusCode.BADREQ).json({
                msg: "Account already exists"
            });
        }
        const user = yield prisma.admin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET);
        return res.status(StatusCode.SUCCESS).json({
            token
        });
    }
    catch (error) {
        console.error('Error creating user:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Internal server error"
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = index_1.signinSchema.safeParse(body);
    if (!success) {
        return res.status(StatusCode.BADREQ).json({
            msg: "Invalid inputs"
        });
    }
    try {
        const user = yield prisma.admin.findUnique({
            where: {
                email: body.email
            }
        });
        if (!user) {
            return res.status(StatusCode.NOTFOUND).json({
                msg: "No valid user"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, JWT_SECRET);
        return res.status(StatusCode.SUCCESS).json({
            token
        });
    }
    catch (error) {
        console.error('Error signing in:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Internal server error"
        });
    }
});
exports.signin = signin;
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { success } = index_1.createTestSchema.safeParse(body);
    if (!success) {
        return res.status(StatusCode.BADREQ).json({
            msg: "Invalid inputs"
        });
    }
    const adminId = req.adminId;
    if (typeof adminId !== 'number') {
        return res.status(StatusCode.BADREQ).json({
            msg: "Invalid admin ID"
        });
    }
    try {
        const test = yield prisma.test.create({
            data: {
                adminId: adminId,
                title: body.title,
                description: body.description,
                scheduledAt: body.scheduledAt,
                questions: {
                    create: body.questions.map((question, qIndex) => ({
                        questionText: question.questionText,
                        questionNumber: qIndex + 1, // Add custom question number
                        options: {
                            create: question.options.map((option, oIndex) => ({
                                optionText: option.optionText,
                                isCorrect: option.isCorrect,
                                optionNumber: oIndex + 1 // Add custom option number
                            }))
                        }
                    }))
                }
            }
        });
        return res.status(StatusCode.SUCCESS).json({
            msg: "Test created",
            test
        });
    }
    catch (error) {
        console.error("Error creating test:", error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Something went wrong"
        });
    }
});
exports.createTest = createTest;
const getAllTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const adminId = req.adminId; // Use req.adminId set by the middleware
    if (!adminId) {
        return res.status(StatusCode.NOTPERMISSION).json({ msg: 'Admin not authorized' });
    }
    try {
        const allTests = yield prisma.test.findMany({
            where: { adminId: adminId }
        });
        return res.status(StatusCode.SUCCESS).json(allTests);
    }
    catch (error) {
        console.error('Error fetching tests:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Error fetching the tests"
        });
    }
});
exports.getAllTest = getAllTest;
const testById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const testId = parseInt(req.params.id, 10);
    if (isNaN(testId)) {
        return res.status(400).json({ msg: "Invalid test ID" });
    }
    try {
        const test = yield prisma.test.findUnique({
            where: {
                id: testId
            },
            select: {
                id: true,
                title: true,
                description: true,
                scheduledAt: true,
                questions: {
                    include: {
                        options: {
                            select: {
                                id: true,
                                optionNumber: true,
                                optionText: true,
                                isCorrect: true
                            }
                        }
                    }
                }
            }
        });
        if (!test) {
            return res.status(404).json({ msg: "Test not found" });
        }
        return res.status(200).json(test);
    }
    catch (error) {
        console.error("Error fetching test by ID:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.testById = testById;
