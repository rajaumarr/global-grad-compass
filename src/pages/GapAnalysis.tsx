import { useAuth } from "@/contexts/AuthContext"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useUniversities } from "@/hooks/useUniversities"
import { useGapAnalysis } from "@/hooks/useGapAnalysis"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useNavigate } from "react-router-dom"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useMemo } from "react"
import { 
  Target, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  BookOpen,
  Award,
  ArrowRight,
  Filter
} from "lucide-react"

const GapAnalysisPage = () => {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const { universities, loading } = useUniversities()
  const gapAnalyses = useGapAnalysis(universities)
  const [sortOrder, setSortOrder] = useState<'high-to-low' | 'low-to-high'>('high-to-low')

  const sortedAnalyses = useMemo(() => {
    return [...gapAnalyses].sort((a, b) => {
      if (sortOrder === 'high-to-low') {
        return b.overallMatch - a.overallMatch
      } else {
        return a.overallMatch - b.overallMatch
      }
    })
  }, [gapAnalyses, sortOrder])

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
                Sign in to view your gap analysis
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Complete Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete your academic profile to see gap analysis
              </p>
              <Button onClick={() => navigate("/profile")} className="w-full">
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BouncingLoader message="Analyzing your profile..." className="py-32" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Gap Analysis</h1>
            <p className="text-muted-foreground">
              See how your qualifications match university requirements and what to improve
            </p>
          </div>

          {gapAnalyses.length > 0 ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Sort by Match Percentage:</span>
                </div>
                <Select value={sortOrder} onValueChange={(value: 'high-to-low' | 'low-to-high') => setSortOrder(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high-to-low">High to Low</SelectItem>
                    <SelectItem value="low-to-high">Low to High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {sortedAnalyses.map((analysis) => (
                <Card key={analysis.university.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">{analysis.university.name}</CardTitle>
                        <p className="text-muted-foreground">
                          {analysis.university.city}, {analysis.university.state}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="text-lg font-semibold">{analysis.overallMatch}% Match</span>
                          {analysis.overallMatch >= 80 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : analysis.overallMatch >= 60 ? (
                            <AlertCircle className="h-5 w-5 text-yellow-500" />
                          ) : (
                            <AlertCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <Progress value={analysis.overallMatch} className="w-24" />
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {/* GPA Analysis */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center">
                          <BookOpen className="h-4 w-4 mr-2" />
                          GPA Requirements
                        </h4>
                        {analysis.gpaGap.required ? (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Required:</span>
                              <span className="font-medium">{analysis.gpaGap.required}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Your GPA:</span>
                              <span className="font-medium">
                                {analysis.gpaGap.current || 'Not provided'}
                              </span>
                            </div>
                            {analysis.gpaGap.hasGap && (
                              <Badge variant="destructive" className="text-xs">
                                Gap: {analysis.gpaGap.gap.toFixed(2)} points
                              </Badge>
                            )}
                            {!analysis.gpaGap.hasGap && analysis.gpaGap.current && (
                              <Badge variant="default" className="text-xs bg-green-500">
                                ✓ Meets requirement
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No GPA requirement specified</p>
                        )}
                      </div>

                      {/* GRE Analysis */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center">
                          <Target className="h-4 w-4 mr-2" />
                          GRE Requirements
                        </h4>
                        {analysis.greGap.verbalRequired || analysis.greGap.quantRequired ? (
                          <div className="space-y-2">
                            {analysis.greGap.verbalRequired && (
                              <div className="flex justify-between text-sm">
                                <span>Verbal:</span>
                                <span className="font-medium">
                                  {analysis.greGap.verbalCurrent || 'N/A'} / {analysis.greGap.verbalRequired}
                                </span>
                              </div>
                            )}
                            {analysis.greGap.quantRequired && (
                              <div className="flex justify-between text-sm">
                                <span>Quant:</span>
                                <span className="font-medium">
                                  {analysis.greGap.quantCurrent || 'N/A'} / {analysis.greGap.quantRequired}
                                </span>
                              </div>
                            )}
                            {analysis.greGap.hasGap ? (
                              <Badge variant="destructive" className="text-xs">
                                Improvement needed
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs bg-green-500">
                                ✓ Meets requirements
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No GRE requirement specified</p>
                        )}
                      </div>

                      {/* Language Analysis */}
                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center">
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Language Requirements
                        </h4>
                        {analysis.languageGap.toeflRequired || analysis.languageGap.ieltsRequired ? (
                          <div className="space-y-2">
                            {analysis.languageGap.toeflRequired && (
                              <div className="flex justify-between text-sm">
                                <span>TOEFL:</span>
                                <span className="font-medium">
                                  {analysis.languageGap.toeflCurrent || 'N/A'} / {analysis.languageGap.toeflRequired}
                                </span>
                              </div>
                            )}
                            {analysis.languageGap.ieltsRequired && (
                              <div className="flex justify-between text-sm">
                                <span>IELTS:</span>
                                <span className="font-medium">
                                  {analysis.languageGap.ieltsCurrent || 'N/A'} / {analysis.languageGap.ieltsRequired}
                                </span>
                              </div>
                            )}
                            {analysis.languageGap.hasGap ? (
                              <Badge variant="destructive" className="text-xs">
                                Improvement needed
                              </Badge>
                            ) : (
                              <Badge variant="default" className="text-xs bg-green-500">
                                ✓ Meets requirements
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">No language requirement specified</p>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {/* Recommendations */}
                    {analysis.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-3">Recommendations to Improve Your Profile:</h4>
                        <div className="space-y-2">
                          {analysis.recommendations.map((rec, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <ArrowRight className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                              <span className="text-sm">{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matching Programs */}
                    <div>
                      <h4 className="font-semibold mb-3">
                        Matching Programs ({analysis.matchingPrograms.length})
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {analysis.matchingPrograms.slice(0, 4).map((program, idx) => (
                          <div key={idx} className="p-3 border rounded-lg">
                            <div className="font-medium text-sm">{program.name}</div>
                            <div className="text-xs text-muted-foreground">{program.department}</div>
                            <Badge variant="outline" className="text-xs mt-1">
                              {program.degree}
                            </Badge>
                          </div>
                        ))}
                        {analysis.matchingPrograms.length > 4 && (
                          <div className="p-3 border rounded-lg bg-muted/30 flex items-center justify-center">
                            <span className="text-sm text-muted-foreground">
                              +{analysis.matchingPrograms.length - 4} more programs
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{analysis.matchingPrograms.length} programs</span>
                        <span>{analysis.availableScholarships.length} scholarships</span>
                      </div>
                      <Button 
                        variant="outline"
                        onClick={() => navigate(`/university/${analysis.university.id}`)}
                      >
                        View University Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center p-12">
              <CardContent className="p-0">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                <p className="text-muted-foreground mb-4">
                  Add your academic scores and preferences to see gap analysis
                </p>
                <Button onClick={() => navigate("/profile")}>
                  Update Profile
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

export default GapAnalysisPage