'use client'

import { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

type FinalStatusProps = {
	status: keyof typeof finalStatus
	messages?: Error
}

export default function FinalStatus({ status, messages }: FinalStatusProps) {
	const { title, description, body, icon, color } = finalStatus[status]

	return (
		<>
			<CardHeader className='flex items-center'>
				<CardTitle className={`flex items-center gap-2 text-center capitalize ${color}`}>
					<span className={color}>{icon}</span>
					{title}
				</CardTitle>
				<CardDescription className='text-center'>{messages?.message ?? description}</CardDescription>
			</CardHeader>

			<ScrollArea>
				<CardContent className='flex flex-col items-center gap-4 text-pretty text-center capitalize'>
					<ol className='grid list-none'>
						{body.split('.').map((message, i) => (
							<li key={i}>{message}.</li>
						))}
					</ol>
				</CardContent>
			</ScrollArea>
		</>
	)
}

const finalStatus = {
	error: {
		title: 'Error',
		description: 'Ha ocurrido un error',
		body: 'No se pudo completar la operación. Por favor, intenta nuevamente más tarde.',
		color: 'text-red-500',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'>
				<path
					fill='currentColor'
					fillRule='evenodd'
					d='m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z'
					clipRule='evenodd'
				/>
			</svg>
		),
	},
	success: {
		title: 'Operación Completada',
		description: 'La información ha sido guardada',
		body: 'La operación se ha realizado correctamente. ¡Gracias por tu paciencia!',
		color: 'text-green-500',
		icon: (
			<svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 16 16'>
				<path
					fill='currentColor'
					fillRule='evenodd'
					d='m14.431 3.323l-8.47 10l-.79-.036l-3.35-4.77l.818-.574l2.978 4.24l8.051-9.506z'
					clipRule='evenodd'
				/>
			</svg>
		),
	},
}
