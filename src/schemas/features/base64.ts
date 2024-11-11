import { z } from 'zod'

export const base64Schema = z.string().refine((value) => {
	try {
		// Check if the value is a valid base64 string
		const binaryData = Buffer.from(value, 'base64')

		console.log(value)

		// // Check if the binary data represents an image
		// if (!['image/jpeg', 'image/png'].includes(binaryData.toString('utf-8').split(',')[0].split(':')[1].split(';')[0])) {
		// 	console.log('kekakakakaka')
		// 	return false
		// }

		// Check if the image size is less than or equal to 1MB
		return binaryData.length <= 1 * 1024 * 1024
	} catch (error) {
		return false
	}
}, 'La imagen no es válida')
