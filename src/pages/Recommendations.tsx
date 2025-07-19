import { useAuth } from "@/contexts/AuthContext"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useUniversities } from "@/hooks/useUniversities"
import { usePersonalizedRecommendations } from "@/hooks/usePersonalizedRecommendations"
import { Header } from "@/components/Header"
import { UniversityCard } from "@/components/UniversityCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Target, TrendingUp, Star, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Recommendations = () => {
  const { user, profile, loading: authLoading } = useAuth()
  const { universities, loading: universitiesLoading } = useUniversities()
  const recommendations = usePersonalizedRecommendations(universities)
  const navigate = useNavigate()

  if (authLoading || universitiesLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BouncingLoader message="Finding perfect universities for you..." className="py-32" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>
                You need to sign in to view personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/auth")} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
              <CardDescription>
                Complete your profile to get personalized university recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/profile")} className="w-full">
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const hasProfileData = profile.preferred_states?.length || 
                         profile.preferred_degree_types?.length || 
                         profile.target_programs?.length || 
                         profile.max_tuition_budget ||
                         profile.gpa

  if (!hasProfileData) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Add Your Preferences</CardTitle>
              <CardDescription>
                Add your academic preferences and requirements to get personalized recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/profile")} className="w-full">
                Add Preferences
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
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">
              Personalized Recommendations
            </h1>
            <p className="text-muted-foreground mb-6">
              Universities matched to your academic profile and preferences
            </p>
          </div>

          {/* Profile Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Your Profile Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Academic Scores</h4>
                  <div className="space-y-1 text-sm">
                    {profile.gpa && <div>GPA: {profile.gpa}</div>}
                    {profile.gre_verbal && profile.gre_quantitative && (
                      <div>GRE: V{profile.gre_verbal} Q{profile.gre_quantitative}</div>
                    )}
                    {profile.gmat && <div>GMAT: {profile.gmat}</div>}
                    {profile.toefl && <div>TOEFL: {profile.toefl}</div>}
                    {profile.ielts && <div>IELTS: {profile.ielts}</div>}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Preferences</h4>
                  <div className="space-y-1 text-sm">
                    {profile.preferred_states?.length && (
                      <div>States: {profile.preferred_states.slice(0, 3).join(", ")}
                        {profile.preferred_states.length > 3 && ` +${profile.preferred_states.length - 3} more`}
                      </div>
                    )}
                    {profile.preferred_degree_types?.length && (
                      <div>Degrees: {profile.preferred_degree_types.join(", ")}</div>
                    )}
                    {profile.max_tuition_budget && (
                      <div>Budget: ${profile.max_tuition_budget.toLocaleString()}</div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Target Programs</h4>
                  <div className="flex flex-wrap gap-1">
                    {profile.target_programs?.slice(0, 4).map(program => (
                      <Badge key={program} variant="secondary" className="text-xs">
                        {program}
                      </Badge>
                    ))}
                    {profile.target_programs && profile.target_programs.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{profile.target_programs.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          {recommendations.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Recommended Universities ({recommendations.length})
                </h2>
                <Button variant="outline" onClick={() => navigate("/profile")}>
                  Update Profile
                </Button>
              </div>

              <div className="space-y-6">
                {recommendations.map((recommendation, index) => (
                  <Card key={recommendation.university.id} className="overflow-hidden">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">#{index + 1}</span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{recommendation.university.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {recommendation.university.city}, {recommendation.university.state}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-semibold">{recommendation.score}/100</span>
                          </div>
                          <Progress value={recommendation.score} className="w-20" />
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 flex items-center">
                          <TrendingUp className="h-4 w-4 mr-1" />
                          Why this matches you:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {recommendation.reasons.map((reason, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {reason}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>Tuition: ${recommendation.university.tuition_international.toLocaleString()}</span>
                          {recommendation.university.programs && (
                            <span>{recommendation.university.programs.length} programs</span>
                          )}
                          {recommendation.university.scholarships && recommendation.university.scholarships.length > 0 && (
                            <span>{recommendation.university.scholarships.length} scholarships</span>
                          )}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/university/${recommendation.university.id}`)}
                        >
                          View Details
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <Card className="text-center p-12">
              <CardContent className="p-0">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No recommendations yet</h3>
                <p className="text-muted-foreground mb-4">
                  Add more details to your profile to get personalized recommendations
                </p>
                <Button onClick={() => navigate("/profile")}>
                  Complete Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default Recommendations