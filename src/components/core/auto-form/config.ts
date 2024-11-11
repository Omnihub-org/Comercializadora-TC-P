import AutoFormEnum from './fields/enum'
import AutoFormInput from './fields/input'
import AutoFormNumber from './fields/number'
import AutoFormSlider from './fields/slider'
import AutoFormRadio from './fields/radio'
import AutoFormFile from './fields/file'

export const INPUT_COMPONENTS = {
	select: AutoFormEnum,
	number: AutoFormNumber,
	fallback: AutoFormInput,
	slider: AutoFormSlider,
	radio: AutoFormRadio,
	file: AutoFormFile,
}

/**
 * Define handlers for specific Zod types.
 * You can expand this object to support more types.
 */
export const DEFAULT_ZOD_HANDLERS: {
	[key: string]: keyof typeof INPUT_COMPONENTS
} = {
	ZodEnum: 'select',
	ZodNativeEnum: 'select',
	ZodNumber: 'number',
}
