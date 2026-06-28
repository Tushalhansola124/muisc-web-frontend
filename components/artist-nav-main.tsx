"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMainArtist({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url

          return (
            <SidebarMenuItem  className="py-1" key={item.title}>
              <SidebarMenuButton 
               
                isActive={isActive}
                tooltip={item.title}
                className={isActive 
                  ? "bg-sky-600 text-white  hover:bg-sky-600" 
                  : "hover:bg-sky-600 hover:text-white"
                }
              >
                <Link href={item.url} className="flex items-center  gap-3">
                  {item.icon}
                  <span> {item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}