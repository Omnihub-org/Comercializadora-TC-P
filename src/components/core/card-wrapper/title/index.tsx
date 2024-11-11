'use client'

import { usePathname } from 'next/navigation'

import { CardDescription, CardTitle } from '@/components/ui/card'
import { findFeature } from '@/config/features'

export default function Title() {
	const [featureName, stepName] = usePathname().split('/').filter(Boolean)
	if (!featureName) return null

	const feature = findFeature(featureName)
	if (!feature) return null

	const title = feature.findStep(stepName)?.[0]?.config.title
	const description = (feature.findStep(stepName)?.[0]?.config as any)?.description

	return (
		<>
			<CardTitle className='flex flex-col items-center gap-2 text-pretty pt-4'>{title}</CardTitle>
			{description && <CardDescription>{description}</CardDescription>}
		</>
	)
}
