import { redirect, notFound } from 'next/navigation'

import { FeatureMap, FeatureName, FeatureNameToDBFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { getCurrentLead } from '@/lib/lead'
import { StepForm } from '@/components/core/step-form'

type StepPageProps<FN extends FeatureName = FeatureName, SN = FeatureMap[FN]['name']> = {
	params: { featureName: FN; stepName: SN }
}

export default async function StepPage({ params }: StepPageProps) {
	const { featureName, stepName } = params

	const feature = findFeature(featureName)
	if (!feature) return notFound()

	const [currentStep, currentStepIndex] = feature.findStep(stepName)
	if (!currentStep) return redirect(feature.getPath())

	let lead = await getCurrentLead(FeatureNameToDBFeature[featureName])
	if (!lead && currentStepIndex !== 0) return redirect(feature.getPath())

	const [name, path] = currentStep.isLinkStep() ? [stepName, feature.getPath(stepName)] : await feature.findCorrespondingStep(lead)
	if (currentStep.config.name !== name) redirect(path)

	const currentStepRequirements = await currentStep.getRequirements(featureName)
	const currentFieldConfig = await currentStep.getFieldConfig()

	return (
		<StepForm
			featureName={feature.config.name}
			stepName={currentStep.config.name}
			requirements={currentStepRequirements}
			fieldConfig={currentFieldConfig}
		/>
	)
}
