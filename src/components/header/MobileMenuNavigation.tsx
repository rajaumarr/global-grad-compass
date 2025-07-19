import { Search, Sparkles, Users, Building2, Database, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { NavLink } from "./NavLink"

interface MobileMenuNavigationProps {
  user: any
  isAdmin: boolean
  onLinkClick: () => void
}

export const MobileMenuNavigation = ({ user, isAdmin, onLinkClick }: MobileMenuNavigationProps) => {
  if (user && isAdmin) {
    return (
      <>
        <NavLink href="/admin/users" onClick={onLinkClick}>
          <div className="flex items-center space-x-3 p-2">
            <Users className="h-5 w-5 text-primary" />
            <span>User Management</span>
          </div>
        </NavLink>
        <NavLink href="/admin/universities" onClick={onLinkClick}>
          <div className="flex items-center space-x-3 p-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span>Universities</span>
          </div>
        </NavLink>
        <NavLink href="/data-management" onClick={onLinkClick}>
          <div className="flex items-center space-x-3 p-2">
            <Database className="h-5 w-5 text-primary" />
            <span>Data Management</span>
          </div>
        </NavLink>
        <NavLink href="/admin/admin-users" onClick={onLinkClick}>
          <div className="flex items-center space-x-3 p-2">
            <UserCog className="h-5 w-5 text-primary" />
            <span>Admin Users</span>
          </div>
        </NavLink>
      </>
    )
  }

  return (
    <>
      <NavLink href="/" onClick={onLinkClick}>
        <div className="flex items-center space-x-3 p-2">
          <Search className="h-5 w-5 text-primary" />
          <span>Universities</span>
        </div>
      </NavLink>
      
      {user && (
        <>
          <NavLink href="/recommendations" onClick={onLinkClick}>
            <div className="flex items-center space-x-3 p-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>Recommendations</span>
              <Badge variant="secondary" className="text-xs ml-auto">AI</Badge>
            </div>
          </NavLink>
          <NavLink href="/gap-analysis" onClick={onLinkClick}>
            <div className="flex items-center space-x-3 p-2">
              <span>Gap Analysis</span>
            </div>
          </NavLink>
          <NavLink href="/compare" onClick={onLinkClick}>
            <div className="flex items-center space-x-3 p-2">
              <span>Compare Universities</span>
            </div>
          </NavLink>
          <NavLink href="/applications" onClick={onLinkClick}>
            <div className="flex items-center space-x-3 p-2">
              <span>Applications</span>
              <Badge variant="outline" className="text-xs ml-auto">Track</Badge>
            </div>
          </NavLink>
        </>
      )}
      
      <NavLink href="/scholarships" onClick={onLinkClick}>
        <div className="flex items-center space-x-3 p-2">
          <span>Scholarships</span>
        </div>
      </NavLink>
    </>
  )
}