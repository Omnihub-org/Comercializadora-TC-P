import { getSummaryAction } from '@/actions/core/summary'

export default function OperationSummary({
	requirements: { lead, quoterRequirements },
}: {
	requirements: Awaited<ReturnType<typeof getSummaryAction>>
}) {
	const max = (lead.requestedFeature === 'LOAN' ? lead.amount : quoterRequirements.card.amount.max)!.toLocaleString('es-ES', {
		maximumFractionDigits: 0,
		useGrouping: true,
	})

	if (lead.requestedFeature === 'LOAN') {
		return (
			<div className='space-y-4 pb-4 text-center'>
				<p>Tu préstamo es de</p>
				<h3 className='text-3xl text-primary'>${max}</h3>

				<div className='space-y-2'>
					<strong>Banco:</strong>
					<p>Banco provincia</p>
				</div>

				<div className='space-y-2'>
					<strong>Plazo:</strong>
					<p>{lead.installments} meses</p>
				</div>

				<div>
					<p className='text-[10px] text-muted-foreground'>TNA: {(quoterRequirements.tna || 0) * 100}%</p>
				</div>
			</div>
		)
	}

	if (lead.requestedFeature === 'CREDIT_CARD') {
		return (
			<div className='space-y-4 pb-4 text-center'>
				<p>El límite de tu tarjeta es de</p>
				<h3 className='text-3xl text-primary'>${max}</h3>

				<div className='space-y-2'>
					<strong>Banco:</strong>
					<p>Banco provincia</p>
				</div>
			</div>
		)
	}
}
