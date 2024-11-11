'use client'

import * as React from 'react'
import { type DataTableRowAction } from '@/types'
import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { type ColumnDef } from '@tanstack/react-table'

import { formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'

import { Lead } from '@prisma/client'

interface GetColumnsProps {
	setRowAction: React.Dispatch<React.SetStateAction<DataTableRowAction<Lead> | null>>
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
		// {
		// 	id: 'actions',
		// 	cell: function Cell({ row }) {
		// 		return (
		// 			<DropdownMenu>
		// 				<DropdownMenuTrigger asChild>
		// 					<Button aria-label='Open menu' variant='ghost' className='flex size-8 p-0 data-[state=open]:bg-muted'>
		// 						<DotsHorizontalIcon className='size-4' aria-hidden='true' />
		// 					</Button>
		// 				</DropdownMenuTrigger>
		// 				<DropdownMenuContent align='end' className='w-40'>
		// 					<DropdownMenuItem onSelect={() => setRowAction({ row, type: 'update' })}>Edit</DropdownMenuItem>
		// 					<DropdownMenuSeparator />
		// 					<DropdownMenuItem onSelect={() => setRowAction({ row, type: 'delete' })}>
		// 						Delete
		// 						<DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
		// 					</DropdownMenuItem>
		// 				</DropdownMenuContent>
		// 			</DropdownMenu>
		// 		)
		// 	},
		// 	size: 40,
		// },
	]
}
