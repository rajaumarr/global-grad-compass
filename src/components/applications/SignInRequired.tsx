import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface SignInRequiredProps {
  onNavigateToAuth: () => void
}

export const SignInRequired = ({ onNavigateToAuth }: SignInRequiredProps) => {
  return (
    <div className="container mx-auto px-4 py-20 text-center">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Sign In Required</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Sign in to track your applications
          </p>
          <Button onClick={onNavigateToAuth} className="w-full">
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}