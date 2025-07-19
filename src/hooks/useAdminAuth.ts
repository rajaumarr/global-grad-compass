import { useState, useEffect, useRef } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"

// Cache admin status to avoid repeated DB calls
const adminCache = new Map<string, boolean>()

export const useAdminAuth = () => {
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState(null)
  const { toast } = useToast()
  const navigate = useNavigate()
  const hasShownToast = useRef(false)

  const checkAuth = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        if (!hasShownToast.current) {
          toast({
            title: "Access Denied",
            description: "You must be logged in to access this page",
            variant: "destructive"
          })
          hasShownToast.current = true
        }
        navigate("/auth")
        return
      }

      setUser(user)
      
      // Check cache first
      if (adminCache.has(user.id)) {
        setIsAdmin(adminCache.get(user.id)!)
        setLoading(false)
        return
      }
      
      // Check if user has admin role
      const { data: userRoles, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle()

      const adminStatus = !error && !!userRoles
      
      // Cache the result
      adminCache.set(user.id, adminStatus)
      setIsAdmin(adminStatus)

      if (error) {
        console.error('Error checking admin role:', error)
        if (!hasShownToast.current) {
          toast({
            title: "Error",
            description: "Failed to verify admin privileges",
            variant: "destructive"
          })
          hasShownToast.current = true
        }
      } else if (!userRoles && !hasShownToast.current) {
        toast({
          title: "Access Restricted", 
          description: "This page requires administrator privileges.",
          variant: "destructive"
        })
        hasShownToast.current = true
      }
      
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsAdmin(false)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return { loading, isAdmin, user }
}