
import { useMemo, useState } from "react"
import { UniversityCard } from "@/components/UniversityCard"
import { SearchFilters, type FilterState } from "@/components/SearchFilters"
import { UniversityPagination } from "@/components/UniversityPagination"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { University } from "@/hooks/useUniversities"

interface UniversitySearchProps {
  universities: University[]
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export const UniversitySearch = ({ universities, filters, onFiltersChange }: UniversitySearchProps) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  const filteredUniversities = useMemo(() => {
    console.log('Filtering universities with filters:', filters)
    console.log('Total universities:', universities.length)
    
    return universities.filter((university) => {
      // Search query - search in university name AND programs
      if (filters.searchQuery && filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim()
        const matchesUniversityName = university.name.toLowerCase().includes(query)
        const matchesProgram = university.programs?.some(p => 
          p.name.toLowerCase().includes(query) ||
          p.department.toLowerCase().includes(query) ||
          p.degree.toLowerCase().includes(query)
        ) || false
        
        console.log(`University ${university.name}: name match = ${matchesUniversityName}, program match = ${matchesProgram}`)
        
        if (!matchesUniversityName && !matchesProgram) {
          return false
        }
      }

      // State filter
      if (filters.state && filters.state.trim()) {
        console.log(`Checking state filter: ${filters.state} vs ${university.state}`)
        if (university.state !== filters.state) {
          return false
        }
      }

      // Degree type
      if (filters.degreeType && filters.degreeType.trim()) {
        const hasMatchingDegree = university.programs?.some(p => p.degree === filters.degreeType) || false
        console.log(`Checking degree filter: ${filters.degreeType}, has matching degree = ${hasMatchingDegree}`)
        if (!hasMatchingDegree) {
          return false
        }
      }

      // Max tuition
      if (filters.maxTuition < 100000) {
        if (university.tuition_international > filters.maxTuition) {
          return false
        }
      }

      // Has scholarships
      if (filters.hasScholarships) {
        if (!university.scholarships || university.scholarships.length === 0) {
          return false
        }
      }

      // Has in-state tuition
      if (filters.hasInStateTuition) {
        if (!university.has_in_state_tuition_waiver) {
          return false
        }
      }

      // No GRE (simplified check)
      if (filters.noGRE) {
        const hasGRERequirement = university.programs?.some(p => 
          p.requirements_gre_verbal || p.requirements_gre_quantitative || p.requirements_gre_writing
        ) || false
        if (hasGRERequirement) {
          return false
        }
      }

      // Min GPA
      if (filters.minGPA > 0) {
        const meetsGPA = university.programs?.some(p => 
          p.requirements_gpa && p.requirements_gpa <= filters.minGPA
        ) || false
        if (!meetsGPA) {
          return false
        }
      }

      return true
    })
  }, [universities, filters])

  // Paginated universities
  const paginatedUniversities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredUniversities.slice(startIndex, endIndex)
  }, [filteredUniversities, currentPage, itemsPerPage])

  const resetFilters = () => {
    onFiltersChange({
      searchQuery: "",
      state: "",
      degreeType: "",
      maxTuition: 100000,
      hasScholarships: false,
      hasInStateTuition: false,
      noGRE: false,
      minGPA: 0
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of universities section
    document.getElementById('universities')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1)
  }

  console.log('Filtered universities count:', filteredUniversities.length)

  return (
    <section id="universities" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Explore Universities</h2>
        
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="xl:col-span-1">
            <SearchFilters onFiltersChange={onFiltersChange} filters={filters} />
          </div>

          {/* Results */}
          <div className="xl:col-span-3">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold">
                  {filteredUniversities.length} Universities Found
                </span>
                {Object.values(filters).some(v => v && v !== "" && v !== 0) && (
                  <Badge variant="secondary">Filtered</Badge>
                )}
              </div>
            </div>

            {/* University Cards */}
            {filteredUniversities.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {paginatedUniversities.map((university) => (
                    <UniversityCard key={university.id} university={university} />
                  ))}
                </div>
                
                {/* Pagination */}
                <UniversityPagination
                  totalItems={filteredUniversities.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </>
            ) : (
              <Card className="p-12 text-center">
                <CardContent className="p-0">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No universities found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search criteria
                  </p>
                  <Button variant="outline" onClick={resetFilters}>
                    Clear All Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
