import { Button } from "@/components/ui/button"
import { TableCell, TableRow } from "@/components/ui/table"
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
import { UserX } from "lucide-react"

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

interface UserTableRowProps {
  user: User
  onDeleteUser: (userId: string) => void
}

export const UserTableRow = ({ user, onDeleteUser }: UserTableRowProps) => {
  return (
    <TableRow key={user.id}>
      <TableCell className="font-medium">
        {user.profile?.display_name || 'Not set'}
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        {user.profile?.academic_background || 'Not specified'}
      </TableCell>
      <TableCell>
        {new Date(user.created_at).toLocaleDateString()}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <div className="text-xs text-muted-foreground space-y-1">
            {user.email_confirmed_at && (
              <div>✓ Email verified</div>
            )}
            {user.last_sign_in_at && (
              <div>Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</div>
            )}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 ml-2"
              >
                <UserX className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete User</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this user? This action cannot be undone.
                  All user data including profiles, applications, and saved universities will be permanently deleted.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDeleteUser(user.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete User
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  )
}