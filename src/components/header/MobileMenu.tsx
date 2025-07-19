import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { MobileMenuButton } from "./MobileMenuButton"
import { MobileMenuOverlay } from "./MobileMenuOverlay"

export const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

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

  const handleSignOut = async () => {
    const { error } = await signOut()
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      })
    } else {
      navigate("/")
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      })
    }
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <>
      <MobileMenuButton 
        isMenuOpen={isMenuOpen} 
        onToggle={handleMenuToggle} 
      />

      {isMenuOpen && (
        <MobileMenuOverlay
          user={user}
          profile={profile}
          isAdmin={isAdmin}
          onMenuClose={handleMenuClose}
          onSignOut={handleSignOut}
        />
      )}
    </>
  )
}