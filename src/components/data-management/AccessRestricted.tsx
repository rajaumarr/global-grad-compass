import { Card, CardContent } from "@/components/ui/card"
import { Shield } from "lucide-react"

export const AccessRestricted = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Access Restricted</h2>
          </div>
          <p className="text-muted-foreground mt-2">
            This page is only accessible to administrators.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}