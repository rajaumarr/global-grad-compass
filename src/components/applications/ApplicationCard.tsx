import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Trash2 } from "lucide-react"

interface Application {
  id: string
  university_name: string
  program_name: string
  degree_type: string
  application_deadline: string
  status: 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted'
  notes?: string
}

interface ApplicationCardProps {
  application: Application
  statusColors: Record<string, string>
  onStatusUpdate: (id: string, status: string) => void
  onDelete: (id: string) => void
}

export const ApplicationCard = ({
  application,
  statusColors,
  onStatusUpdate,
  onDelete
}: ApplicationCardProps) => {
  return (
    <Card 
      className="border-l-4" 
      style={{ borderLeftColor: statusColors[application.status].replace('bg-', '') }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold">{application.university_name}</h4>
            <p className="text-sm text-muted-foreground">{application.program_name}</p>
            {application.degree_type && (
              <Badge variant="outline" className="text-xs mt-1">
                {application.degree_type}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-3">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-1" />
          Deadline: {new Date(application.application_deadline).toLocaleDateString()}
        </div>
        
        {application.notes && (
          <p className="text-sm text-muted-foreground">{application.notes}</p>
        )}

        <div className="flex items-center space-x-2">
          <Select 
            value={application.status} 
            onValueChange={(value) => onStatusUpdate(application.id, value)}
          >
            <SelectTrigger className="text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="waitlisted">Waitlisted</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onDelete(application.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}