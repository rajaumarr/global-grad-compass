import { useParams, useNavigate } from "react-router-dom"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { ArrowLeft, ExternalLink, MapPin, DollarSign, Award, GraduationCap, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Header } from "@/components/Header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUniversities } from "@/hooks/useUniversities"

export default function UniversityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { universities, loading, error } = useUniversities()

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BouncingLoader message="Loading university details..." className="py-32" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="text-lg text-destructive">Error: {error}</div>
        </div>
      </div>
    )
  }

  const university = universities.find(u => u.id === id)

  if (!university) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">University Not Found</h1>
          <p className="text-muted-foreground mb-6">The university you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universities
          </Button>
        </div>
      </div>
    )
  }

  const formatTuition = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatScholarshipAmount = (scholarship: any) => {
    if (scholarship.amount_type === 'full_tuition') {
      return 'Full Tuition'
    }
    return formatTuition(scholarship.amount_value || 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Universities
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* University Image */}
            <div className="lg:col-span-1">
              <div className="aspect-square rounded-lg bg-muted overflow-hidden">
                <img 
                  src={university.image_url || `https://images.unsplash.com/photo-1527576539890-dfa815648363?w=400&h=400&fit=crop`}
                  alt={`${university.name} campus`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {/* University Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">
                    {university.name}
                  </h1>
                  <div className="flex items-center text-lg text-muted-foreground mb-4">
                    <MapPin className="h-5 w-5 mr-2" />
                    {university.city}, {university.state}
                  </div>
                </div>
                {university.ranking && (
                  <Badge variant="secondary" className="text-lg px-3 py-1">
                    #{university.ranking} Ranking
                  </Badge>
                )}
              </div>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <DollarSign className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold">{formatTuition(university.tuition_international)}</div>
                    <div className="text-sm text-muted-foreground">International Tuition</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold">{university.programs?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Programs Available</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <div className="text-lg font-bold">{university.scholarships?.length || 0}</div>
                    <div className="text-sm text-muted-foreground">Scholarships</div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button size="lg" className="flex-1">
                  Apply Now
                </Button>
                {university.website && (
                  <Button 
                    size="lg" 
                    variant="outline"
                    onClick={() => window.open(university.website, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                )}
              </div>
              
              {university.has_in_state_tuition_waiver && (
                <div className="flex items-center text-success mt-4 p-3 bg-success/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  <span className="font-medium">In-state tuition waiver available for international students</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Information Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="programs" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="programs">Programs</TabsTrigger>
              <TabsTrigger value="tuition">Tuition & Costs</TabsTrigger>
              <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
              <TabsTrigger value="admissions">Admissions</TabsTrigger>
            </TabsList>
            
            <TabsContent value="programs" className="mt-8">
              <div className="grid gap-6">
                <h2 className="text-2xl font-bold">Graduate Programs</h2>
                {university.programs && university.programs.length > 0 ? (
                  <div className="grid gap-4">
                    {university.programs.map((program) => (
                      <Card key={program.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-xl">{program.name}</CardTitle>
                              <p className="text-muted-foreground">{program.department}</p>
                            </div>
                            <Badge variant="outline">{program.degree}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {program.description && (
                            <p className="text-muted-foreground mb-4">{program.description}</p>
                          )}
                          
                          <div className="grid md:grid-cols-2 gap-4">
                            {/* Requirements */}
                            <div>
                              <h4 className="font-semibold mb-2">Requirements</h4>
                              <div className="space-y-1 text-sm">
                                {program.requirements_gpa && (
                                  <div>GPA: {program.requirements_gpa}</div>
                                )}
                                {program.requirements_gre_verbal && (
                                  <div>GRE Verbal: {program.requirements_gre_verbal}</div>
                                )}
                                {program.requirements_gre_quantitative && (
                                  <div>GRE Quantitative: {program.requirements_gre_quantitative}</div>
                                )}
                                {program.requirements_toefl && (
                                  <div>TOEFL: {program.requirements_toefl}</div>
                                )}
                                {program.requirements_ielts && (
                                  <div>IELTS: {program.requirements_ielts}</div>
                                )}
                              </div>
                            </div>
                            
                            {/* Prerequisites & Deadline */}
                            <div>
                              <h4 className="font-semibold mb-2">Details</h4>
                              {program.application_deadline && (
                                <div className="flex items-center text-sm mb-2">
                                  <Clock className="h-4 w-4 mr-2" />
                                  Deadline: {program.application_deadline}
                                </div>
                              )}
                              {program.prerequisites && program.prerequisites.length > 0 && (
                                <div>
                                  <div className="text-sm font-medium mb-1">Prerequisites:</div>
                                  <ul className="text-sm text-muted-foreground list-disc list-inside">
                                    {program.prerequisites.map((req, index) => (
                                      <li key={index}>{req}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <CardContent className="p-0">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No programs listed</h3>
                      <p className="text-muted-foreground">
                        Program information is not available at this time.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="tuition" className="mt-8">
              <div className="grid gap-6">
                <h2 className="text-2xl font-bold">Tuition & Costs</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {university.tuition_in_state && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">In-State Tuition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatTuition(university.tuition_in_state)}
                        </div>
                        <div className="text-sm text-muted-foreground">per year</div>
                      </CardContent>
                    </Card>
                  )}
                  
                  {university.tuition_out_of_state && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Out-of-State Tuition</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-primary">
                          {formatTuition(university.tuition_out_of_state)}
                        </div>
                        <div className="text-sm text-muted-foreground">per year</div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">International Tuition</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {formatTuition(university.tuition_international)}
                      </div>
                      <div className="text-sm text-muted-foreground">per year</div>
                    </CardContent>
                  </Card>
                </div>
                
                {university.has_in_state_tuition_waiver && (
                  <Card className="border-success">
                    <CardContent className="p-6">
                      <div className="flex items-center text-success mb-2">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-semibold">In-State Tuition Waiver Available</span>
                      </div>
                      <p className="text-muted-foreground">
                        This university offers in-state tuition rates to qualified international students, 
                        potentially saving you thousands of dollars per year.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="scholarships" className="mt-8">
              <div className="grid gap-6">
                <h2 className="text-2xl font-bold">Available Scholarships</h2>
                {university.scholarships && university.scholarships.length > 0 ? (
                  <div className="grid gap-4">
                    {university.scholarships.map((scholarship) => (
                      <Card key={scholarship.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-xl">{scholarship.name}</CardTitle>
                            <Badge variant={scholarship.renewable ? "default" : "secondary"}>
                              {scholarship.renewable ? "Renewable" : "One-time"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <div className="text-2xl font-bold text-primary mb-2">
                                {formatScholarshipAmount(scholarship)}
                              </div>
                              {scholarship.deadline && (
                                <div className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-2" />
                                  Deadline: {scholarship.deadline}
                                </div>
                              )}
                            </div>
                            
                            {scholarship.eligibility && scholarship.eligibility.length > 0 && (
                              <div>
                                <div className="text-sm font-medium mb-2">Eligibility Requirements:</div>
                                <ul className="text-sm text-muted-foreground list-disc list-inside">
                                  {scholarship.eligibility.map((req, index) => (
                                    <li key={index}>{req}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center">
                    <CardContent className="p-0">
                      <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No scholarships listed</h3>
                      <p className="text-muted-foreground">
                        Scholarship information is not available at this time. Contact the university directly for funding opportunities.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="admissions" className="mt-8">
              <div className="grid gap-6">
                <h2 className="text-2xl font-bold">Admissions Information</h2>
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>General Requirements</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">Academic Requirements</h4>
                          <ul className="space-y-2 text-sm">
                            <li>• Bachelor's degree from accredited institution</li>
                            <li>• Official transcripts required</li>
                            <li>• Letters of recommendation</li>
                            <li>• Statement of purpose</li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">International Students</h4>
                          <ul className="space-y-2 text-sm">
                            <li>• TOEFL/IELTS scores required</li>
                            <li>• Financial documentation</li>
                            <li>• Passport copy</li>
                            <li>• Credential evaluation may be required</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {university.programs && university.programs.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Program-Specific Deadlines</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {university.programs.map((program) => (
                            program.application_deadline && (
                              <div key={program.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                <div>
                                  <div className="font-medium">{program.name} ({program.degree})</div>
                                  <div className="text-sm text-muted-foreground">{program.department}</div>
                                </div>
                                <div className="text-sm font-medium">
                                  {program.application_deadline}
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}