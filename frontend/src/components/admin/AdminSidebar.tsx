import {
  BadgeDollarSign, BanknoteIcon,
  BarChart3,
  Box,
  Building2, CreditCard,
  Factory,
  FileText, LogOut,
  Package,
  Ruler, Shield,
  ShoppingCart, User, UserCog,
  Users, Wallet, Wrench, Dock
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {useContext} from "react";
import {Context} from "@/main.tsx";
import {observer} from "mobx-react-lite";

const menuItems = [
  {
    title: "My Profile",
    url: "/admin/profile",
    icon: UserCog,
  },
  {
    title: "Units of Measurement",
    url: "/admin/units",
    icon: Ruler,
  },
  {
    title: "Employees",
    url: "/admin/employees",
    icon: Users,
  },
  {
    title: "Positions",
    url: "/admin/positions",
    icon: Building2,
  },
  {
    title: "Permissions",
    url: "/admin/permissions",
    icon: Shield,
  },
  {
    title: "Raw Materials",
    url: "/admin/materials",
    icon: Box,
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Package,
  },
  {
    title: "Manufacturing Instructions",
    url: "/admin/instructions",
    icon: FileText,
  },
  {
    title: "Manufacturing",
    url: "/admin/manufacturing",
    icon: Wrench,
  },
  {
    title: "Procurement History",
    url: "/admin/procurement",
    icon: Factory,
  },
  {
    title: "Product Sales",
    url: "/admin/sales",
    icon: ShoppingCart,
  },
  {
    title: "Budget",
    url: "/admin/budget",
    icon: Wallet,
  },
  {
    title: "Salary",
    url: "/admin/salary",
    icon: BadgeDollarSign,
  },
  {
    title: "Loans",
    url: "loans",
    icon: BanknoteIcon,
  },
  {
    title: "Loan Repayment",
    url: "loan-repayment",
    icon: CreditCard,
  },
  {
    title: "Report",
    url: "/admin/report",
    icon: Dock,
  },
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
  },


]

const  AdminSidebar = observer( ()=> {
  const navigate = useNavigate()
  const currentUrl = window.location.pathname
  const {employee} = useContext(Context)

  return (
      <Sidebar>
        <SidebarContent className="flex flex-col h-full">
          <SidebarGroup>
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-5 w-5" />
                {/*<span className="font-medium">{`${employee.employee.firstName[0]}.${employee.employee.middleName[0]}.${employee.employee.lastName}`}</span>*/}
              </div>
            </div>
            <SidebarGroupLabel>Admin Panel</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title} className={`${currentUrl === item.url && "bg-gray-200 border-gray-400 border"} hover:bg-gray-100`}>
                      <SidebarMenuButton asChild>
                        <div onClick={()=>navigate(item.url)} className={'cursor-pointer'}>
                          <item.icon />
                          <span>{item.title}</span>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

         <Button onClick={()=>{
           navigate('/login')
           employee.resetEmployee()
         }}>
           Log out
         </Button>

        </SidebarContent>
      </Sidebar>
  )
})

export default AdminSidebar