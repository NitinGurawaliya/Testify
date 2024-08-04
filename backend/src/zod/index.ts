import z from "zod"

export const signupSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6),
    name:z.string()
})

export const signinSchema = z.object({
    email:z.string().email(),
    password:z.string().min(6),
})


export const createTestSchema = z.object({
    title:z.string(),
    description:z.string().optional(),
    scheduledAt:z.string(),
    questions:z.array(z.object({
        questionText:z.string(),
        options:z.array(z.object({
            optionText: z.string(),
            isCorrect: z.boolean()
        }))
    }))
})

export const updateTestSchema = z.object({
    title:z.string(),
    description:z.string().optional(),
    scheduledAt:z.string().datetime(),
    // questions:z.array(z.object({
    //     questionText:z.string(),
    //     options:z.array(z.object({
    //         optionText: z.string(),
    //         isCorrect: z.boolean()
    //     }))
    // }))
})


