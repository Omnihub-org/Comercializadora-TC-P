'use server'

import { FeatureName, FeatureNameToDBFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { errorMessages, LEAD_ID_COOKIE } from '@/lib/constants'
import { db } from '@/lib/db'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { getScoringAction } from './scoring'
import { Feature, SignatureStatus } from '@prisma/client'
import { getCurrentLead } from '@/lib/lead'
import { siteConfig } from '@/config/site'

export async function startFeatureAction(featureName: FeatureName) {
	const feature = findFeature(featureName)

	if (!feature) throw new Error(errorMessages.feature)

	const lead = await db.lead.create({ data: { requestedFeature: FeatureNameToDBFeature[featureName] } })

	cookies().set(LEAD_ID_COOKIE, lead.id)

	return redirect(`/${feature.config.name}/${feature.config.steps[1].config.name}`)
}

export async function finishFeatureAction(featureName: Feature) {
	const feature = findFeature(featureName)

	if (!feature) redirect('/')

	const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])

	if (!lead || !lead.signatureId) redirect('/')

	const signatureStatus = await siteConfig.signature.adapter.getSignatureStatus({
		signatureId: lead.signatureId,
	})

	if (signatureStatus !== SignatureStatus.COMPLETED) redirect(`/${featureName}/error`)

	await db.lead.update({ where: { id: lead.id }, data: { signatureStatus } })

	if (lead.status !== 'COMPLETED') {
		// TODO: Send email

		await db.lead.update({ where: { id: lead.id }, data: { status: 'COMPLETED' } })
	}

	return getScoringAction(featureName)
}
