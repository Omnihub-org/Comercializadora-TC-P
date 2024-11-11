import 'server-only'

import { cookies } from 'next/headers'
import { db } from './db'
import { Feature, Prisma } from '@prisma/client'
import { LEAD_ID_COOKIE } from './constants'

import { createSearchParamsCache, parseAsInteger, parseAsStringEnum } from 'nuqs/server'
import { parseAsSort } from './parsers'
import { LeadSchema } from '@/generated/zod'

export type Lead = Exclude<Awaited<ReturnType<typeof getCurrentLead>>, null>

export type GetLeadsSchema = Awaited<ReturnType<typeof leadSearchParamsCache.parse>>

export const leadSearchParamsCache = createSearchParamsCache({
	page: parseAsInteger.withDefault(1),
	perPage: parseAsInteger.withDefault(10),
	type: parseAsStringEnum(Object.values(Feature)).withDefault('LOAN'),
	sort: parseAsSort(LeadSchema).withDefault({
		column: 'createdAt',
		order: 'desc',
	}),
})

export async function getLeads(input: GetLeadsSchema) {
	const { data, total } = await db.$transaction(async (tx) => {
		const where: Prisma.LeadWhereInput = {
			firstName: { not: null },
			lastName: { not: null },
			phone: { not: null },
			nationalId: { not: null },
			requestedFeature: input.type,
			status: 'COMPLETED',
		}

		const data = await tx.lead.findMany({
			where,
			orderBy: {
				[input.sort.column]: input.sort.order,
			},
		})

		const total = await tx.lead.count({
			where,
		})

		return { data, total }
	})

	const pageCount = Math.ceil(total / input.perPage)

	return { data, pageCount, total }
}

export async function getOrCreateLead(feature: Feature) {
	const leadId = cookies().get(LEAD_ID_COOKIE)?.value

	if (!leadId) {
		const lead = await db.lead.create({
			data: {
				requestedFeature: feature,
			},
		})

		return lead
	}

	return db.lead.findUniqueOrThrow({
		where: {
			id: leadId,
			requestedFeature: feature,
		},
	})
}

export async function getCurrentLead(feature: Feature) {
	const leadId = cookies().get(LEAD_ID_COOKIE)?.value

	if (!leadId) return null

	return db.lead.findUnique({
		where: {
			id: leadId,
			requestedFeature: feature,
		},
	})
}
