import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { signupSchema, signinSchema } from '../zod/index';
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});

enum StatusCode {
    BADREQ = 400,
    NOTFOUND = 404,
    NOTPERMISSION = 403,
    SUCCESS = 200
}

export const signup = async (req: Request, res: Response) => {
    const body = req.body;

    const { success, error } = signupSchema.safeParse(body);

    if (!success) {
        return res.status(StatusCode.BADREQ).json({
            msg: "Invalid inputs",
            errors: error.errors 
        });
    }

    try {
        const findUnique = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (findUnique) {
            return res.status(StatusCode.BADREQ).json({
                msg: "Account already exists"
            });
        }

        const user = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            }
        });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

        return res.status(StatusCode.SUCCESS).json({
            token
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Internal server error"
        });
    }
};

export const signin = async (req: Request, res: Response) => {
    const body = req.body;

    const { success } = signinSchema.safeParse(body);

    if (!success) {
        return res.status(StatusCode.BADREQ).json({
            msg: "Invalid inputs"
        });
    }

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email
            }
        });

        if (!user) {
            return res.status(StatusCode.NOTFOUND).json({
                msg: "No valid user"
            });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!);

        return res.status(StatusCode.SUCCESS).json({
            token
        });
    } catch (error) {
        console.error('Error signing in:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Internal server error"
        });
    }
};



export const fetchAllTests = async (req: Request, res: Response) => {
    try {
        const allTests = await prisma.test.findMany();
        return res.status(StatusCode.SUCCESS).json(allTests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Error fetching the tests"
        });
    }
};


interface CustomOption {
    id: number;
    optionNumber: number; // Custom property
    optionText: string;
    isCorrect: boolean;
}

interface CustomQuestion {
    id: number;
    questionNumber: number; // Custom property
    questionText: string;
    options: CustomOption[];
}

interface CustomTest {
    id: number;
    title: string;
    description?: string; // Make description optional
    scheduledAt: String;
    createdAt: Date;
    updatedAt: Date;
    adminId: number;
    questions: CustomQuestion[];
}

interface SubmitResponse {
    questionNumber: number;
    optionNumber: number;
}

export const startTest = async (req: Request, res: Response) => {
    const testId = parseInt(req.params.id, 10); // Use req.params.id

    if (isNaN(testId)) {
        return res.status(400).json({ msg: "Invalid test ID" });
    }

    try {
        const test = await prisma.test.findUnique({
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
        const customTest: CustomTest = {
            id: test.id,
            title: test.title,
            description: test.description ?? undefined, // Ensure optional description is handled
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
    } catch (error) {
        console.error("Error fetching test:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};


export const submitTest = async (req: Request, res: Response) => {
    const userId = req.userId; // Extracted from JWT
    const { testId, responses }: { testId: number, responses: SubmitResponse[] } = req.body;

    if (!userId) {
        return res.status(403).json({ msg: "Not authorized" });
    }

    try {
        const test = await prisma.test.findUnique({
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
        const questionMap = new Map<number, number>(
            test.questions.map(q => [q.questionNumber, q.id])
        );
        const optionMap = new Map<string, number>(
            test.questions.flatMap(q => 
                q.options.map(o => [`${q.questionNumber}-${o.optionNumber}`, o.id])
            )
        );

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
                if (selectedOption?.isCorrect) {
                    score++;
                }
            }
        }

        const result = await prisma.result.create({
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
    } catch (error) {
        console.error("Error submitting test:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
