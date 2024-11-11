import Image from 'next/image'

import { siteConfig } from '@/config/site'
import CardWrapper from '@/components/core/card-wrapper'
import { cn } from '@/lib/utils'

export default function CreditLayout({ children }: { children: React.ReactNode }) {
	return (
		<section className='grid h-dvh max-h-dvh place-items-center p-4'>
			<CardWrapper>{children}</CardWrapper>
			{siteConfig.bg && (
				<Image
					{...siteConfig.bg}
					className={cn('fixed inset-0 z-[-1] min-h-full min-w-full object-cover object-center', siteConfig.bg?.className)}
					draggable={false}
					priority
					alt='bg'
				/>
			)}
		</section>
	)
}
