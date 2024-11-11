export function objectsToCsv(data: Record<string, any>[]) {
	const headers = Object.keys(data[0]!).map((key) => ({ id: key, title: key }))

	let csv = ''

	csv += headers.map((header) => header.title).join(';') + '\n'

	data.forEach((record) => {
		csv +=
			headers
				.map((header) => {
					const item = record[header.id]

					if (item === null) return ''

					if (Array.isArray(item)) {
						if (item.length === 0) return ''

						if (typeof item[0] === 'string') return item.join(',')
						if (typeof item[0] === 'object') return JSON.stringify(item)

						return item
					}

					if (typeof item === 'object') return JSON.stringify(item)

					return item
				})
				.join(';') + '\n'
	})

	return csv
}
