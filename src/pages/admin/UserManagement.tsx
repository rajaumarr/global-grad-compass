import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { AccessRestricted } from "@/components/data-management/AccessRestricted"
import { Header } from "@/components/Header"
import { UserManagementHeader } from "@/components/admin/UserManagementHeader"
import { UserSearchCard } from "@/components/admin/UserSearchCard"
import { UsersTable } from "@/components/admin/UsersTable"

interface User {
  id: string
  email: string
  created_at: string
  email_confirmed_at?: string
  last_sign_in_at?: string
  profile?: {
    display_name?: string
    academic_background?: string
    gpa?: number
    created_at?: string
  }
}

const UserManagement = () => {
  const { loading: authLoading, isAdmin, user } = useAdminAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: { action: 'get_users' }
      })

      if (error) throw error

      if (data.success) {
        setUsers(data.users || [])
      } else {
        throw new Error(data.error || 'Failed to fetch users')
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('user-management', {
        body: { 
          action: 'delete_user',
          userId: userId
        }
      })

      if (error) throw error

      if (data.success) {
        toast({
          title: "Success",
          description: "User deleted successfully"
        })
        // Refresh users list
        fetchUsers()
      } else {
        throw new Error(data.error || 'Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchUsers()
    }
  }, [isAdmin])

  if (authLoading || !user) {
    return <BouncingLoader message="Checking permissions..." size="sm" className="py-20" />
  }

  if (!isAdmin) {
    return <AccessRestricted />
  }

  const filteredUsers = users.filter(user =>
    user.profile?.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <UserManagementHeader userCount={users.length} />
          <UserSearchCard 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
          <UsersTable 
            users={users}
            filteredUsers={filteredUsers}
            loading={loading}
            onDeleteUser={handleDeleteUser}
          />
        </div>
      </div>
    </div>
  )
}

export default UserManagement