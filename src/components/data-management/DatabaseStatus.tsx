import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DatabaseStatusProps {
  dbStats: {
    universities: number
    programs: number
    scholarships: number
  }
}

export const DatabaseStatus = ({ dbStats }: DatabaseStatusProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Database Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <Badge variant="secondary">{dbStats.universities} Universities</Badge>
          <Badge variant="outline">{dbStats.programs} Programs</Badge>
          <Badge variant="outline">{dbStats.scholarships} Scholarships</Badge>
        </div>
        {dbStats.universities === 0 ? (
          <p className="text-sm text-muted-foreground">
            No universities in database. Use the buttons above to add comprehensive university data.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Click the buttons above to add more universities and expand your database.
          </p>
        )}
      </CardContent>
    </Card>
  )
}