// types.ts

export interface CustomOption {
    id: number;
    optionNumber: number; // Custom property
    optionText: string;
    isCorrect: boolean;
}

export interface CustomQuestion {
    id: number;
    questionNumber: number; // Custom property
    questionText: string;
    options: CustomOption[];
}

export interface CustomTest {
    id: number;
    title: string;
    description?: string; // Make description optional
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
    adminId: number;
    questions: CustomQuestion[];
}

export interface SubmitResponse {
    questionNumber: number;
    optionNumber: number;
}
