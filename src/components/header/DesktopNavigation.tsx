import { Search, Sparkles, Users, Building2, Database, UserCog } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { NavLink } from "./NavLink"
import { useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"

export const DesktopNavigation = () => {
  const { user, profile } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return

      const { data: userRoles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single()

      setIsAdmin(!!userRoles)
    }

    checkAdminStatus()
  }, [user])

  // Admin Navigation
  if (user && isAdmin) {
    return (
      <nav className="hidden lg:flex items-center space-x-8">
        <NavLink href="/admin/users">
          <span className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>User Management</span>
          </span>
        </NavLink>
        <NavLink href="/admin/universities">
          <span className="flex items-center space-x-1">
            <Building2 className="h-4 w-4" />
            <span>Universities</span>
          </span>
        </NavLink>
        <NavLink href="/data-management">
          <span className="flex items-center space-x-1">
            <Database className="h-4 w-4" />
            <span>Data Management</span>
          </span>
        </NavLink>
        <NavLink href="/admin/admin-users">
          <span className="flex items-center space-x-1">
            <UserCog className="h-4 w-4" />
            <span>Admin Users</span>
          </span>
        </NavLink>
      </nav>
    )
  }

  // Student Navigation
  return (
    <nav className="hidden lg:flex items-center space-x-8">
      <NavLink href="/">
        <span className="flex items-center space-x-1">
          <Search className="h-4 w-4" />
          <span>Universities</span>
        </span>
      </NavLink>
      
      {user && (
        <>
          <NavLink href="/recommendations">
            <span className="flex items-center space-x-1">
              <Sparkles className="h-4 w-4" />
              <span>Recommendations</span>
            </span>
          </NavLink>
          <NavLink href="/gap-analysis">
            <span className="flex items-center space-x-1">
              <span>Gap Analysis</span>
              {profile && <Badge variant="secondary" className="text-xs ml-1">Smart</Badge>}
            </span>
          </NavLink>
          <NavLink href="/compare">Compare</NavLink>
          <NavLink href="/applications">
            <span className="flex items-center space-x-1">
              <span>Applications</span>
              <Badge variant="outline" className="text-xs ml-1">Track</Badge>
            </span>
          </NavLink>
        </>
      )}
      
      <NavLink href="/scholarships">Scholarships</NavLink>
    </nav>
  )
}