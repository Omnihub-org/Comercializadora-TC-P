/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverComponentsExternalPackages: ['pdfkit', 'pdf-lib', '@node-rs/argon2'],
	},
}

export default nextConfig
