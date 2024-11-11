import { siteConfig } from '@/config/site'
import { BiometricsStatus } from '@prisma/client'

export interface GetBiometricsUrlOptions {
	leadId: string
	redirects: {
		success: string
		failure: string
	}
}

export interface GetBiometricsStatusOptions {
	verificationId: string
}

export abstract class BiometricsAdapter {
	abstract getBiometricsUrl(options: GetBiometricsUrlOptions): Promise<{ url: string; verificationId: string }>
	abstract getBiometricsStatus(options: GetBiometricsStatusOptions): Promise<BiometricsStatus>
}

export function getBiometricsAdapter(): BiometricsAdapter {
	return siteConfig.biometrics.adapter
}
