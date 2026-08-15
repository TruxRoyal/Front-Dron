import * as React from "react"
import { Gamepad2, MapPinned, House, Cog, Film, Drone } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { ModeToggle } from "./mode-toggle"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <House />
    },
    {
      title: "Control",
      url: "/control",
      icon: <Gamepad2 />
    },
    {
      title: "Autopilot",
      url: "/autopilot",
      icon: <MapPinned />
    },
    {
      title: "Media",
      url: "/flightmissions",
      icon: <Film />
    },
    {
      title: "Sistema",
      url: "/sistema",
      icon: <Cog />
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  return (
    <Sidebar
      collapsible="offcanvas" {...props} className="text-white"
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <Drone className="!size-5" />
                <span className="text-base font-semibold">AgroTello</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive}>
                    <Link to={item.url} className="flex items-center gap-2 font-medium">
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <div className="p-4 mt-auto flex justify-end">
        <ModeToggle />
      </div>
    </Sidebar>
  )
}

