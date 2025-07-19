import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { UserTableRow } from "./UserTableRow"

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

interface UsersTableProps {
  users: User[]
  filteredUsers: User[]
  loading: boolean
  onDeleteUser: (userId: string) => void
}

export const UsersTable = ({ users, filteredUsers, loading, onDeleteUser }: UsersTableProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Registered Users</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <BouncingLoader message="Loading users..." size="sm" className="py-8" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Academic Background</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {users.length === 0 ? "No users found in the system" : "No users match your search"}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <UserTableRow 
                    key={user.id}
                    user={user} 
                    onDeleteUser={onDeleteUser} 
                  />
                ))
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}