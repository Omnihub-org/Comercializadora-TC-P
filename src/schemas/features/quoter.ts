import { z } from 'zod'

import type { Score } from '@/core/scoring/adapter'

export const baseQuoterSchema = z.object({
	amount: z.number({
		required_error: 'El monto es obligatorio.',
		invalid_type_error: 'El monto debe ser un número.',
	}),
	installments: z.number({
		required_error: 'Las cuotas son obligatorias.',
		invalid_type_error: 'Las cuotas deben ser un número.',
	}),
})

export const createQuoterSchema = ({ loan: { amount, installments } }: Score) =>
	baseQuoterSchema.extend({
		amount: z
			.number({
				required_error: 'El monto es obligatorio.',
				invalid_type_error: 'El monto debe ser un número.',
			})
			.min(amount?.min, `El monto debe ser mayor o igual a ${amount?.min}`)
			.max(amount?.max, `El monto debe ser menor o igual a ${amount?.max}`)
			.default(amount?.min),
		installments: z
			.number({
				required_error: 'Las cuotas son obligatorias.',
				invalid_type_error: 'Las cuotas deben ser un número.',
			})
			.min(installments?.min, `Las cuotas deben ser mayor o igual a ${installments?.min}`)
			.max(installments?.max, `Las cuotas deben ser menor o igual a ${installments?.max}`)
			.default(installments?.min),
	})
