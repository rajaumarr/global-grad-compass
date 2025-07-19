import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus } from "lucide-react"

interface EmptyApplicationsStateProps {
  onAddApplication: () => void
}

export const EmptyApplicationsState = ({ onAddApplication }: EmptyApplicationsStateProps) => {
  return (
    <Card className="text-center p-12">
      <CardContent className="p-0">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
        <p className="text-muted-foreground mb-4">
          Start tracking your university applications
        </p>
        <Button onClick={onAddApplication}>
          <Plus className="h-4 w-4 mr-2" />
          Add Your First Application
        </Button>
      </CardContent>
    </Card>
  )
}