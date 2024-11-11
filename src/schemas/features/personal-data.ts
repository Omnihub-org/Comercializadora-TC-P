import { z } from 'zod'
import { Gender } from '@prisma/client'

export const personalDataSchema = z.object({
	firstName: z
		.string({
			required_error: 'El nombre es obligatorio.',
			invalid_type_error: 'El nombre debe ser una cadena de texto.',
		})
		.min(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
		.max(43, { message: 'El nombre debe tener como máximo 43 caracteres.' }),
	lastName: z
		.string({
			required_error: 'El apellido es obligatorio.',
			invalid_type_error: 'El apellido debe ser una cadena de texto.',
		})
		.min(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
		.max(200, { message: 'El apellido debe tener como máximo 200 caracteres.' }),
	nationalId: z.string({
		required_error: 'El DNI es obligatorio.',
		invalid_type_error: 'El DNI debe ser un número.',
	}),
	gender: z
		.nativeEnum(Gender, {
			required_error: 'El género es obligatorio.',
			invalid_type_error: 'El género debe ser uno de los valores permitidos.',
		})
		.default('Femenino'),
	email: z
		.string({
			required_error: 'El email es obligatorio.',
			invalid_type_error: 'El email debe ser una cadena de texto.',
		})
		.email({ message: 'El email debe ser válido.' }),
	phone: z
		.string({
			required_error: 'El teléfono es obligatorio.',
			invalid_type_error: 'El teléfono debe ser un número.',
		})
		.regex(/^\d{8,14}$/, { message: 'El teléfono debe tener entre 8 y 14 números.' }),
})
