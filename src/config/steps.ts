import { z } from 'zod'

import { FieldConfig } from '@/components/core/auto-form/types'
import { type Lead } from '@/lib/lead'

type StepFieldConfig<T extends z.AnyZodObject, Requirements extends Record<string, any>> =
	| FieldConfig<z.infer<T>>
	| ((data: Requirements) => FieldConfig<z.infer<T>>)

type StepSchema<Requirements extends Record<string, any>> = z.AnyZodObject | ((data: Requirements) => z.AnyZodObject)
type InferStepSchema<TSchema extends StepSchema<any>> = TSchema extends (data: any) => z.AnyZodObject ? ReturnType<TSchema> : TSchema

export type StepConfig<
	Name extends string,
	RequirementsFunction extends () => Promise<any>,
	Requirements extends Awaited<ReturnType<RequirementsFunction>>,
	TSchema extends StepSchema<Requirements>,
> = {
	title: string
	description?: string
	name: Name
	schema: TSchema
	getRequirements?: RequirementsFunction
	fieldConfig: StepFieldConfig<InferStepSchema<TSchema>, Requirements>
	extraComponent?: React.ComponentType<{ requirements?: Requirements }>
}

export function createStep<
	Name extends string,
	GetRequirementsFunction extends () => Promise<any>,
	Data extends Awaited<ReturnType<GetRequirementsFunction>>,
	TSchema extends StepSchema<Data>,
>(config: StepConfig<Name, GetRequirementsFunction, Data, TSchema>) {
	return config
}
