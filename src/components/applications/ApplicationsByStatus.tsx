import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ApplicationCard } from "./ApplicationCard"

interface Application {
  id: string
  university_name: string
  program_name: string
  degree_type: string
  application_deadline: string
  status: 'planning' | 'in_progress' | 'submitted' | 'accepted' | 'rejected' | 'waitlisted'
  notes?: string
}

interface ApplicationsByStatusProps {
  applications: Application[]
  statusIcons: Record<string, any>
  statusColors: Record<string, string>
  getApplicationsByStatus: (status: Application['status']) => Application[]
  onStatusUpdate: (id: string, status: string) => void
  onDelete: (id: string) => void
}

export const ApplicationsByStatus = ({
  applications,
  statusIcons,
  statusColors,
  getApplicationsByStatus,
  onStatusUpdate,
  onDelete
}: ApplicationsByStatusProps) => {
  const statuses = ['planning', 'in_progress', 'submitted', 'accepted', 'rejected', 'waitlisted'] as const

  return (
    <div className="space-y-6">
      {statuses.map((status) => {
        const statusApps = getApplicationsByStatus(status)
        if (statusApps.length === 0) return null

        const StatusIcon = statusIcons[status]

        return (
          <Card key={status}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <StatusIcon className="h-5 w-5 mr-2" />
                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ({statusApps.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {statusApps.map((app) => (
                  <ApplicationCard
                    key={app.id}
                    application={app}
                    statusColors={statusColors}
                    onStatusUpdate={onStatusUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}