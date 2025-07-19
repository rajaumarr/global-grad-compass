import { useState, useEffect } from "react"
import { Header } from "@/components/Header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BouncingLoader } from "@/components/ui/bouncing-loader"
import { useToast } from "@/hooks/use-toast"
import { Search, DollarSign, Calendar, MapPin, ExternalLink, Filter } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Footer } from "@/components/Footer"
import { useScholarships, type Scholarship } from "@/hooks/useScholarships"
import { UniversityPagination } from "@/components/UniversityPagination"
import { supabase } from "@/integrations/supabase/client"

const Scholarships = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [stateFilter, setStateFilter] = useState("all-states")
  const [amountFilter, setAmountFilter] = useState("any-amount")
  const [gpaFilter, setGpaFilter] = useState("any-gpa")
  const [citizenshipFilter, setCitizenshipFilter] = useState("any-citizenship")
  const [fieldFilter, setFieldFilter] = useState("any-field")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const { scholarships, loading, error, totalCount, fetchScholarships } = useScholarships()
  const { toast } = useToast()
  const navigate = useNavigate()

  // Fetch scholarships when filters change - simplified
  useEffect(() => {
    const filters = {
      search: searchQuery,
      // state: stateFilter !== "all-states" ? stateFilter : undefined, // Temporarily disabled
      amountRange: amountFilter !== "any-amount" ? amountFilter : undefined,
      gpaRange: gpaFilter !== "any-gpa" ? gpaFilter : undefined,
      citizenship: citizenshipFilter !== "any-citizenship" ? citizenshipFilter : undefined,
      fieldOfStudy: fieldFilter !== "any-field" ? fieldFilter : undefined
    }
    fetchScholarships(currentPage, itemsPerPage, filters)
  }, [searchQuery, amountFilter, gpaFilter, citizenshipFilter, fieldFilter, currentPage, itemsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1)
    }
  }, [searchQuery, amountFilter, gpaFilter, citizenshipFilter, fieldFilter])

  // Get unique states - using hardcoded states for better performance
  const [uniqueStates, setUniqueStates] = useState<string[]>([])
  
  // Use hardcoded states for now
  useEffect(() => {
    setUniqueStates(['California', 'New York', 'Texas', 'Florida', 'Illinois', 'Massachusetts', 'Washington', 'Pennsylvania', 'Ohio', 'Michigan'])
  }, [])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  const handleScholarshipClick = (scholarship: Scholarship) => {
    navigate(`/scholarship/${scholarship.id}`, { state: { scholarship } })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Scholarship Opportunities</h1>
            <p className="text-lg text-muted-foreground">
              Discover financial aid and scholarship opportunities for your education
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Scholarships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search scholarships..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">State</label>
                  <Select value={stateFilter} onValueChange={setStateFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="All states" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-states">All states</SelectItem>
                      {uniqueStates.map(state => (
                        <SelectItem key={state} value={state!}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Amount</label>
                  <Select value={amountFilter} onValueChange={setAmountFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any amount" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-amount">Any amount</SelectItem>
                      <SelectItem value="under-10k">Under $10,000</SelectItem>
                      <SelectItem value="10k-20k">$10,000 - $20,000</SelectItem>
                      <SelectItem value="20k-plus">$20,000+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">GPA Requirement</label>
                  <Select value={gpaFilter} onValueChange={setGpaFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any GPA" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-gpa">Any GPA</SelectItem>
                      <SelectItem value="below-3.0">Below 3.0</SelectItem>
                      <SelectItem value="3.0-3.5">3.0 - 3.5</SelectItem>
                      <SelectItem value="3.5-plus">3.5+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Citizenship</label>
                  <Select value={citizenshipFilter} onValueChange={setCitizenshipFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any citizenship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-citizenship">Any citizenship</SelectItem>
                      <SelectItem value="us-citizens">US Citizens</SelectItem>
                      <SelectItem value="international">International Students</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Field of Study</label>
                  <Select value={fieldFilter} onValueChange={setFieldFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any field" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any-field">Any field</SelectItem>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                      <SelectItem value="Computer Science">Computer Science</SelectItem>
                      <SelectItem value="Medicine">Medicine</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Sciences">Sciences</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {loading ? (
            <BouncingLoader message="Loading scholarships..." className="py-12" />
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                  Available Scholarships ({totalCount})
                </h2>
              </div>
              
              {error ? (
                <Card className="text-center p-12">
                  <CardContent className="p-0">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Connection Error</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={() => window.location.reload()}>
                      Refresh Page
                    </Button>
                  </CardContent>
                </Card>
              ) : scholarships.length === 0 && !loading ? (
                <Card className="text-center p-12">
                  <CardContent className="p-0">
                    <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Scholarships Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to find more scholarship opportunities
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {scholarships.map((scholarship) => (
                    <Card 
                      key={scholarship.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => handleScholarshipClick(scholarship)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{scholarship.name}</CardTitle>
                            {scholarship.university ? (
                              <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                {scholarship.university.name}, {scholarship.university.city}, {scholarship.university.state}
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground flex items-center mt-1">
                                <MapPin className="h-4 w-4 mr-1" />
                                Various Universities
                              </p>
                            )}
                          </div>
                          <Badge variant="secondary">
                            {scholarship.funding_source || 'Scholarship'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {scholarship.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center text-green-600 font-semibold">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {scholarship.amount_value ? `$${scholarship.amount_value.toLocaleString()}` : scholarship.amount_type}
                            {scholarship.renewable && (
                              <Badge variant="outline" className="ml-2 text-xs">Renewable</Badge>
                            )}
                          </div>
                          {scholarship.deadline && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-1" />
                              Due: {new Date(scholarship.deadline).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                        
                        {scholarship.eligibility && scholarship.eligibility.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-xs font-medium text-muted-foreground">Eligibility:</p>
                            <div className="flex flex-wrap gap-1">
                              {scholarship.eligibility.slice(0, 3).map((criteria, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {criteria}
                                </Badge>
                              ))}
                              {scholarship.eligibility.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{scholarship.eligibility.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <Button variant="outline" size="sm" onClick={(e) => {
                            e.stopPropagation()
                            handleScholarshipClick(scholarship)
                          }}>
                            View Details
                          </Button>
                          {scholarship.external_link && (
                            <Button size="sm" onClick={(e) => {
                              e.stopPropagation()
                              window.open(scholarship.external_link, '_blank')
                            }}>
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Apply Now
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    ))}
                  </div>
                  
                  <UniversityPagination
                    totalItems={totalCount}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                    onItemsPerPageChange={handleItemsPerPageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Scholarships