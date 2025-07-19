import { useParams, useLocation, useNavigate } from "react-router-dom"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, DollarSign, MapPin, ExternalLink, CheckCircle, Clock, FileText } from "lucide-react"
import { Footer } from "@/components/Footer"

const ScholarshipDetail = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const scholarship = location.state?.scholarship

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Scholarship Not Found</h1>
          <Button onClick={() => navigate("/scholarships")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scholarships
          </Button>
        </div>
      </div>
    )
  }

  const isDeadlineSoon = new Date(scholarship.deadline) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back button */}
          <Button 
            variant="ghost" 
            onClick={() => navigate("/scholarships")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Scholarships
          </Button>

          {/* Header Card */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{scholarship.name}</CardTitle>
                  {scholarship.university && (
                    <p className="text-muted-foreground flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {scholarship.university.name}, {scholarship.university.city}, {scholarship.university.state}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <Badge 
                    variant="default"
                    className="mb-2"
                  >
                    {scholarship.amount_type || 'Scholarship'}
                  </Badge>
                  {scholarship.renewable && (
                    <div>
                      <Badge variant="outline">Renewable</Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center text-2xl font-bold text-green-600">
                  <DollarSign className="h-6 w-6 mr-2" />
                  ${scholarship.amount_value?.toLocaleString() || 'N/A'}
                </div>
                <div className={`flex items-center text-lg font-semibold ${isDeadlineSoon ? 'text-red-600' : 'text-muted-foreground'}`}>
                  <Calendar className="h-5 w-5 mr-2" />
                  Due: {new Date(scholarship.deadline).toLocaleDateString()}
                  {isDeadlineSoon && (
                    <Badge variant="destructive" className="ml-2">Deadline Soon!</Badge>
                  )}
                </div>
              </div>
              
              {scholarship.external_link && (
                <Button 
                  className="w-full md:w-auto" 
                  size="lg"
                  onClick={() => window.open(scholarship.external_link, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Apply Now
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>About This Scholarship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {scholarship.description}
              </p>
            </CardContent>
          </Card>

          {/* Eligibility Criteria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2" />
                Eligibility Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {scholarship.eligibility?.map((criteria: string, index: number) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {criteria}
                  </li>
                )) || <p className="text-muted-foreground">No specific eligibility criteria listed.</p>}
              </ul>
            </CardContent>
          </Card>

          {/* Selection Criteria */}
          {scholarship.selection_criteria && scholarship.selection_criteria.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Selection Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {scholarship.selection_criteria.map((criteria: string, index: number) => (
                    <div key={index} className="flex items-center p-3 bg-muted rounded-lg">
                      <FileText className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm">{criteria}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Application Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Important Dates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border-l-4 border-primary bg-primary/5">
                  <div>
                    <p className="font-medium">Application Deadline</p>
                    <p className="text-sm text-muted-foreground">Final date to submit your application</p>
                  </div>
                  <Badge variant={isDeadlineSoon ? "destructive" : "default"}>
                    {new Date(scholarship.deadline).toLocaleDateString()}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border-l-4 border-muted bg-muted/20">
                  <div>
                    <p className="font-medium">Results Notification</p>
                    <p className="text-sm text-muted-foreground">Expected announcement of scholarship recipients</p>
                  </div>
                  <Badge variant="outline">
                    {new Date(new Date(scholarship.deadline).getTime() + 60 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {scholarship.external_link && (
              <Button 
                className="flex-1" 
                size="lg"
                onClick={() => window.open(scholarship.external_link, '_blank')}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Apply for This Scholarship
              </Button>
            )}
            <Button 
              variant="outline" 
              className="flex-1" 
              size="lg"
              onClick={() => navigate("/scholarships")}
            >
              Explore More Scholarships
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default ScholarshipDetail