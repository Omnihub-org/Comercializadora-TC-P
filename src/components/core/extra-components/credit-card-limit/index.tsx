'use client'

import type { Score } from '@/core/scoring/adapter'

export function CreditCardLimit({ requirements }: { requirements: Score }) {
	const amount = requirements.card.amount.max

	const limit = amount.toLocaleString('es-ES', {
		maximumFractionDigits: 0,
		useGrouping: true,
	})

	return (
		<div className='flex items-center justify-center gap-2 pb-4 text-center'>
			<h3 className='text-3xl text-primary'>${limit}</h3>
			<p className='text-lg text-gray-700'>de límite</p>
		</div>
	)
}
