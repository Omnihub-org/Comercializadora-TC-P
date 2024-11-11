'use server'

import { redirect } from 'next/navigation'

import { FeatureName, FeatureNameToDBFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { errorMessages } from '@/lib/constants'
import { db } from '@/lib/db'
import { getCurrentLead } from '@/lib/lead'

export async function completeStepAction(featureName: FeatureName, stepName: string, data?: unknown) {
	let nextStepPath: string

	try {
		const feature = findFeature(featureName)

		if (!feature) throw new Error(errorMessages.feature)

		const [currentStep, currentStepIndex] = feature.findStep(stepName)
		if (!currentStep) throw new Error(errorMessages.step)

		const lead = await getCurrentLead(FeatureNameToDBFeature[featureName])
		if (!lead) throw new Error(errorMessages.lead)

		if (currentStep.isFormStep()) {
			const { schema, getRequirements } = currentStep.config

			const currentRequirements = await getRequirements?.()
			const currentSchema = typeof schema === 'function' ? schema(currentRequirements) : schema

			await db.lead.update({ where: { id: lead.id }, data: { ...currentSchema.parse(data) } })
		}

		const nextStepName = feature.config.steps[currentStepIndex + 1]?.config.name
		nextStepPath = nextStepName ? feature.getPath(nextStepName) : feature.getSuccessPath()
	} catch (e: any) {
		return { status: 'error', message: e?.message ?? errorMessages.default }
	}

	return redirect(nextStepPath)
}
