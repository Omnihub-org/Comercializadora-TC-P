'use client'

import { useFormContext } from 'react-hook-form'
import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'
import { z } from 'zod'

import { FormControl, FormItem } from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import AutoFormLabel from '../../auto-form/common/label'
import { addressSchema, Province } from '@/schemas/features/address'

const API_URL = 'https://apis.datos.gob.ar/georef/api/direcciones'
const DEBOUNCE_MS = 200
const MIN_CHARS = 3

type Address = {
	nomenclatura: string
	provincia: { nombre: string }
	departamento: { nombre: string }
	localidad_censal: { nombre: string }
	calle: { nombre: string }
	altura: { valor: string }
	piso?: string
}

export function AddressSearch() {
	const { setValue } = useFormContext<z.infer<typeof addressSchema>>()
	const [open, setOpen] = useState(false)
	const [addresses, setAddresses] = useState<Address[]>([])
	const [selectedAddress, setSelectedAddress] = useState('')
	const [searchValue, setSearchValue] = useState('')
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!searchValue || searchValue.length < MIN_CHARS) {
			setAddresses([])
			return
		}

		let timeoutId: NodeJS.Timeout
		setLoading(true)

		timeoutId = setTimeout(async () => {
			try {
				const url = `${API_URL}?direccion=${encodeURIComponent(searchValue)}`
				const response = await fetch(url)
				const data: { direcciones: Address[] } = await response.json()
				const uniqueAddresses = data.direcciones.filter(
					(d, i, self) => i === self.findIndex((a) => a.nomenclatura + a.piso === d.nomenclatura + d.piso),
				)
				setAddresses(uniqueAddresses)
			} finally {
				setLoading(false)
			}
		}, DEBOUNCE_MS)

		return () => {
			clearTimeout(timeoutId)
		}
	}, [searchValue])

	return (
		<FormItem className='order-first pb-5'>
			<AutoFormLabel label='Búsqueda de dirección' isRequired={false} className='text-pretty text-muted-foreground' />
			<FormControl>
				<Popover open={open} onOpenChange={setOpen}>
					<PopoverTrigger asChild>
						<Button
							variant='outline'
							role='combobox'
							className={cn(
								'min-h-max w-full justify-between text-pretty text-left',
								!selectedAddress && 'text-muted-foreground hover:text-muted-foreground',
							)}
						>
							{selectedAddress || 'Ej: Av. Corrientes 1234 5A'}
							{selectedAddress && (
								<X
									className='ml-2 h-4 w-4 shrink-0 opacity-50'
									onClick={(e) => {
										e.stopPropagation()
										setSelectedAddress('')
									}}
								/>
							)}
						</Button>
					</PopoverTrigger>
					<PopoverContent className='w-[400px] p-0'>
						<Command filter={() => 1}>
							<CommandInput
								placeholder='Escriba la dirección completa para ver sugerencias...'
								value={searchValue}
								onValueChange={setSearchValue}
								className='h-9'
							/>
							<CommandEmpty>
								<span className={`${loading && 'animate-pulse'}`}>
									{!searchValue || searchValue.length < MIN_CHARS ? '' : loading ? 'Buscando...' : 'No se encontraron direcciones.'}
								</span>
							</CommandEmpty>
							<CommandGroup key={searchValue}>
								{addresses.map(({ nomenclatura, provincia, departamento, localidad_censal, calle, altura, piso }, i) => {
									const address = `${nomenclatura} ${piso ?? ''}`
									return (
										<CommandItem
											key={address}
											value={address}
											onSelect={() => {
												setSelectedAddress(address)
												setValue('province', provincia?.nombre as Province)
												setValue('district', departamento?.nombre)
												setValue('city', localidad_censal?.nombre)
												setValue('street', calle?.nombre)
												setValue('streetNumber', altura?.valor as any)
												setValue('apartment', piso)
												setOpen(false)
											}}
										>
											{address}
											<Check className={cn('ml-auto h-4 w-4', selectedAddress === address ? 'opacity-100' : 'opacity-0')} />
										</CommandItem>
									)
								})}
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>
			</FormControl>
		</FormItem>
	)
}
