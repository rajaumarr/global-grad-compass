
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin, DollarSign, Award, CheckCircle, Heart, GitCompare } from "lucide-react"
import { useSavedUniversities } from "@/hooks/useSavedUniversities"
import { useUniversityComparison } from "@/hooks/useUniversityComparison"
import { useToast } from "@/hooks/use-toast"
import type { University } from "@/hooks/useUniversities"

interface UniversityCardProps {
  university: University
}

export function UniversityCard({ university }: UniversityCardProps) {
  const navigate = useNavigate()
  const { isSaved, toggleSaved } = useSavedUniversities()
  const { addToComparison, isInComparison, canAddMore } = useUniversityComparison()
  const { toast } = useToast()
  
  const formatTuition = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleAddToComparison = async () => {
    const added = await addToComparison(university)
    if (added) {
      toast({
        title: "Added to comparison",
        description: `${university.name} added to comparison`
      })
    } else {
      toast({
        title: "Cannot add",
        description: "Maximum 4 universities can be compared",
        variant: "destructive"
      })
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {university.name}
            </CardTitle>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {university.city}, {university.state}
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {university.ranking && (
              <Badge variant="secondary" className="text-xs">
                #{university.ranking}
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleSaved(university.id)
              }}
              className={`${isSaved(university.id) ? 'text-red-500' : 'text-muted-foreground'} hover:text-red-500`}
            >
              <Heart className={`h-4 w-4 ${isSaved(university.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Programs */}
        {university.programs && university.programs.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2">Programs Available:</div>
            <div className="flex flex-wrap gap-1">
              {university.programs.slice(0, 2).map((program) => (
                <Badge key={program.id} variant="outline" className="text-xs">
                  {program.degree} {program.name}
                </Badge>
              ))}
              {university.programs.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{university.programs.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Tuition */}
        <div>
          <div className="text-sm font-medium mb-2 flex items-center">
            <DollarSign className="h-4 w-4 mr-1" />
            Tuition (International):
          </div>
          <div className="text-lg font-bold text-primary">
            {formatTuition(university.tuition_international)}
          </div>
          {university.has_in_state_tuition_waiver && (
            <div className="flex items-center text-sm text-success mt-1">
              <CheckCircle className="h-4 w-4 mr-1" />
              In-state tuition waiver available
            </div>
          )}
        </div>

        {/* Scholarships */}
        {university.scholarships && university.scholarships.length > 0 && (
          <div>
            <div className="text-sm font-medium mb-2 flex items-center">
              <Award className="h-4 w-4 mr-1" />
              Scholarships Available:
            </div>
            <div className="text-sm text-muted-foreground">
              {university.scholarships.length} scholarship{university.scholarships.length > 1 ? 's' : ''} available
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" className="flex-1" onClick={() => navigate(`/university/${university.id}`)}>
            View Details
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={handleAddToComparison}
            disabled={isInComparison(university.id) || !canAddMore}
          >
            <GitCompare className="h-4 w-4" />
          </Button>
          {university.website && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => window.open(university.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
