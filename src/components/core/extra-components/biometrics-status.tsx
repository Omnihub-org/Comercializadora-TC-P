import { getBiometricsStatusAction } from '@/actions/core/biometrics'
import { FeatureName } from '@/config/core'

export function BiometricsStatus({
	requirements,
	featureName,
}: {
	featureName: FeatureName
	requirements: Awaited<ReturnType<typeof getBiometricsStatusAction>>
}) {
	if (requirements.status === 'COMPLETED') {
		return (
			<div className='space-y-4 text-center'>
				<strong>Prueba de vida exitosa</strong>
				<p className='pb-4'>
					Completaste la prueba de vida, continúa con el proceso para aquirir tu {featureName === 'creditos' ? 'préstamo' : 'tarjeta'}
				</p>
			</div>
		)
	}

	return (
		<div className='space-y-4 text-center'>
			<strong>No pudimos validar tu identidad</strong>
			<p className='pb-4'>
				Vuelve a hacer la prueba de vida, asegurándote de tener buena iluminación y posiciona tu rostro en el espacio delimitado
			</p>
		</div>
	)
}
