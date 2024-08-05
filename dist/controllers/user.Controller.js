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
exports.submitTest = exports.startTest = exports.fetchAllTests = exports.signin = exports.signup = void 0;
const client_1 = require("@prisma/client");
const index_1 = require("../zod/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["BADREQ"] = 400] = "BADREQ";
    StatusCode[StatusCode["NOTFOUND"] = 404] = "NOTFOUND";
    StatusCode[StatusCode["NOTPERMISSION"] = 403] = "NOTPERMISSION";
    StatusCode[StatusCode["SUCCESS"] = 200] = "SUCCESS";
})(StatusCode || (StatusCode = {}));
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
        const findUnique = yield prisma.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (findUnique) {
            return res.status(StatusCode.BADREQ).json({
                msg: "Account already exists"
            });
        }
        const user = yield prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
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
        const user = yield prisma.user.findUnique({
            where: {
                email: body.email
            }
        });
        if (!user) {
            return res.status(StatusCode.NOTFOUND).json({
                msg: "No valid user"
            });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET);
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
const fetchAllTests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const allTests = yield prisma.test.findMany();
        return res.status(StatusCode.SUCCESS).json(allTests);
    }
    catch (error) {
        console.error('Error fetching tests:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Error fetching the tests"
        });
    }
});
exports.fetchAllTests = fetchAllTests;
const startTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const testId = parseInt(req.params.id, 10); // Use req.params.id
    if (isNaN(testId)) {
        return res.status(400).json({ msg: "Invalid test ID" });
    }
    try {
        const test = yield prisma.test.findUnique({
            where: { id: testId },
            include: {
                questions: {
                    include: { options: true },
                },
            },
        });
        if (!test) {
            return res.status(404).json({ msg: "Test not found" });
        }
        // Add custom numbering
        const customTest = {
            id: test.id,
            title: test.title,
            description: (_a = test.description) !== null && _a !== void 0 ? _a : undefined, // Ensure optional description is handled
            scheduledAt: test.scheduledAt,
            createdAt: test.createdAt,
            updatedAt: test.updatedAt,
            adminId: test.adminId,
            questions: test.questions.map((question) => ({
                id: question.id,
                questionNumber: question.questionNumber, // Use Prisma schema property
                questionText: question.questionText,
                options: question.options.map((option) => ({
                    id: option.id,
                    optionNumber: option.optionNumber, // Use Prisma schema property
                    optionText: option.optionText,
                    isCorrect: option.isCorrect,
                })),
            })),
        };
        return res.status(200).json(customTest);
    }
    catch (error) {
        console.error("Error fetching test:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.startTest = startTest;
const submitTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId; // Extracted from JWT
    const { testId, responses } = req.body;
    if (!userId) {
        return res.status(403).json({ msg: "Not authorized" });
    }
    try {
        const test = yield prisma.test.findUnique({
            where: { id: testId },
            include: {
                questions: {
                    include: { options: true },
                },
            },
        });
        if (!test) {
            return res.status(404).json({ msg: "Test not found" });
        }
        // Create mappings for question and option numbers
        const questionMap = new Map(test.questions.map(q => [q.questionNumber, q.id]));
        const optionMap = new Map(test.questions.flatMap(q => q.options.map(o => [`${q.questionNumber}-${o.optionNumber}`, o.id])));
        // Calculate the score
        let score = 0;
        for (const response of responses) {
            const questionId = questionMap.get(response.questionNumber);
            const optionId = optionMap.get(`${response.questionNumber}-${response.optionNumber}`);
            if (questionId === undefined || optionId === undefined) {
                console.log(`Invalid question or option number: ${response.questionNumber}, ${response.optionNumber}`);
                continue; // Skip invalid responses
            }
            const question = test.questions.find(q => q.id === questionId);
            if (question) {
                const selectedOption = question.options.find(o => o.id === optionId);
                if (selectedOption === null || selectedOption === void 0 ? void 0 : selectedOption.isCorrect) {
                    score++;
                }
            }
        }
        const result = yield prisma.result.create({
            data: {
                userId,
                testId,
                score,
            },
        });
        return res.status(200).json({
            msg: "Test submitted successfully",
            result,
        });
    }
    catch (error) {
        console.error("Error submitting test:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
});
exports.submitTest = submitTest;
