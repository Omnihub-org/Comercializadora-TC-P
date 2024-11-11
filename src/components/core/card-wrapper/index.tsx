import Image from 'next/image'

import { siteConfig } from '@/config/site'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import Title from './title'

export default function CardWrapper({ children }: { children: React.ReactNode }) {
	return (
		<Card className='relative grid max-h-full w-full max-w-lg grid-rows-[auto_1fr] gap-4 overflow-hidden p-2'>
			<CardHeader className='flex flex-col items-center gap-2 text-center'>
				{siteConfig?.logo && <Image {...siteConfig.logo} alt='logo' />}
				<Title />
			</CardHeader>

			<ScrollArea>
				<CardContent className='flex flex-col items-center gap-4'>{children}</CardContent>
			</ScrollArea>
		</Card>
	)
}
