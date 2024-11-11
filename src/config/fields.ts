import { z } from 'zod'

import { personalDataSchema } from '@/schemas/features/personal-data'
import { addressSchema } from '@/schemas/features/address'
import { baseQuoterSchema } from '@/schemas/features/quoter'
import { FieldConfig } from '@/components/core/auto-form/types'
import type { Score } from '@/core/scoring/adapter'

export const personalDataFields: FieldConfig<z.infer<typeof personalDataSchema>> = {
	firstName: { label: 'Nombre' },
	lastName: { label: 'Apellido' },
	nationalId: { label: 'DNI' },
	gender: { label: 'Sexo', fieldType: 'radio' },
	email: { label: 'Email' },
	phone: { label: 'Teléfono (sin 0 ni 15)', inputProps: { placeholder: 'Ej: 11 2345 6789' } },
}

const addressFieldsBase: Partial<FieldConfig<z.infer<typeof addressSchema>>> = {
	province: { label: 'Provincia' },
	district: { label: 'Partido' },
	city: { label: 'Localidad' },
	zipCode: { label: 'Código postal' },
	street: { label: 'Calle' },
	streetNumber: { label: 'Número', fieldType: 'fallback' },
	apartment: { label: 'Departamento', inputProps: { placeholder: 'Ej: 2A (opcional)' } },
	employmentStatus: { label: 'Situación laboral' },
}

export const addressFieldsLoan = {
	...addressFieldsBase,
	creditPurpose: { label: 'Motivo del crédito' },
}

export const proofOfIncomeFields = {
	proofOfIncomeBase64: { label: 'Recibo de sueldo', fieldType: 'file' },
} as any

export const proofOfAddressFields = {
	proofOfAddressBase64: { label: 'Factura de servicio', fieldType: 'file' },
} as any

export const addressFieldsCreditCard = {
	...addressFieldsBase,
	creditPurpose: { label: 'Uso principal de la tarjeta' },
}

export const quoterFields = ({ loan: { amount, installments } }: Score): FieldConfig<z.infer<typeof baseQuoterSchema>> => ({
	amount: { label: 'Monto', fieldType: 'slider', inputProps: { step: 10000, min: amount.min, max: amount.max } },
	installments: { label: 'Cuotas', fieldType: 'slider', inputProps: { step: 1, min: installments.min, max: installments.max } },
})
