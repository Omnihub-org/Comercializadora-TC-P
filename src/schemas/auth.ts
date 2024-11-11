import { z } from 'zod'

export const loginSchema = z.object({
	username: z.string().min(3).max(31),
	password: z.string().min(6).max(255),
})
