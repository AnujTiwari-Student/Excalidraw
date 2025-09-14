import * as z from "zod"

export const registerUserSchema = z.object({
    username: z.string(),
    password: z.string(),
    name: z.string()
})

export const loginUserSchema = z.object({
    username: z.string(),
    password: z.string(),
})

export const createRoomSchema = z.object({
    slug: z.string()
})