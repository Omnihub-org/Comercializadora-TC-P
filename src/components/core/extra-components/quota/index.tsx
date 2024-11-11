'use client'

import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

import { baseQuoterSchema } from '@/schemas/features/quoter'
import { getQuoterRequirementsAction } from '@/actions/quoter'

export function Quota({ requirements }: { requirements: Awaited<ReturnType<typeof getQuoterRequirementsAction>> }) {
	const { watch } = useFormContext<z.infer<typeof baseQuoterSchema>>()

	const amount = watch('amount') || requirements.loan.amount.min
	const installments = watch('installments') || requirements.loan.installments.min

	const quota = ((amount / installments) * (1 + (requirements.tna || 0))).toLocaleString('es-ES', {
		maximumFractionDigits: 0,
		useGrouping: true,
	})

	return (
		<div className='flex flex-col gap-2 py-4 text-center'>
			<h3>Valor de la cuota</h3>
			<h2 className='text-3xl'>${quota}</h2>
			<p className='text-xs opacity-50'>* Cuotas fijas sin sorpresas</p>
		</div>
	)
}
