import { SidebarProvider } from '@/components/ui/sidebar'
import { AdminLayout } from './_components/admin-layout'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<NuqsAdapter>
			<SidebarProvider>
				<AdminLayout>{children}</AdminLayout>
			</SidebarProvider>
		</NuqsAdapter>
	)
}
