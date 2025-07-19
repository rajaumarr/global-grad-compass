import { Button } from "@/components/ui/button"
import { Search, GraduationCap } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"

export const HeroSection = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-20">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Gateway to
            <span className="text-primary block">US Graduate Education</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Discover universities, programs, and scholarships tailored for international graduate students. 
            Find your perfect match with our comprehensive database and personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-primary hover:bg-primary/90" onClick={() => {
              const universitiesSection = document.getElementById('universities')
              universitiesSection?.scrollIntoView({ behavior: 'smooth' })
            }}>
              <Search className="h-5 w-5 mr-2" />
              Start Exploring
            </Button>
            {!user && (
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                <GraduationCap className="h-5 w-5 mr-2" />
                Register for Free
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}