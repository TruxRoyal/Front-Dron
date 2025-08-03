import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/app-components/app-sidebar"
import { SiteHeader } from "@/app-components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
          <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
}
