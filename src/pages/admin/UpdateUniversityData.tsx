import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { AccessRestricted } from "@/components/data-management/AccessRestricted"
import { RefreshCw, Database, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const UpdateUniversityData = () => {
  const { loading: authLoading, isAdmin, user } = useAdminAuth()
  const [updating, setUpdating] = useState(false)
  const [updateResult, setUpdateResult] = useState<any>(null)
  const { toast } = useToast()

  const updateExistingUniversities = async () => {
    setUpdating(true)
    setUpdateResult(null)
    
    try {
      const { data, error } = await supabase.functions.invoke('data-import-tool', {
        body: { 
          action: 'update_existing_programs',
          options: { comprehensive: true }
        }
      })

      if (error) throw error

      setUpdateResult(data)
      toast({
        title: "Update Successful!",
        description: `Updated ${data.updated_universities} universities with comprehensive program data`,
        duration: 5000
      })
    } catch (error: any) {
      console.error('Error updating universities:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to update university data",
        variant: "destructive"
      })
    } finally {
      setUpdating(false)
    }
  }

  if (authLoading || !user) {
    return <BouncingLoader message="Checking permissions..." size="sm" className="py-20" />
  }

  if (!isAdmin) {
    return <AccessRestricted />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <RefreshCw className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Update University Data</h1>
        </div>

        <Alert className="mb-6">
          <Database className="h-4 w-4" />
          <AlertDescription>
            This tool will update existing universities in the database with comprehensive program details including:
            duration, credit hours, requirements, specializations, career outcomes, and more detailed information.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Enhance Existing University Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              This will update all existing universities with:
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
              <li>Comprehensive program details (duration, credit hours, specializations)</li>
              <li>Detailed admission requirements</li>
              <li>Career outcome statistics</li>
              <li>Faculty information and research opportunities</li>
              <li>Industry partnerships and internship data</li>
              <li>Program format options (on-campus, online, hybrid)</li>
            </ul>
            
            <Button 
              onClick={updateExistingUniversities}
              disabled={updating}
              className="w-full mt-6"
              size="lg"
            >
              {updating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating Universities...
                </>
              ) : (
                <>
                  <Database className="h-4 w-4 mr-2" />
                  Update All Universities
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {updateResult && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Update Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p><strong>Universities Updated:</strong> {updateResult.updated_universities || 0}</p>
                <p><strong>Programs Enhanced:</strong> {updateResult.programs_updated || 0}</p>
                <p><strong>Scholarships Added:</strong> {updateResult.scholarships_added || 0}</p>
                {updateResult.details && (
                  <div className="mt-4">
                    <p className="font-semibold mb-2">Update Details:</p>
                    <pre className="bg-muted p-3 rounded text-sm overflow-auto">
                      {JSON.stringify(updateResult.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default UpdateUniversityData