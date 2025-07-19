import { useAuth } from "@/contexts/AuthContext"
import { useUniversityComparison } from "@/hooks/useUniversityComparison"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import { 
  X, 
  MapPin, 
  DollarSign, 
  GraduationCap, 
  Award, 
  TrendingUp,
  Users,
  Building,
  Globe
} from "lucide-react"

const UniversityComparison = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { comparedUniversities, removeFromComparison, clearComparison } = useUniversityComparison()

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Sign in to compare universities
              </p>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (comparedUniversities.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>No Universities to Compare</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Add universities to your comparison from the main page
              </p>
              <Button onClick={() => navigate("/")} className="w-full">
                Browse Universities
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">University Comparison</h1>
            <p className="text-muted-foreground">
              Compare {comparedUniversities.length} universities side by side
            </p>
          </div>
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-max">
            <div className={`grid gap-6`} style={{
              gridTemplateColumns: `repeat(${Math.min(comparedUniversities.length, 4)}, minmax(300px, 1fr))`
            }}>
              {comparedUniversities.slice(0, 4).map((university) => (
                <Card key={university.id} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => removeFromComparison(university.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <CardHeader>
                    <CardTitle className="text-lg pr-8">{university.name}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{university.city}, {university.state}</span>
                    </div>
                    {university.ranking && (
                      <Badge variant="secondary">Rank #{university.ranking}</Badge>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Tuition */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        Tuition
                      </h4>
                      <div className="space-y-1 text-sm">
                        <div>International: ${university.tuition_international.toLocaleString()}</div>
                      </div>
                    </div>

                    <Separator />

                    {/* Programs */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <GraduationCap className="h-4 w-4 mr-2" />
                        Programs
                      </h4>
                      <div className="space-y-2">
                        {university.programs?.slice(0, 3).map((program, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="font-medium">{program.name}</div>
                            <div className="text-muted-foreground">{program.department}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {program.degree}
                            </Badge>
                          </div>
                        )) || <p className="text-sm text-muted-foreground">No programs listed</p>}
                        {university.programs && university.programs.length > 3 && (
                          <p className="text-xs text-muted-foreground">
                            +{university.programs.length - 3} more programs
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Scholarships */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Scholarships
                      </h4>
                      <div className="space-y-2">
                        {university.scholarships?.slice(0, 2).map((scholarship, idx) => (
                          <div key={idx} className="text-sm">
                            <div className="font-medium">{scholarship.name}</div>
                            <div className="text-muted-foreground">
                              {scholarship.amount_type}: {scholarship.amount_value ? `$${scholarship.amount_value.toLocaleString()}` : 'Variable'}
                            </div>
                          </div>
                        )) || <p className="text-sm text-muted-foreground">No scholarships listed</p>}
                        {university.scholarships && university.scholarships.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{university.scholarships.length - 2} more scholarships
                          </p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Quick Stats */}
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Quick Stats
                      </h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-muted-foreground">Programs</div>
                          <div className="font-medium">{university.programs?.length || 0}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Scholarships</div>
                          <div className="font-medium">{university.scholarships?.length || 0}</div>
                        </div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => navigate(`/university/${university.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {comparedUniversities.length > 4 && (
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Showing first 4 universities. Remove some to see others.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default UniversityComparison