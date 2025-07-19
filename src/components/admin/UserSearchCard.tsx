import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface UserSearchCardProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export const UserSearchCard = ({ searchTerm, onSearchChange }: UserSearchCardProps) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-md"
        />
      </CardContent>
    </Card>
  )
}