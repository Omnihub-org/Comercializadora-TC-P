'use client'

import * as React from 'react'
import { type DataTableRowAction } from '@/types'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'

import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { Lead } from '@prisma/client'

interface GetColumnsProps {
	setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Lead> | null>>
}

function downloadBase64(base64: string, filename: string) {
	// const blob = new Blob([base64], { type: 'image/jpeg' })
	// const url = URL.createObjectURL(blob)
	const a = document.createElement('a')
	a.href = base64
	a.download = filename
	a.click()
}

export function getColumns({ setRowAction }: GetColumnsProps): ColumnDef<Lead>[] {
	return [
		// {
		// 	id: 'select',
		// 	header: ({ table }) => (
		// 		<Checkbox
		// 			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
		// 			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
		// 			aria-label='Select all'
		// 			className='translate-y-0.5'
		// 		/>
		// 	),
		// 	cell: ({ row }) => (
		// 		<Checkbox
		// 			checked={row.getIsSelected()}
		// 			onCheckedChange={(value) => row.toggleSelected(!!value)}
		// 			aria-label='Select row'
		// 			className='translate-y-0.5'
		// 		/>
		// 	),
		// 	enableSorting: false,
		// 	enableHiding: false,
		// },
		{
			accessorKey: 'firstName',
			header: ({ column }) => <DataTableColumnHeader column={column} title='Nombre' />,
			meta: {
				name: 'Nombre',
			},
		},
		{
			accessorKey: 'lastName',
			header: ({ column }) => <DataTableColumnHeader column={column} title='Apellido' />,
			meta: {
				name: 'Apellido',
			},
		},
		{
			accessorKey: 'phone',
			header: ({ column }) => <DataTableColumnHeader column={column} title='Teléfono' />,
			meta: {
				name: 'Teléfono',
			},
		},
		{
			accessorKey: 'nationalId',
			header: ({ column }) => <DataTableColumnHeader column={column} title='DNI' />,
			meta: {
				name: 'DNI',
			},
		},
		{
			accessorKey: 'createdAt',
			header: ({ column }) => <DataTableColumnHeader column={column} title='Fecha' />,
			cell: ({ cell }) => formatDate(cell.getValue() as Date),
			meta: {
				name: 'Fecha',
			},
		},
		{
			id: 'actions',
			cell: function Cell({ row }) {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
								<DotsHorizontalIcon className='size-4' aria-hidden='true' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<DropdownMenuItem onSelect={() => downloadBase64(row.original.proofOfAddressBase64!, 'factura-de-servicios.jpg')}>
								Descargar factura de servicios
							</DropdownMenuItem>
							<DropdownMenuItem onSelect={() => downloadBase64(row.original.proofOfIncomeBase64!, 'recibo-de-sueldo.jpg')}>
								Descargar recibo de sueldo
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)
			},
			size: 40,
		},
	]
}
