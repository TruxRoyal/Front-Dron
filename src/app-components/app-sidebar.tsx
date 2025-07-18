import * as React from "react"
import { GalleryVerticalEnd, Gamepad2, MapPinned, House, Cog, Film } from "lucide-react"
import DashboardView from '../views/Dashboard/Dashboard'
import { Link, useLocation } from "react-router-dom"


import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
const data = {
  navMain: [
    {
      title: "Getting Started",
      url: "#",
      items: [
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
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  return (
    <Sidebar 
      {...props}
      className="!bg-[oklch(0.6245_0.1879_158.52)] text-white"
      >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div
                  className="text-white flex aspect-square size-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: "white" }}
                >
                  <GalleryVerticalEnd className="size-4 text-[hsl(161.4,93.5%,30.4%)]" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span>v1.0.0</span>
                </div>
              </Link>

            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link to = {item.url} className="font-medium">
                    {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.items?.length > 0 && (
                  <SidebarMenuSub>
                    {item.items.map((subitem) => (
                      <SidebarMenuSubItem key={subitem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={location.pathname === subitem.url}
                        >
                          <Link to={subitem.url} className="flex items-center gap-2">
                            {subitem.icon}
                            <span>{subitem.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) }
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}

