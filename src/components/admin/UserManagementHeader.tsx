import { Badge } from "@/components/ui/badge"
import { Users } from "lucide-react"

interface UserManagementHeaderProps {
  userCount: number
}

export const UserManagementHeader = ({ userCount }: UserManagementHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">User Management</h1>
      </div>
      <Badge variant="secondary" className="px-3 py-1">
        {userCount} Total Users
      </Badge>
    </div>
  )
}