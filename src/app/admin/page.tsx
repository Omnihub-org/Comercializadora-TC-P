import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { siteConfig } from '@/config/site'
import { validateRequest } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { LoginForm } from './_components/login-form'

export default async function AdminPage() {
	const { user } = await validateRequest()

	if (user) redirect('/admin/leads/LOAN')

	return (
		<div className='flex h-screen items-center justify-center'>
			<Card className='w-[500px]'>
				<CardHeader className='flex items-center justify-center'>
					{siteConfig?.logo && <Image {...siteConfig.logo} alt='logo' />}
				</CardHeader>
				<CardContent>
					<LoginForm />
				</CardContent>
			</Card>
		</div>
	)
}
