import 'server-only'

import Axios from 'axios'
import { z } from 'zod'
import { Lead, SignatureStatus } from '@prisma/client'
import { PDFDocument } from 'pdf-lib'
import * as fs from 'fs'
import path from 'path'

import { GetSignatureStatusOptions, GetSignatureUrlOptions, SignatureAdapter } from '../adapter'
import { getBaseUrl } from '@/lib/utils'
import { siteConfig } from '@/config/site'

type DigilogixSignatureAdapterConfig = {
	apiKey: string
	userId: string
	businessId?: string
	apiUrl?: string
}

const LeadSignatureSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	nationalId: z.string(),
	email: z.string().email(),
	phone: z.string(),
})

export class DigilogixSignatureAdapter extends SignatureAdapter {
	private digilogixClient = Axios.create({
		baseURL: this.getApiUrl(),
		headers: {
			Authorization: this.config.apiKey,
			identificadorUsuario: this.config.userId,
		},
	})

	constructor(private readonly config: DigilogixSignatureAdapterConfig) {
		super()
	}

	private getApiUrl(): string {
		return this.config.apiUrl || 'https://test.firmador.alpha2000.com.ar/api'
	}

	async createPersona(lead: Lead) {
		const { firstName, lastName, nationalId, email, phone } = LeadSignatureSchema.parse(lead)

		const response = await this.digilogixClient.post('/Persona/PostCrearPersona', {
			CodigoUnicoIdentificacion: nationalId,
			Nombre: firstName,
			Apellido: lastName,
			Telefono: phone,
			Email: email,
		})

		if (response.status !== 200) {
			throw new Error('Failed to create persona')
		}
	}

	async getSignatureStatus({ signatureId }: GetSignatureStatusOptions): Promise<SignatureStatus> {
		// Documento/PostObtenerEstadoDocumento

		const response = await this.digilogixClient.post('/Documento/PostObtenerEstadoDocumento', {
			IdentificadorDocumento: signatureId,
		})

		// TODO: Implementar

		return SignatureStatus.COMPLETED
	}

	async getSignatureUrl({ leadId, featureName }: GetSignatureUrlOptions): Promise<{ url: string; signatureId: string }> {
		const lead = await this.getLead(leadId)

		if (!lead) throw new Error('Lead not found')

		await this.createPersona(lead)

		const docContent = fs.readFileSync(path.join(process.cwd(), 'src/assets/contract.pdf'))

		const doc = await PDFDocument.load(docContent)

		const form = doc.getForm()

		form.getTextField('name').setText(lead.firstName + ' ' + lead.lastName)
		form.getTextField('nationalId').setText(lead.nationalId || '')
		form
			.getTextField('address')
			.setText(
				(lead.street || '') +
					' ' +
					(lead.streetNumber || '') +
					' ' +
					(lead.apartment || '') +
					' ' +
					(lead.zipCode || '') +
					' ' +
					(lead.city || '') +
					' ' +
					(lead.province || '') +
					' ' +
					(lead.district || ''),
			)
		form.getTextField('amount').setText((lead.amount || 0).toString())
		form.getTextField('tna').setText(((siteConfig.scoring.tna || 0) * 100).toString())

		form.flatten()

		const pdfBytes = await doc.save()
		const pdfBase64 = Buffer.from(pdfBytes).toString('base64')

		const response = await this.digilogixClient.post('/Documento/PostSubirDocumento', {
			DocumentoBase64: pdfBase64,
			EmpresaID: this.config.businessId,
			UrlRedireccionOK: getBaseUrl() + `/${featureName}/finalizacion`,
			UrlRedireccionError: getBaseUrl() + `${featureName}/error`,
			UrlRedireccionRechazar: getBaseUrl() + `${featureName}/error`,
			NombreDocumento: `Contrato ${siteConfig.name}`,
			Personas: [
				{
					CodigoUnicoIdentificacion: lead.nationalId,
					DebeFirmar: true,
					OrdenFirma: 1,
					CuadroVisibleFirma_Pagina: 3,
					CuadroVisibleFirma_X: 50,
					CuadroVisibleFirma_Y: 125,
					CuadroVisibleFirma_Ancho: 250,
					CuadroVisibleFirma_Alto: 100,
				},
			],
		})

		const url = response.data.Urls[0].URL
		const signatureId = response.data.IdentificadorDocumento

		if (!url || !signatureId) throw new Error('Failed to get signature url')

		return { url, signatureId }
	}
}
