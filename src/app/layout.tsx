import type { Metadata } from 'next'
import './globals.css'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
	title: siteConfig.name,
	description: siteConfig.description,
}

const fonts = siteConfig?.fonts?.map((font) => ('variable' in font ? font.variable : font.className)).join(' ')

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang='en'>
			<body className={`${fonts} bg-muted antialiased`}>{children}</body>
		</html>
	)
}
