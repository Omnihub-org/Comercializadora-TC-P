import { AdminSidebar } from './admin-sidebar'

export function AdminLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<AdminSidebar />
			<main className='flex-1 px-8'>{children}</main>
		</>
	)
}
