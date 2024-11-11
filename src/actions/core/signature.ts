'use server'

import { FeatureName, FeatureNameToDBFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { siteConfig } from '@/config/site'
import { db } from '@/lib/db'
import { getCurrentLead } from '@/lib/lead'
import { redirect } from 'next/navigation'

export async function performSignatureFlowAction(featureName: FeatureName) {
	const feature = findFeature(featureName)

	if (!feature) redirect('/')

	const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])

	if (!lead) redirect(`/${featureName}`)

	let signature: Awaited<ReturnType<typeof siteConfig.signature.adapter.getSignatureUrl>> = { url: '', signatureId: '' }

	try {
		signature = await siteConfig.signature.adapter.getSignatureUrl({ leadId: lead.id, featureName })
	} catch {}

	if (!signature.url) redirect(feature.getPath())

	await db.lead.update({
		where: { id: lead.id },
		data: { signatureId: signature.signatureId },
	})

	return redirect(signature.url)
}
