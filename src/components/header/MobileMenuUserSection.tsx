import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface MobileMenuUserSectionProps {
  user: any
  profile: any
  onMenuClose: () => void
  onSignOut: () => void
}

export const MobileMenuUserSection = ({ user, profile, onMenuClose, onSignOut }: MobileMenuUserSectionProps) => {
  const navigate = useNavigate()

  if (user) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-medium">{profile?.display_name || 'User'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="w-full" onClick={() => {
          onMenuClose()
          navigate("/profile")
        }}>
          <User className="h-4 w-4 mr-2" />
          Profile Settings
        </Button>
        <Button variant="outline" size="sm" className="w-full text-red-600" onClick={() => {
          onMenuClose()
          onSignOut()
        }}>
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
        onClick={() => {
          onMenuClose()
          navigate("/auth")
        }}
      >
        Sign In
      </Button>
      <Button 
        size="sm" 
        className="w-full bg-gradient-to-r from-primary to-accent"
        onClick={() => {
          onMenuClose()
          navigate("/auth")
        }}
      >
        <User className="h-4 w-4 mr-2" />
        Get Started
      </Button>
    </div>
  )
}