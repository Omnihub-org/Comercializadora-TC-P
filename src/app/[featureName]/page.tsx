import { notFound, redirect } from 'next/navigation'

import { FeatureName } from '@/config/core'
import { findFeature } from '@/config/features'

export type FeaturePageProps = {
	params: { featureName: FeatureName }
}

export default async function FeaturePage({ params }: FeaturePageProps) {
	const { featureName } = params

	const feature = findFeature(featureName)
	if (!feature) return notFound()

	redirect(feature.getPath())
}
