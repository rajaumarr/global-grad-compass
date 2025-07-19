import { User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import { UserDropdown } from "./UserDropdown"
import { ThemeToggle } from "@/components/ThemeToggle"

export const DesktopActions = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="hidden lg:flex items-center space-x-3">
      <ThemeToggle />
      {user ? (
        <div className="flex items-center space-x-3">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="hover:bg-primary/10 transition-all duration-200"
          >
            Sign In
          </Button>
          <Button 
            size="sm" 
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-200 hover:scale-105"
          >
            <User className="h-4 w-4 mr-2" />
            Get Started
          </Button>
        </div>
      )}
    </div>
  )
}