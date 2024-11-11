'use server'

import { siteConfig } from '@/config/site'
import { getCurrentLead } from '@/lib/lead'
import { Feature } from '@prisma/client'

export async function getScoringAction(feature: Feature) {
	if (siteConfig.scoring.adapter.isFixed) {
		return siteConfig.scoring.adapter.getScore()
	}

	const lead = await getCurrentLead(feature)

	if (!lead) throw new Error('Lead not found')

	return siteConfig.scoring.adapter.getScore(lead)
}
