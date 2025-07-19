import { useState } from "react"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useAuth } from "@/contexts/AuthContext"
import { useApplicationTracking } from "@/hooks/useApplicationTracking"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, FileText } from "lucide-react"
import { UpcomingDeadlines } from "@/components/applications/UpcomingDeadlines"
import { AddApplicationDialog } from "@/components/applications/AddApplicationDialog"
import { ApplicationsByStatus } from "@/components/applications/ApplicationsByStatus"
import { EmptyApplicationsState } from "@/components/applications/EmptyApplicationsState"
import { SignInRequired } from "@/components/applications/SignInRequired"

const ApplicationTracker = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { 
    applications, 
    loading, 
    addApplication, 
    updateApplication, 
    deleteApplication,
    getApplicationsByStatus,
    getUpcomingDeadlines
  } = useApplicationTracking()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newApplication, setNewApplication] = useState({
    university_name: '',
    program_name: '',
    degree_type: '',
    application_deadline: '',
    status: 'planning' as const,
    notes: ''
  })

  const statusColors = {
    planning: 'bg-gray-500',
    in_progress: 'bg-blue-500',
    submitted: 'bg-yellow-500',
    accepted: 'bg-green-500',
    rejected: 'bg-red-500',
    waitlisted: 'bg-orange-500'
  }

  const statusIcons = {
    planning: Clock,
    in_progress: FileText,
    submitted: CheckCircle,
    accepted: CheckCircle,
    rejected: XCircle,
    waitlisted: AlertCircle
  }

  const handleAddApplication = async () => {
    if (!newApplication.university_name || !newApplication.program_name || !newApplication.application_deadline) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      await addApplication({
        ...newApplication,
        university_id: crypto.randomUUID() // Temporary ID
      })
      
      setNewApplication({
        university_name: '',
        program_name: '',
        degree_type: '',
        application_deadline: '',
        status: 'planning',
        notes: ''
      })
      setIsAddDialogOpen(false)
      
      toast({
        title: "Success",
        description: "Application added successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add application",
        variant: "destructive"
      })
    }
  }

  const handleStatusUpdate = async (id: string, status: string) => {
    await updateApplication(id, { status: status as any })
    toast({
      title: "Updated",
      description: "Application status updated"
    })
  }

  const handleUpdateNewApplication = (updates: Partial<typeof newApplication>) => {
    setNewApplication(prev => ({ ...prev, ...updates }))
  }

  const upcomingDeadlines = getUpcomingDeadlines(30)

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <SignInRequired onNavigateToAuth={() => navigate("/auth")} />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BouncingLoader message="Loading your applications..." className="py-32" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Application Tracker</h1>
              <p className="text-muted-foreground">
                Track your university applications and deadlines
              </p>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Application
                </Button>
              </DialogTrigger>
              <AddApplicationDialog
                isOpen={isAddDialogOpen}
                onClose={() => setIsAddDialogOpen(false)}
                newApplication={newApplication}
                onUpdateApplication={handleUpdateNewApplication}
                onAddApplication={handleAddApplication}
              />
            </Dialog>
          </div>

          <UpcomingDeadlines upcomingDeadlines={upcomingDeadlines} />

          {applications.length === 0 ? (
            <EmptyApplicationsState onAddApplication={() => setIsAddDialogOpen(true)} />
          ) : (
            <ApplicationsByStatus
              applications={applications}
              statusIcons={statusIcons}
              statusColors={statusColors}
              getApplicationsByStatus={getApplicationsByStatus}
              onStatusUpdate={handleStatusUpdate}
              onDelete={deleteApplication}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default ApplicationTracker