import 'server-only'

import { BiometricsAdapter, GetBiometricsStatusOptions, GetBiometricsUrlOptions } from '../adapter'
import Axios from 'axios'
import { siteConfig } from '@/config/site'
import { BiometricsStatus } from '@prisma/client'

interface NeocheckBiometricsAdapterConfig {
	username: string
	password: string
	apiUrl?: string

	customization?: {
		fontUrl?: string
		fontSizeTitle?: string
		fontSizeSubtitle?: string
		backgroundColor?: string
		mainColor?: string
		secondaryColor?: string
		buttonColor?: string
		buttonTextColor?: string
		buttonBorderRadius?: number
		language?: string
		linkExpirationHours?: number
	}
}

export class NeocheckBiometricsAdapter extends BiometricsAdapter {
	private accessToken?: string
	private neocheckClient = Axios.create({
		baseURL: this.getApiUrl(),
	})

	constructor(private readonly config: NeocheckBiometricsAdapterConfig) {
		super()
	}

	private getApiUrl(): string {
		return this.config.apiUrl || 'https://neocheck.net/api'
	}

	private async getAccessToken(): Promise<string> {
		const response = await this.neocheckClient.post('/authorization/token', {
			username: this.config.username,
			password: this.config.password,
		})

		this.accessToken = response.data.access_token

		if (!this.accessToken) throw new Error('Failed to get access token')

		return this.accessToken
	}

	async getBiometricsStatus({ verificationId }: GetBiometricsStatusOptions): Promise<BiometricsStatus> {
		const accessToken = await this.getAccessToken()

		const response = await this.neocheckClient.get(`/v1/VideoIdentifications/${verificationId}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
		})

		const { data } = response

		switch (data.status) {
			case 3:
				return BiometricsStatus.PENDING

			case 4:
				return BiometricsStatus.COMPLETED

			default:
				return BiometricsStatus.FAILED
		}
	}

	async getBiometricsUrl({ leadId, redirects }: GetBiometricsUrlOptions): Promise<{ url: string; verificationId: string }> {
		const accessToken = await this.getAccessToken()

		const response = await this.neocheckClient.post(
			`/v1/VideoIdentifications/unattended/link?externalIdentifier=${leadId}`,
			{
				companyName: siteConfig.name,
				redirectUrlOk: redirects.success,
				redirectUrlKo: redirects.failure,
				redirectToMobile: true,
				allowContinueOnQrCode: true,
				skipDocumentSelection: true,
				...(this.config.customization || {}),
			},
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		)

		const url = response.data

		if (!url) throw new Error('Failed to get biometrics url')

		const verificationId = url.split('/').pop()

		return { url, verificationId }
	}
}
