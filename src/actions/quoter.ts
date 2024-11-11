'use server'

import { getScoringAction } from '@/actions/core/scoring'
import { siteConfig } from '@/config/site'
import { Feature } from '@prisma/client'

export async function getQuoterRequirementsAction(feature: Feature) {
	const score = await getScoringAction(feature)

	return { ...score, tna: siteConfig.scoring.tna }
}
