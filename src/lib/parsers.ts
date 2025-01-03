import { type FilterCondition } from '@/types'
import { createParser } from 'nuqs/server'
import { z } from 'zod'

import { dataTableConfig } from '@/config/data-table'

interface SortOption<T extends z.AnyZodObject> {
	column: keyof T['shape']
	order: 'asc' | 'desc'
}

/**
 * Create a parser for sorting options based on a given table.
 * @param table The table object to create the sort parser for.
 */
export function parseAsSort<T extends z.AnyZodObject>(table: T) {
	return createParser<SortOption<T>>({
		parse: (queryValue) => {
			const [column, order] = (queryValue.split('.') as [string, 'asc' | 'desc']) ?? []
			if (!column || !order || !(column in table.shape) || !['asc', 'desc'].includes(order)) {
				return null
			}
			return { column, order }
		},
		serialize: ({ column, order }) => `${String(column)}.${order}`,
	})
}

export const filterConditionSchema = z.object({
	id: z.string(),
	value: z.union([z.string(), z.array(z.string())]),
	type: z.enum(dataTableConfig.columnTypes),
	operator: z.enum(dataTableConfig.globalOperators),
})

/**
 * Create a parser for filter conditions based on a given table.
 * @param table The table object to create the filter parser for.
 */
export function parseAsFilters<T extends z.AnyZodObject>(table: T) {
	return createParser<FilterCondition<T>[]>({
		parse: (queryValue) => {
			try {
				const parsedValue = JSON.parse(queryValue)

				if (!Array.isArray(parsedValue)) {
					return null
				}

				const validatedFilters = parsedValue
					.map((filter) => {
						const result = filterConditionSchema.safeParse(filter)
						if (!result.success) {
							return null
						}
						if (!(result.data.id in table)) {
							return null
						}
						return result.data as FilterCondition<T>
					})
					.filter((filter): filter is FilterCondition<T> => filter !== null)

				return validatedFilters.length > 0 ? validatedFilters : null
			} catch {
				return null
			}
		},
		serialize(filters) {
			return JSON.stringify(filters)
		},
	})
}
