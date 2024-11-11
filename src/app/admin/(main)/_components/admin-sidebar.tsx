import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar'
import { siteConfig } from '@/config/site'
import { UserIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export function AdminSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				{siteConfig?.logo && (
					<div className='px-2 pt-4'>
						<Image {...siteConfig.logo} alt='logo' />
					</div>
				)}
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Leads</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link href='/admin/leads/LOAN'>
										<UserIcon />
										<span>Préstamos</span>
									</Link>
								</SidebarMenuButton>
								<SidebarMenuButton asChild>
									<Link href='/admin/leads/CREDIT_CARD'>
										<UserIcon />
										<span>Tarjetas de crédito</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
