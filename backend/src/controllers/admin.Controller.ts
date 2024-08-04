import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { signupSchema, signinSchema, createTestSchema } from '../zod/index';
import jwt from 'jsonwebtoken';

enum StatusCode {
    BADREQ = 400,
    NOTFOUND = 404,
    NOTPERMISSION = 403,
    SUCCESS = 200
}

// Assuming you have an environment variable setup for JWT_SECRET and DATABASE_URL
const JWT_SECRET = process.env.JWT_SECRET!;
const DATABASE_URL = process.env.DATABASE_URL!;

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: DATABASE_URL
        }
    }
});

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
        const existingUser = await prisma.admin.findUnique({
            where: {
                email: body.email
            }
        });

        if (existingUser) {
            return res.status(StatusCode.BADREQ).json({
                msg: "Account already exists"
            });
        }

        const user = await prisma.admin.create({
            data: {
                name: body.name,
                email: body.email,
                password: body.password
            }
        });

        const token = jwt.sign({ id: user.id }, JWT_SECRET);

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
        const user = await prisma.admin.findUnique({
            where: {
                email: body.email
            }
        });

        if (!user) {
            return res.status(StatusCode.NOTFOUND).json({
                msg: "No valid user"
            });
        }

        const token = jwt.sign({ id: user.id }, JWT_SECRET);

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




export const createTest = async (req: Request, res: Response) => {
    const body = req.body;
    const { success } = createTestSchema.safeParse(body);

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
        const test = await prisma.test.create({
            data: {
                adminId: adminId,
                title: body.title,
                description: body.description,
                scheduledAt: body.scheduledAt,
                questions: {
                    create: body.questions.map((question: any, qIndex: number) => ({
                        questionText: question.questionText,
                        questionNumber: qIndex + 1, // Add custom question number
                        options: {
                            create: question.options.map((option: any, oIndex: number) => ({
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

    } catch (error) {
        console.error("Error creating test:", error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Something went wrong"
        });
    }
};


export const getAllTest = async (req: Request, res: Response) => {
    const adminId = req.adminId; // Use req.adminId set by the middleware

    if (!adminId) {
        return res.status(StatusCode.NOTPERMISSION).json({ msg: 'Admin not authorized' });
    }

    try {
        const allTests = await prisma.test.findMany({
            where: { adminId: adminId } 
        });

        return res.status(StatusCode.SUCCESS).json(allTests);
    } catch (error) {
        console.error('Error fetching tests:', error);
        return res.status(StatusCode.BADREQ).json({
            msg: "Error fetching the tests"
        });
    }
};

export const testById = async (req: Request, res: Response) => {
    const testId = parseInt(req.params.id, 10);

    if (isNaN(testId)) {
        return res.status(400).json({ msg: "Invalid test ID" });
    }

    try {
        const test = await prisma.test.findUnique({
            where: {
                id: testId
            },
            select:{
                id:true,
                title: true,
                description: true,
                scheduledAt:true,
                questions:{
                    include:{
                        options:{
                            select:{
                                    id:true,
                                    optionNumber:true,
                                    optionText:true,
                                    isCorrect:true
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

    } catch (error) {
        console.error("Error fetching test by ID:", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
};
