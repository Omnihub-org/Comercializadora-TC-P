import { z } from 'zod'
import { base64Schema } from './base64'

export const proofOfIncomeSchema = z.object({
	proofOfIncomeBase64: base64Schema,
})
