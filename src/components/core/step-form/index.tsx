'use client'

import { useEffect, useMemo, useState } from 'react'

import { TFeature } from '@/config/core'
import { findFeature } from '@/config/features'
import { completeStepAction } from '@/actions/core/step'
import { errorMessages } from '@/lib/constants'
import AutoForm, { AutoFormSubmit } from '@/components/core/auto-form'
import { FieldConfig } from '@/components/core/auto-form/types'
import { LinkCard } from '../link-card'
import { cn } from '@/lib/utils'

type StepFormProps<TF extends TFeature = TFeature, TS = TF['steps'][number]['config']['name']> = {
	featureName: TF['name']
	stepName: TS
	requirements?: any
	fieldConfig: FieldConfig<any>
}

export function StepForm({ featureName, stepName, requirements, fieldConfig }: StepFormProps) {
	const [error, setError] = useState<Awaited<ReturnType<typeof completeStepAction>> | null>(null)

	const feature = findFeature(featureName)
	if (!feature) throw new Error(errorMessages.feature)

	const [step] = feature.findStep(stepName)
	if (!step) throw new Error(errorMessages.step)

	const schema = useMemo(() => {
		if (!step.isFormStep()) return
		return typeof step.config.schema === 'function' ? step.config.schema(requirements) : step.config.schema
	}, [step, requirements])

	const handleSubmit = async (data?: any) => {
		const error = await completeStepAction(feature.config.name, step.config.name, data)
		if (error) setError(error)
	}

	useEffect(() => {
		if (!error) return
		else throw new Error(error.message)
	}, [error])

	if (step.isLinkStep()) return <LinkCard {...step.config} featureName={featureName} requirements={requirements} />

	return (
		<AutoForm formSchema={schema!} fieldConfig={fieldConfig} onSubmit={handleSubmit} className={cn('grid', step?.config?.extraClass)}>
			{step?.config.extraComponent && <step.config.extraComponent featureName={featureName} requirements={requirements} />}
			<AutoFormSubmit className='order-last justify-self-end'>{step?.config?.btnText ?? 'Siguiente'}</AutoFormSubmit>
		</AutoForm>
	)
}
