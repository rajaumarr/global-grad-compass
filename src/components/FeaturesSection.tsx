import { TrendingUp, Award, DollarSign } from "lucide-react"

export const FeaturesSection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Global Graduate Gateway?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Personalized Recommendations</h3>
            <p className="text-muted-foreground">
              Get matched with universities and programs based on your academic profile and preferences.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Scholarship Database</h3>
            <p className="text-muted-foreground">
              Access comprehensive information about scholarships, fellowships, and funding opportunities.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Cost Transparency</h3>
            <p className="text-muted-foreground">
              Compare tuition costs and discover universities offering in-state tuition for international students.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}