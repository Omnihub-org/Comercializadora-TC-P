import { siteConfig } from '@/config/site'
import { db } from '@/lib/db'
import { Lead, SignatureStatus } from '@prisma/client'

export interface GetSignatureUrlOptions {
	leadId: string
	featureName: string
}

export interface GetSignatureStatusOptions {
	signatureId: string
}

export abstract class SignatureAdapter {
	abstract getSignatureUrl(options: GetSignatureUrlOptions): Promise<{ url: string; signatureId: string }>
	abstract getSignatureStatus(options: GetSignatureStatusOptions): Promise<SignatureStatus>

	protected async getLead(leadId: string): Promise<Lead | null> {
		return db.lead.findUnique({ where: { id: leadId } })
	}
}

export function getSignatureAdapter(): SignatureAdapter {
	return siteConfig.signature.adapter
}
