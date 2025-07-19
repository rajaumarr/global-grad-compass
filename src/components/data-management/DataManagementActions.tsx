import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Sparkles } from "lucide-react"

interface DataManagementActionsProps {
  onGenerateSample: () => void
  onGenerateComprehensive: () => void
  loading: boolean
}

export const DataManagementActions = ({ 
  onGenerateSample, 
  onGenerateComprehensive, 
  loading 
}: DataManagementActionsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Generate Sample Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Add 2 high-quality sample universities (Caltech & UW) with detailed programs and scholarships.
          </p>
          <Button 
            onClick={onGenerateSample}
            disabled={loading}
            className="w-full"
          >
            <Database className="h-4 w-4 mr-2" />
            Generate Sample Universities
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Generate Comprehensive Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Generate 100 diverse universities across all US states with complete program and scholarship data.
          </p>
          <Button 
            onClick={onGenerateComprehensive}
            disabled={loading}
            className="w-full"
            variant="default"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate 100 Universities
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}