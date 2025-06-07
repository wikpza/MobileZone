import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"

// Sample user data
const userData = {
  name: "John Doe",
  email: "demo@example.com",
  joinDate: "January 15, 2024",
  recentOrders: [
    { id: 1, product: "MobileZone X1", date: "2024-01-20", status: "Delivered" },
    { id: 2, product: "MobileZone Pro", date: "2024-01-25", status: "Processing" },
  ],
  shippingAddress: "123 Main St, City, Country",
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleLogout = () => {
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>View and manage your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Personal Details</h3>
                <div className="space-y-2">
                  <p><span className="text-muted-foreground">Name:</span> {userData.name}</p>
                  <p><span className="text-muted-foreground">Email:</span> {userData.email}</p>
                  <p><span className="text-muted-foreground">Member since:</span> {userData.joinDate}</p>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                <p>{userData.shippingAddress}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {userData.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{order.product}</p>
                      <p className="text-sm text-muted-foreground">Ordered on {order.date}</p>
                    </div>
                    <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button variant="destructive" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
}