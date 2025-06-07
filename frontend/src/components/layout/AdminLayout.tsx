import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar.tsx"
import { Outlet } from "react-router-dom"
import {Toaster} from "@/components/ui/sonner.tsx";
import AdminSidebar from "@/components/admin/AdminSidebar.tsx";


export default function AdminLayout() {
  return (
      <SidebarProvider>
          <div className="min-h-screen flex w-full bg-background">
              <Toaster position={'top-center'}/>
              <AdminSidebar />
              <main className="flex-1 overflow-auto">
                  <div className="p-4 md:p-6">
                      <div className="md:hidden mb-4">
                          <SidebarTrigger />
                      </div>
                      <Outlet />
                  </div>
              </main>
          </div>
      </SidebarProvider>
  )
}