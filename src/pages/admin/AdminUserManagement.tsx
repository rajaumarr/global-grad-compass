import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { AccessRestricted } from "@/components/data-management/AccessRestricted"
import { UserCog, Shield, Plus, Trash2 } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AdminUser {
  id: string
  user_id: string
  role: string
  created_at: string
  email?: string
  display_name?: string
}

const AdminUserManagement = () => {
  const { loading: authLoading, isAdmin, user } = useAdminAuth()
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [newAdminEmail, setNewAdminEmail] = useState("")
  const [newAdminPassword, setNewAdminPassword] = useState("")
  const [addingAdmin, setAddingAdmin] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()

  const fetchAdminUsers = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          id,
          user_id,
          role,
          created_at
        `)
        .eq('role', 'admin')
        .order('created_at', { ascending: false })

      if (error) throw error

      // For demo purposes, we'll use placeholder data since we can't access auth.users directly
      const adminUsersWithDetails = data?.map(admin => ({
        ...admin,
        email: admin.user_id === user?.id ? user.email : `admin-${admin.user_id.slice(0, 8)}@grad.com`,
        display_name: admin.user_id === user?.id ? 'Current Admin' : 'Admin User'
      })) || []

      setAdminUsers(adminUsersWithDetails)
    } catch (error) {
      console.error('Error fetching admin users:', error)
      toast({
        title: "Error",
        description: "Failed to fetch admin users",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddAdmin = async () => {
    if (!newAdminEmail || !newAdminPassword) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    try {
      setAddingAdmin(true)

      // Create new user with admin role
      const { data, error } = await supabase.auth.signUp({
        email: newAdminEmail,
        password: newAdminPassword,
        options: {
          data: {
            display_name: 'Admin User'
          }
        }
      })

      if (error) throw error

      if (data.user) {
        // Add admin role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: data.user.id,
            role: 'admin'
          })

        if (roleError) throw roleError

        toast({
          title: "Success",
          description: "Admin user created successfully"
        })

        setNewAdminEmail("")
        setNewAdminPassword("")
        setDialogOpen(false)
        fetchAdminUsers()
      }
    } catch (error: any) {
      console.error('Error adding admin:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create admin user",
        variant: "destructive"
      })
    } finally {
      setAddingAdmin(false)
    }
  }

  const handleRemoveAdmin = async (userId: string) => {
    if (userId === user?.id) {
      toast({
        title: "Error",
        description: "You cannot remove your own admin privileges",
        variant: "destructive"
      })
      return
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'admin')

      if (error) throw error

      toast({
        title: "Success",
        description: "Admin privileges removed successfully"
      })

      fetchAdminUsers()
    } catch (error) {
      console.error('Error removing admin:', error)
      toast({
        title: "Error",
        description: "Failed to remove admin privileges",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (isAdmin) {
      fetchAdminUsers()
    }
  }, [isAdmin])

  if (authLoading || !user) {
    return <BouncingLoader message="Checking permissions..." size="sm" className="py-20" />
  }

  if (!isAdmin) {
    return <AccessRestricted />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <UserCog className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin User Management</h1>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="px-3 py-1">
              {adminUsers.length} Admins
            </Badge>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Admin
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Administrator</DialogTitle>
                  <DialogDescription>
                    Create a new admin user with full system privileges. They will receive an email confirmation.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@grad.com"
                      value={newAdminEmail}
                      onChange={(e) => setNewAdminEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Strong password..."
                      value={newAdminPassword}
                      onChange={(e) => setNewAdminPassword(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddAdmin} disabled={addingAdmin}>
                    {addingAdmin ? "Creating..." : "Create Admin"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Administrator Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <BouncingLoader message="Loading administrators..." size="sm" className="py-8" />
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Display Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Added</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No administrators found
                      </TableCell>
                    </TableRow>
                  ) : (
                    adminUsers.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className="font-medium">
                          {admin.email}
                        </TableCell>
                        <TableCell>{admin.display_name}</TableCell>
                        <TableCell>
                          <Badge variant="default">
                            <Shield className="h-3 w-3 mr-1" />
                            {admin.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(admin.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {admin.user_id !== user?.id ? (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="h-8"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Admin Privileges</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove admin privileges from this user? 
                                    They will lose access to all administrative functions.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveAdmin(admin.user_id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Remove Admin
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          ) : (
                            <Badge variant="outline">Current User</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminUserManagement