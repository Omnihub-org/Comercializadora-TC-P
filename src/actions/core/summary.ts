'use server'

import { FeatureName, FeatureNameToDBFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { getCurrentLead } from '@/lib/lead'
import { redirect } from 'next/navigation'
import { getQuoterRequirementsAction } from '../quoter'
import { Feature } from '@prisma/client'

export async function getSummaryAction(featureName: Feature) {
	const feature = findFeature(featureName)

	if (!feature) redirect('/')

	const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])
	if (!lead) redirect(`/${featureName}`)
	const quoterRequirements = await getQuoterRequirementsAction(featureName)

	return { lead, quoterRequirements }
}
