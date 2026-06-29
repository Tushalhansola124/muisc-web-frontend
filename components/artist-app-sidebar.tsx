"use client"

import * as React from "react"
import { 
  
} from "@/components/nav-main"

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

  TagIcon,
  Disc3Icon,
  ListMusicIcon,
  ClockIcon,
  SearchIcon,
  BarChart3Icon,
  BellIcon,
  GalleryVerticalEndIcon,
 
} from "lucide-react"
import { TeamSwitcher } from "./team-switcher"
import { NavUserArtist } from "./artist-nav-user"
import { NavMainArtist } from "./artist-nav-main"


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
      url: "/dashboard-artist",
      icon: <HomeIcon className="h-5 w-5" />,
    },

    // {
    //   title: "Genres",
    //   url: "/dashboard/genres",
    //   icon: <TagIcon className="h-5 w-5" />,
    // },
    {
      title: "Albums",
      url: "/dashboard-artist/albums-artist",
      icon: <Disc3Icon className="h-5 w-5" />,
    },
    
    {
      title: "Songs",
      url: "/dashboard-artist/artistSong",
      icon: <ListMusicIcon className="h-5 w-5" />,
    },
    // {
    //   title: "History",
    //   url: "/history",
    //   icon: <ClockIcon className="h-5 w-5" />,
    // },
    // {
    //   title: "Search",
    //   url: "/search",
    //   icon: <SearchIcon className="h-5 w-5" />,
    // },
    {
      title: "Analytics",
      url: "/analytics",
      icon: <BarChart3Icon className="h-5 w-5" />,
    },
    // {
    //   title: "Notifications",
    //   url: "/notifications",
    //   icon: <BellIcon className="h-5 w-5" />,
    // },
  ],
}

export function ArtistAppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
      <SidebarContent className="py-6">
        <NavMainArtist items={data.navMain} />
      </SidebarContent>

      {/* Footer with Profile & Logout */}
      <SidebarFooter className="border-t border-zinc-800 ">
        <NavUserArtist user={data.user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}