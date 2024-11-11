'use client'

import { useCallback, useState } from 'react'

import { completeStepAction } from '@/actions/core/step'
import { LinkStepConfig, RequirementsFn } from '@/config/core'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type LinkCardProps = LinkStepConfig<RequirementsFn> & {
	featureName: string
	requirements?: any
}

export function LinkCard(linkCardProps: LinkCardProps) {
	const {
		featureName,
		name,
		messages,
		action,
		requirements,
		extraClass,
		extraComponent: ExtraComponent,
		btnText,
		btnDisabled,
	} = linkCardProps

	const [loading, setLoading] = useState(false)

	const handleClick = useCallback(async () => {
		if (loading) return
		setLoading(true)
		action?.(featureName) ?? (await completeStepAction(featureName, name))
	}, [featureName])

	return (
		<div className='flex w-full flex-col text-pretty'>
			<ul className={cn('grid list-inside place-items-center gap-4 text-center', extraClass)}>
				{messages?.map((message, i) => (
					<li key={i} className='text-lg text-gray-700'>
						{message}
					</li>
				))}
			</ul>
			{ExtraComponent && <ExtraComponent requirements={requirements} />}
			{btnDisabled || (
				<Button onClick={handleClick} disabled={loading} size='lg' className='mt-8 w-max min-w-28 self-end'>
					{!loading ? (btnText ?? 'Siguiente') : <Spinner />}
				</Button>
			)}
		</div>
	)
}

function Spinner() {
	return (
		<svg className='h-5 w-5 animate-spin text-white' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
			<circle
				className='opacity-25'
				cx='12'
				cy='12'
				r='10'
				stroke='currentColor'
				stroke-width='4'
				data-darkreader-inline-stroke=''
			></circle>
			<path
				className='opacity-75'
				fill='currentColor'
				d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
				data-darkreader-inline-fill=''
			></path>
		</svg>
	)
}
