import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { DataManagementActions } from "@/components/data-management/DataManagementActions"
import { DatabaseStatus } from "@/components/data-management/DatabaseStatus"
import { AccessRestricted } from "@/components/data-management/AccessRestricted"
import { useAdminAuth } from "@/hooks/useAdminAuth"
import { useDatabaseStats } from "@/hooks/useDatabaseStats"
import { useDataGeneration } from "@/hooks/useDataGeneration"
import { AlertTriangle } from "lucide-react"

const DataManagement = () => {
  const { loading: authLoading, isAdmin, user } = useAdminAuth()
  const { dbStats, refetchStats } = useDatabaseStats(isAdmin)
  const { loading, generateSampleData, generateComprehensiveData } = useDataGeneration(dbStats, refetchStats)

  if (authLoading || !user) {
    return <BouncingLoader message="Checking permissions..." size="sm" className="py-20" />
  }

  if (!isAdmin) {
    return <AccessRestricted />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">University Data Management</h1>
        
        <Alert className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Admin Access Only:</strong> This page allows generating and managing university data. 
            The generated data includes real university names with accurate information and prevents duplicates.
            Only users with administrator role (admin@grad.com) can access this functionality.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6">
          <DataManagementActions
            onGenerateSample={generateSampleData}
            onGenerateComprehensive={generateComprehensiveData}
            loading={loading}
          />

          <Card>
            <CardHeader>
              <CardTitle>Update Existing Universities</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Enhance existing universities with comprehensive program details including duration, 
                credit hours, specializations, career outcomes, and industry partnerships.
              </p>
              <Button 
                onClick={() => window.location.href = '/admin/update-data'}
                variant="outline"
                className="w-full"
              >
                Update University Data
              </Button>
            </CardContent>
          </Card>

          <DatabaseStatus dbStats={dbStats} />
        </div>
      </div>
    </div>
  )
}

export default DataManagement