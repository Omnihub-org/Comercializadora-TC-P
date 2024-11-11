'use server'

import { validateRequest } from '@/lib/auth'
import { objectsToCsv } from '@/lib/exports'
import { getLeads, GetLeadsSchema } from '@/lib/lead'

export async function exportLeadsAction(input: GetLeadsSchema) {
	const { user } = await validateRequest()

	if (!user) throw new Error('Unauthorized')

	const leads = await getLeads(input)

	return objectsToCsv(
		leads.data.map(({ proofOfAddressBase64, proofOfIncomeBase64, createdAt, ...rest }) => ({
			...rest,
			createdAt: createdAt.toISOString(),
		})),
	)
}
