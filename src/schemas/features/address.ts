import { z } from 'zod'

export type Province = typeof provinces[number]
const provinces = [
	'Ciudad Autónoma de Buenos Aires',
	'Buenos Aires',
	'Catamarca',
	'Chaco',
	'Chubut',
	'Córdoba',
	'Corrientes',
	'Entre Ríos',
	'Formosa',
	'Jujuy',
	'La Pampa',
	'La Rioja',
	'Mendoza',
	'Misiones',
	'Neuquén',
	'Río Negro',
	'Salta',
	'San Juan',
	'San Luis',
	'Santa Cruz',
	'Santa Fe',
	'Santiago del Estero',
	'Tierra del Fuego',
	'Tucumán',
] as const

const employmentRelationships = ['Relación de dependencia', 'Monotributista o autónomo', 'Jubilado o pensionado'] as const

const creditPurposes = [
	'Mantenimiento y arreglo del hogar, auto o moto',
	'Cumpleaños, recreación, turismo',
	'Emprendimiento personal',
	'Cancelar deudas',
	'Urgencias',
	'Otros',
] as const

export const addressSchema = z.object({
	province: z.enum(provinces).default('Buenos Aires'),
	district: z
		.string({
			required_error: 'El partido es obligatorio.',
			invalid_type_error: 'El partido debe ser una cadena de texto.',
		})
		.min(2, { message: 'El partido debe tener al menos 2 caracteres.' })
		.max(100, { message: 'El partido debe tener como máximo 100 caracteres.' }),
	city: z
		.string({
			required_error: 'La localidad es obligatoria.',
			invalid_type_error: 'La localidad debe ser una cadena de texto.',
		})
		.min(2, { message: 'La localidad debe tener al menos 2 caracteres.' })
		.max(100, { message: 'La localidad debe tener como máximo 100 caracteres.' }),
	zipCode: z
		.string({
			required_error: 'El código postal es obligatorio.',
			invalid_type_error: 'El código postal debe ser una cadena de texto.',
		})
		.regex(/^[a-zA-Z]?\d{4}[a-zA-Z]{0,3}$/, { message: 'Código postal inválido. Ej: 1607, B1638 o 1638ABC' }),
	street: z
		.string({
			required_error: 'La calle es obligatoria.',
			invalid_type_error: 'La calle debe ser una cadena de texto.',
		})
		.min(3, { message: 'La calle debe tener al menos 3 caracteres.' })
		.max(100, { message: 'La calle debe tener como máximo 100 caracteres.' }),
	streetNumber: z
		.number({
			required_error: 'El número es obligatorio.',
			invalid_type_error: 'El número debe ser un número.',
		})
		.min(1, { message: 'El número debe ser mayor a 0.' }),
	apartment: z.string({ invalid_type_error: 'El departamento debe ser una cadena de texto.' }).nullish(),
	employmentStatus: z.enum(employmentRelationships, { message: 'El tipo de situación laboral es obligatorio.' }),
	creditPurpose: z.enum(creditPurposes, { message: 'El motivo del crédito es obligatorio.' }),
})
