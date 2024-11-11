import 'server-only'

import { ImageProps } from 'next/image'
import localFont from 'next/font/local'

import { BiometricsAdapter } from '@/core/biometrics/adapter'
import { ScoringAdapter } from '@/core/scoring/adapter'
import { SignatureAdapter } from '@/core/signature/adapter'
import { DigilogixSignatureAdapter } from '@/core/signature/adapters/digilogix'
import { FixedScoringAdapter } from '@/core/scoring/adapters/fixed'
import { NeocheckBiometricsAdapter } from '@/core/biometrics/adapters/neocheck'

type SiteConfig = {
	name: string
	description?: string
	logo?: Pick<ImageProps, 'src' | 'height' | 'width'> & Partial<ImageProps>
	bg?: Pick<ImageProps, 'src' | 'height' | 'width'> & Partial<ImageProps>
	fonts?: ReturnType<typeof localFont>[]
	scoring: {
		adapter: InstanceType<typeof ScoringAdapter>
		tna?: number
	}
	biometrics: {
		adapter: InstanceType<typeof BiometricsAdapter>
	}
	signature: {
		adapter: InstanceType<typeof SignatureAdapter>
	}
}

const fontPrimary = localFont({ variable: '--font-primary', src: '../../public/fonts/GeistVF.woff', weight: '100 900' })
const fontSecondary = localFont({ variable: '--font-secondary', src: '../../public/fonts/GeistMonoVF.woff', weight: '100 900' })

export const siteConfig: SiteConfig = {
	name: 'Banco Provincia',
	logo: { src: '/logo.svg', height: 40, width: 175 },
	bg: { src: '/images/bg.webp', height: 2560, width: 1440 },
	fonts: [fontPrimary, fontSecondary],
	biometrics: {
		adapter: new NeocheckBiometricsAdapter({
			username: 'comercializadoraTC',
			password: 'lQ4]VY8311h%',
			customization: {
				backgroundColor: '#fff',
				mainColor: '#000',
				secondaryColor: '#1FB4BD',
				buttonColor: '#279e37',
				buttonTextColor: '#fff',
				buttonBorderRadius: 12,
				language: 'es',
				linkExpirationHours: 2,
			},
		}),
	},
	signature: {
		adapter: new DigilogixSignatureAdapter({
			apiKey: '8vo948NR321PqWCQ62122DXSzAk1556CfgfHTHYVbNkM',
			userId: 'PMPnhNEHRGTNwJUDHbCUFQ==',
			businessId: '5qlPvB300fJ99',
		}),
	},
	scoring: {
		tna: 0.3,
		adapter: new FixedScoringAdapter({
			score: {
				loan: {
					amount: { min: 10_000, max: 1_000_000 },
					installments: { min: 3, max: 12 },
				},
				card: {
					amount: { min: 10_000, max: 1_000_000 },
				},
			},
		}),
	},
}
