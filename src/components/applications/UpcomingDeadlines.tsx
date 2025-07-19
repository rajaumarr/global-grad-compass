import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Application {
  id: string
  university_name: string
  program_name: string
  application_deadline: string
}

interface UpcomingDeadlinesProps {
  upcomingDeadlines: Application[]
}

export const UpcomingDeadlines = ({ upcomingDeadlines }: UpcomingDeadlinesProps) => {
  if (upcomingDeadlines.length === 0) return null

  return (
    <Card className="border-l-4 border-l-orange-500">
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 text-orange-500" />
          Upcoming Deadlines (Next 30 Days)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {upcomingDeadlines.slice(0, 5).map((app) => (
            <div key={app.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <div className="font-medium">{app.university_name}</div>
                <div className="text-sm text-muted-foreground">{app.program_name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{new Date(app.application_deadline).toLocaleDateString()}</div>
                <div className="text-sm text-muted-foreground">
                  {Math.ceil((new Date(app.application_deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}