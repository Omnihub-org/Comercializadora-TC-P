import { Feature, Step, FeatureName } from './core'
import { personalDataSchema } from '@/schemas/features/personal-data'
import { createQuoterSchema } from '@/schemas/features/quoter'
import { addressSchema } from '@/schemas/features/address'
import {
	personalDataFields,
	quoterFields,
	addressFieldsLoan,
	addressFieldsCreditCard,
	proofOfIncomeFields,
	proofOfAddressFields,
} from './fields'
import { getScoringAction } from '@/actions/core/scoring'
import { checkBiometricsStatusAction, getBiometricsStatusAction, performBiometricsFlowAction } from '@/actions/core/biometrics'
import { performSignatureFlowAction } from '@/actions/core/signature'
import { Quota } from '@/components/core/extra-components/quota'
import { AddressSearch } from '@/components/core/extra-components/address-search'
import { CreditCardLimit } from '@/components/core/extra-components/credit-card-limit'
import { MaxLimit } from '@/components/core/extra-components/max-limit'
import { finishFeatureAction, startFeatureAction } from '@/actions/core/feature'
import { proofOfAddressSchema } from '@/schemas/features/proof-of-address'
import { proofOfIncomeSchema } from '@/schemas/features/proof-of-income'

const name = 'Mariana'

const commonSteps = [
	'Completá tus datos personales.',
	'Sacale una foto a tu DNI.',
	'Sacate una selfie para validar tu identidad.',
	'Firmá el contrato.',
]

const loanSteps = ['Seleccioná el monto y las cuotas.', ...commonSteps]

const creditSteps = ['Confirmá el límite de tu tarjeta.', ...commonSteps]

const personalDataStep = new Step({
	type: 'form',
	name: 'datos-personales',
	title: 'Completá tus datos personales',
	schema: personalDataSchema,
	fieldConfig: personalDataFields,
})

const biometricsStep = new Step({
	type: 'link',
	name: 'biometria',
	title: 'Tu DNI y tu selfie',
	messages: [
		'Ahora vamos a validar tus datos.',
		'Tomá una foto del frente y dorso de tu DNI.',
		'Sacate una selfie para validar tu identidad.',
	],
	action: performBiometricsFlowAction,
	btnText: 'Vamos!',
})

const biometricsStatusStep = new Step({
	type: 'link',
	name: 'estado-biometria',
	title: 'Validación de datos',
	getRequirements: getBiometricsStatusAction as any,
})

const signatureStep = new Step({
	type: 'link',
	name: 'firma',
	title: 'Firmar contrato',
	action: performSignatureFlowAction,
	getRequirements: checkBiometricsStatusAction as any,
	messages: ['Ahora vamos a firmar el contrato!'],
	btnText: 'Vamos!',
})

const proofOfIncomeStep = new Step({
	type: 'form',
	name: 'recibo-de-sueldo',
	title: 'Recibo de sueldo',
	description: 'Ahora vas a sacarle una foto a tu último recibo de sueldo.',
	schema: proofOfIncomeSchema,
	fieldConfig: proofOfIncomeFields,
})

const proofOfAddressStep = new Step({
	type: 'form',
	name: 'validar-domicilio',
	title: 'Impuesto o servicio',
	description: 'Ahora vas a sacarle una foto a un impuesto o servicio a tu nombre para validar tu domicilio',
	schema: proofOfAddressSchema,
	fieldConfig: proofOfAddressFields,
})

export const features = [
	new Feature({
		name: 'tarjetas',
		title: 'Pedí la tarjeta con un click!',
		messages: ['Obtenela hoy sin moverte de tu casa.', 'Rápido! Sólo 2 minutos.'],
		btnText: 'La quiero!',
		steps: [
			new Step({
				type: 'link',
				name: 'bienvenida',
				title: `Hola ${name}!`,
				messages: ['Tenés un préstamo aprobado de hasta'],
				getRequirements: getScoringAction,
				extraComponent: MaxLimit,
				btnText: 'Lo quiero!',
				action: startFeatureAction,
			}),
			new Step({
				type: 'link',
				name: 'pasos',
				title: `En sólo ${creditSteps.length} pasos`,
				messages: creditSteps,
				btnText: 'La quiero!',
				extraClass: 'justify-center list-decimal place-items-start text-left',
			}),
			new Step({
				type: 'link',
				name: 'limite',
				title: 'Límite de tarjeta',
				messages: ['Te ofrecemos una tarjeta de crédito con:'],
				getRequirements: getScoringAction,
				extraComponent: CreditCardLimit,
				btnText: 'La quiero!',
			}),
			personalDataStep,
			new Step({
				type: 'form',
				name: 'direccion',
				title: 'Completá tu dirección',
				schema: addressSchema,
				fieldConfig: addressFieldsCreditCard,
				extraComponent: AddressSearch,
			}),
			biometricsStep,
			biometricsStatusStep,
			proofOfIncomeStep,
			proofOfAddressStep,
			signatureStep,
			new Step({
				type: 'link',
				name: 'finalizacion',
				title: 'Listo',
				description: 'Préstamo otorgado',
				messages: ['Tu préstamo es de'],
				getRequirements: finishFeatureAction,
				extraComponent: MaxLimit,
				btnDisabled: true,
			}),
		] as const,
	}),
	new Feature({
		name: 'creditos',
		steps: [
			new Step({
				type: 'link',
				name: 'bienvenida',
				title: `Hola ${name}!`,
				messages: ['Tenés un préstamo aprobado de hasta'],
				getRequirements: getScoringAction,
				extraComponent: MaxLimit,
				btnText: 'Lo quiero!',
				action: startFeatureAction,
			}),
			new Step({
				type: 'link',
				name: 'inicio',
				title: `Préstamo con un click!`,
				messages: ['Obtenelo hoy sin moverte de tu casa.', 'Rápido! Sólo 2 minutos.', 'La mejor tasa.', 'Te lo depositamos en 24hs.'],
				btnText: 'Lo quiero!',
			}),
			new Step({
				type: 'link',
				name: 'pasos',
				title: `En sólo ${loanSteps.length} pasos`,
				messages: loanSteps,
				btnText: 'Lo quiero!',
				extraClass: 'justify-center list-decimal place-items-start text-left',
			}),
			new Step({
				type: 'form',
				name: 'cotizador',
				title: 'Tenemos esta oferta para vos!',
				description: 'Elegí el monto y las cuotas',
				getRequirements: getScoringAction,
				schema: createQuoterSchema,
				fieldConfig: quoterFields,
				extraComponent: Quota,
			}),
			personalDataStep,
			new Step({
				type: 'form',
				name: 'direccion',
				title: 'Completá tu dirección',
				schema: addressSchema,
				fieldConfig: addressFieldsLoan,
				// extraComponent: AddressSearch,
			}),
			biometricsStep,
			biometricsStatusStep,
			proofOfIncomeStep,
			proofOfAddressStep,
			signatureStep,
			new Step({
				type: 'link',
				name: 'finalizacion',
				title: 'Listo',
				description: 'Préstamo otorgado',
				messages: ['Tu préstamo es de'],
				getRequirements: finishFeatureAction,
				extraComponent: MaxLimit,
				btnDisabled: true,
			}),
		] as const,
	}),
]

export function findFeature(name: FeatureName): Feature | undefined {
	return features.find((feature) => feature.config.name === name)
}
