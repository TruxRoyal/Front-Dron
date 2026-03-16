import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/app-components/app-sidebar";
import { SiteHeader } from "@/app-components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset className="h-screen overflow-hidden">
        <div className="flex h-full min-h-0 flex-col">
          <SiteHeader />
          <main className="flex-1 min-h-0 overflow-hidden">
            <Outlet />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}