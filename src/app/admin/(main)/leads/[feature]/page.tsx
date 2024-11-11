import { getLeads, leadSearchParamsCache } from '@/lib/lead'
import { SearchParams } from '@/types'
import { LeadsTable } from './_components/leads-table'
import { Feature } from '@prisma/client'
import { validateRequest } from '@/lib/auth'
import { redirect } from 'next/navigation'

interface AdminLeadsPageProps {
	searchParams: Promise<SearchParams>
	params: Promise<{
		feature: Feature
	}>
}

const featureName: Record<Feature, string> = {
	LOAN: 'préstamos',
	CREDIT_CARD: 'tarjetas de crédito',
}

export default async function AdminLeadsPage(props: AdminLeadsPageProps) {
	const { user } = await validateRequest()

	if (!user) redirect('/')

	const searchParams = await props.searchParams
	const params = await props.params
	const search = leadSearchParamsCache.parse(searchParams)

	const promise = getLeads({
		...search,
		type: params.feature,
	})

	return (
		<div className='pt-4'>
			<h1 className='py-4 text-xl font-bold'>Leads de {featureName[params.feature]}</h1>

			<LeadsTable promise={promise} params={search} />
		</div>
	)
}
