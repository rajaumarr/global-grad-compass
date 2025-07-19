import { useState } from "react"
import { Header } from "@/components/Header"
import { HeroSection } from "@/components/HeroSection"
import { StatsSection } from "@/components/StatsSection"
import { FeaturesSection } from "@/components/FeaturesSection"
import { UniversitySearch } from "@/components/UniversitySearch"
import { UniversityLoadingSkeleton } from "@/components/UniversityLoadingSkeleton"
import { CallToActionSection } from "@/components/CallToActionSection"
import { Footer } from "@/components/Footer"
import { useUniversities } from "@/hooks/useUniversities"
import { type FilterState } from "@/components/SearchFilters"

const Index = () => {
  const { universities, loading, error } = useUniversities()
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: "",
    state: "",
    degreeType: "",
    maxTuition: 100000,
    hasScholarships: false,
    hasInStateTuition: false,
    noGRE: false,
    minGPA: 0
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <UniversityLoadingSkeleton />
        <CallToActionSection />
        <Footer />
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <UniversitySearch 
        universities={universities}
        filters={filters}
        onFiltersChange={setFilters}
      />
      <CallToActionSection />
      <Footer />
    </div>
  )
}

export default Index
