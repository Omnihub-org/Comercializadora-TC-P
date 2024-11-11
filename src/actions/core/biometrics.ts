'use server'

import { FeatureName, FeatureNameToDBFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { siteConfig } from '@/config/site'
import { db } from '@/lib/db'
import { getCurrentLead } from '@/lib/lead'
import { getBaseUrl } from '@/lib/utils'
import { BiometricsStatus } from '@prisma/client'
import { redirect } from 'next/navigation'

export async function performBiometricsFlowAction(featureName: FeatureName) {
	const feature = findFeature(featureName)

	if (!feature) redirect('/')

	const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])

	if (!lead) redirect(`/${featureName}`)

	const { url, verificationId } = await siteConfig.biometrics.adapter.getBiometricsUrl({
		leadId: lead.id,
		redirects: { success: getBaseUrl() + feature.getPath('estado-biometria'), failure: getBaseUrl() + `/${featureName}/error` },
	})

	await db.lead.update({
		where: { id: lead.id },
		data: { biometricsVerificationId: verificationId },
	})

	redirect(url)
}

export async function getBiometricsStatusAction(featureName: FeatureName) {
	const feature = findFeature(featureName)

	if (!feature) redirect('/')

	const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])

	if (!lead) redirect(`/${featureName}`)

	if (!lead.biometricsVerificationId) {
		return { status: BiometricsStatus.PENDING }
	}

	if (lead.biometricsStatus === BiometricsStatus.COMPLETED) {
		return { status: lead.biometricsStatus }
	}

	const status = await siteConfig.biometrics.adapter.getBiometricsStatus({
		verificationId: lead.biometricsVerificationId,
	})

	await db.lead.update({
		where: { id: lead.id },
		data: { biometricsStatus: status },
	})

	return { status }
}

export async function checkBiometricsStatusAction(featureName: FeatureName) {
	const feature = findFeature(featureName)

	if (!feature) redirect('/')

	const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])

	if (!lead) {
		redirect(`/${featureName}`)
	}

	if (!lead.biometricsVerificationId) {
		redirect(feature.getPath('biometria'))
	}

	if (lead.biometricsStatus === BiometricsStatus.COMPLETED) {
		return redirect(feature.getPath('recibo-de-sueldo'))
	}

	const biometricsStatus = await siteConfig.biometrics.adapter.getBiometricsStatus({
		verificationId: lead.biometricsVerificationId,
	})

	if (biometricsStatus !== BiometricsStatus.COMPLETED) {
		redirect(feature.getPath('biometria'))
	}

	await db.lead.update({ where: { id: lead.id }, data: { biometricsStatus } })

	redirect(feature.getPath('recibo-de-sueldo'))
}
