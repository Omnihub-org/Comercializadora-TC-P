import { z } from 'zod'
import { Feature as DBFeature } from '@prisma/client'

import { Lead } from '@/lib/lead'
import { GroupBy } from '@/lib/types'
import { FieldConfig } from '@/components/core/auto-form/types'

type ZodObj = z.ZodObject<any, any>
type ConfigFn<Input = any, Output = ZodObj> = (...data: Input[]) => Output

type Requirements = Record<string, unknown>
export type RequirementsFn = ConfigFn<any, Promise<any>>

type StepSchema<R extends Requirements> = ZodObj | ConfigFn<R>
type StepField<T extends ZodObj, R = Requirements> = FieldConfig<z.infer<T>> | ConfigFn<R, FieldConfig<z.infer<T>>>
type StepRequirements<RFn extends RequirementsFn | undefined> = RFn extends RequirementsFn ? Awaited<ReturnType<RFn>> : Requirements

type InferStepSchema<T extends StepSchema<any>> = T extends ConfigFn ? ReturnType<T> : T

type FeatureConfig = Feature['config']
export type FeatureName = FeatureConfig['name']
export type FeatureMap = GroupBy<FeatureConfig, 'name'>

type StepConfig = Step['config']
export type StepName = StepConfig['name']

export const FeatureToName = {
	[DBFeature.LOAN]: 'creditos',
	[DBFeature.CREDIT_CARD]: 'tarjetas',
} as const

export const FeatureNameToDBFeature = Object.fromEntries(
	Object.entries(FeatureToName).map(([key, value]) => [value, key as DBFeature]),
) as Record<FeatureName, DBFeature>

type BaseConfig = {
	name: string
	action?: ServerAction
}

type BaseStepConfig<RFn extends RequirementsFn | undefined> = BaseConfig & {
	title: string
	messages?: string[]
	extraClass?: string
	extraComponent?: React.ComponentType<{ requirements: any; featureName: FeatureName }>
	btnText?: string
	btnDisabled?: boolean
	getRequirements?: RFn
}

type ServerAction = (...args: any) => Promise<any>

type FormStepConfig<
	RFn extends RequirementsFn | undefined = undefined,
	R extends Requirements = StepRequirements<RFn>,
	S extends StepSchema<R> = StepSchema<R>,
> = BaseStepConfig<RFn> & {
	type: 'form'
	schema: S
	fieldConfig: StepField<InferStepSchema<S>, R>
}

export type LinkStepConfig<RFn extends RequirementsFn | undefined> = BaseStepConfig<RFn> & {
	type: 'link'
}

export type TStep<
	RFn extends RequirementsFn | undefined = undefined,
	R extends Requirements = StepRequirements<RFn>,
	S extends StepSchema<R> = StepSchema<R>,
> = FormStepConfig<RFn, R, S> | LinkStepConfig<RFn>

type ReadonlySteps = ReadonlyArray<Step<RequirementsFn | undefined, TStep<any>>>

export type TFeature<S extends ReadonlySteps = ReadonlySteps> = BaseConfig & {
	steps: S
	btnText?: string
}

export class Step<RFn extends RequirementsFn | undefined = undefined, C extends TStep<RFn> = TStep<RFn>> {
	constructor(public readonly config: C) {}

	async getRequirements(featureName?: FeatureName): Promise<StepRequirements<RFn>> {
		return await this.config?.getRequirements?.(featureName)
	}

	async getSchema() {
		if (this.config.type === 'link') return z.object({})

		const { schema } = this.config
		if (typeof schema !== 'function') return schema
		const requirements = await this.getRequirements()
		return schema(requirements)
	}

	async getFieldConfig() {
		if (this.config.type === 'link') return {}
		const { fieldConfig } = this.config
		if (typeof fieldConfig !== 'function') return fieldConfig
		const requirements = await this.getRequirements()
		return fieldConfig(requirements)
	}

	async isCompleted(lead: Lead): Promise<boolean> {
		const schema = await this.getSchema()
		return schema.safeParse(lead).success
	}

	isLinkStep(): this is Step<RFn, LinkStepConfig<RFn>> {
		return this.config.type === 'link'
	}

	isFormStep(): this is Step<RFn, FormStepConfig<RFn>> {
		return this.config.type === 'form'
	}
}

export class Feature<S extends ReadonlySteps = ReadonlySteps, C extends TFeature<S> = TFeature<S>> {
	constructor(public readonly config: C) {}

	getPath(stepName?: StepName) {
		return `/${this.config.name}/${stepName ?? this.config.steps[0].config.name}`
	}

	getSuccessPath() {
		return this.getPath(this.config.steps[this.config.steps.length - 1].config.name)
	}

	findStep(stepName: StepName): [S[number] | undefined, number] {
		const stepIndex = this.config.steps.findIndex((step) => step.config.name === stepName)
		const step = stepIndex !== -1 ? this.config.steps[stepIndex] : undefined
		return [step, stepIndex]
	}

	async findCorrespondingStep(lead?: Lead | null): Promise<[string | undefined, string]> {
		let correspondingStepName: string | undefined

		if (!lead) return [this.config.steps[0].config.name, this.getPath()]

		for (const step of this.config.steps) {
			const isComplete = await step.isCompleted(lead)
			if (!isComplete && step.isFormStep()) {
				correspondingStepName = step.config.name
				break
			}
		}
		return [correspondingStepName, this.getPath(correspondingStepName)]
	}
}
