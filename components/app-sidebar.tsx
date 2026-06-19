"use client"

import * as React from "react"
import { 
  NavMain 
} from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// Icons
import { 
  HomeIcon,
  UsersIcon,
  UserIcon,
  TagIcon,
  Disc3Icon,
  ListMusicIcon,
  ClockIcon,
  HeartIcon,
  SearchIcon,
  BarChart3Icon,
  BellIcon,
  GalleryVerticalEndIcon,
  Music,
} from "lucide-react"
import { TeamSwitcher } from "./team-switcher"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: (
        <GalleryVerticalEndIcon/>
        
      ),
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <HomeIcon className="h-5 w-5" />,
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      title: "Artists",
      url: "/dashboard/artists",
      icon: <UserIcon className="h-5 w-5" />,
    },
    {
      title: "Genres",
      url: "/dashboard/genres",
      icon: <TagIcon className="h-5 w-5" />,
    },
    {
      title: "Albums",
      url: "/dashboard/albums",
      icon: <Disc3Icon className="h-5 w-5" />,
    },
    
    {
      title: "Songs",
      url: "/dashboard/songs",
      icon: <ListMusicIcon className="h-5 w-5" />,
    },

    {
      title: "Playlists",
      url: "/dashboard/playlists",
      icon: <ListMusicIcon className="h-5 w-5" />,
    },
    {
      title: "History",
      url: "/history",
      icon: <ClockIcon className="h-5 w-5" />,
    },
    {
      title: "Trending Songs",
      url: "/trending",
      icon: <Music className="h-5 w-5" />,
    },
    {
      title: "Search",
      url: "/search",
      icon: <SearchIcon className="h-5 w-5" />,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: <BarChart3Icon className="h-5 w-5" />,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: <BellIcon className="h-5 w-5" />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
    >
      {/* Header */}
      <SidebarHeader className="border-b border-zinc-800 ">
       <TeamSwitcher teams={data.teams} />
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent className="px-3 py-6">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer with Profile & Logout */}
      <SidebarFooter className="border-t border-zinc-800 ">
        <NavUser user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}