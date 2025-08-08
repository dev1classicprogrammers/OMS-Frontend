"use client"

import { Building2, HardDrive, Users, Settings, Database } from 'lucide-react'
import Link from "next/link"
import { usePathname } from "next/navigation"

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
  SidebarRail,
} from "@/components/ui/sidebar"

const navigationItems = [
  {
    title: "Site Information",
    url: "/",
    icon: Building2,
    description: "Manage site locations and infrastructure",
  },
  {
    title: "Device Information",
    url: "/devices",
    icon: HardDrive,
    description: "Network hardware and configuration",
  },
  {
    title: "Field Engineer/Maintenance",
    url: "/maintenance",
    icon: Users,
    description: "Coming soon - Maintenance tracking",
  },
]

const systemItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "System configuration",
  },
  {
    title: "Data Management",
    url: "/data",
    icon: Database,
    description: "Import/Export utilities",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex flex-col gap-2 p-4">
          <h2 className="text-lg font-semibold">Nosairis OMS</h2>
          <p className="text-sm text-muted-foreground">TNB Network Operations</p>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map((item) => {
                const isActive = pathname === item.url || (item.url !== "/" && pathname.startsWith(item.url))

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
