import { z } from 'zod'
import { base64Schema } from './base64'

export const proofOfAddressSchema = z.object({
	proofOfAddressBase64: base64Schema,
})
