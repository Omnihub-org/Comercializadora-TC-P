'use client'

import { useParams } from 'next/navigation'

import type { Score } from '@/core/scoring/adapter'

const featuremMap = {
	creditos: 'loan',
	tarjetas: 'card',
}

export function MaxLimit({ requirements }: { requirements: Score }) {
	const params = useParams()
	const featureName = params.featureName as keyof Score
	const feature = featuremMap[featureName as keyof typeof featuremMap] as keyof Score

	const amount = requirements[feature]?.amount.max

	const max = amount.toLocaleString('es-ES', {
		maximumFractionDigits: 0,
		useGrouping: true,
	})

	return (
		<div className='flex items-center justify-center gap-2 pb-4 text-center'>
			<h3 className='text-3xl text-primary'>${max}</h3>
		</div>
	)
}
