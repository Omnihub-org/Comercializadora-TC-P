import { FormControl, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import AutoFormLabel from '../common/label'
import AutoFormTooltip from '../common/tooltip'
import { AutoFormInputComponentProps } from '../types'
import { useState } from 'react'

export default function AutoFormFile({ label, isRequired, fieldConfigItem, fieldProps, field }: AutoFormInputComponentProps) {
	const { showLabel: _showLabel, ...fieldPropsWithoutShowLabel } = fieldProps
	const showLabel = _showLabel === undefined ? true : _showLabel

	const [file, setFile] = useState<File>()

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		setFile(file)

		const reader = new FileReader()
		reader.onloadend = () => {
			const base64String = reader.result as string
			fieldPropsWithoutShowLabel.onChange(base64String)
		}
		reader.readAsDataURL(file)
	}

	return (
		<div className='flex flex-row items-center space-x-2'>
			<FormItem className='flex w-full flex-col justify-start'>
				{showLabel && <AutoFormLabel label={fieldConfigItem?.label || label} isRequired={isRequired} />}
				<FormControl>
					<Input type='file' {...fieldPropsWithoutShowLabel} value={undefined} onChange={handleFileChange} accept='image/*' />
				</FormControl>
				<AutoFormTooltip fieldConfigItem={fieldConfigItem} />
				<FormMessage />
			</FormItem>
		</div>
	)
}
