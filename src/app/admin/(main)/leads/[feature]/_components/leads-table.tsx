'use client'

import * as React from 'react'
import type { DataTableFilterField, DataTableRowAction } from '@/types'

import { useDataTable } from '@/hooks/use-data-table'
import { DataTable } from '@/components/data-table/data-table'
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar'

import { getColumns } from './leads-table-columns'
// import { LeadsTableToolbarActions } from './leads-table-toolbar-actions'
import { getLeads, GetLeadsSchema } from '@/lib/lead'
import { Feature, Lead } from '@prisma/client'
import { Button } from '@/components/ui/button'
import { exportLeadsAction } from '@/actions/admin/export'

interface LeadsTableProps {
	params: GetLeadsSchema
	promise: ReturnType<typeof getLeads>
}

function downloadCsv(csv: string, filename: string) {
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
	const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = url
	a.download = filename
	a.click()
}

export function LeadsTable({ promise, params }: LeadsTableProps) {
	const { data, pageCount, total } = React.use(promise)

	const [rowAction, setRowAction] = React.useState<DataTableRowAction<Lead> | null>(null)

	const columns = React.useMemo(() => getColumns({ setRowAction }), [setRowAction])

	const filterFields: DataTableFilterField<Lead>[] = []

	const { table } = useDataTable({
		data,
		columns,
		pageCount,
		filterFields,
		initialState: {
			sorting: [{ id: 'createdAt', desc: true }],
			columnPinning: { right: ['actions'] },
		},
		getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
		shallow: false,
		clearOnDefault: true,
	})

	const exportLeads = React.useCallback(async () => {
		const csv = await exportLeadsAction(params)

		downloadCsv(csv, 'leads.csv')
	}, [params])

	return (
		<>
			<DataTable table={table}>
				<DataTableToolbar table={table} filterFields={filterFields}>
					<Button onClick={exportLeads}>Exportar</Button>
				</DataTableToolbar>
			</DataTable>
			{/* <DeleteLeadDialog
				open={rowAction?.type === 'delete'}
				onOpenChange={() => setRowAction(null)}
				leads={rowAction?.row.original ? [rowAction?.row.original] : []}
				showTrigger={false}
				onSuccess={() => rowAction?.row.toggleSelected(false)}
			/> */}
		</>
	)
}
