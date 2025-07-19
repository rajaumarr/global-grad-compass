import { Card, CardContent } from "@/components/ui/card"

export const StatsSection = () => {
  return (
    <section className="py-12 border-b">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Universities</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">2,000+</div>
              <div className="text-sm text-muted-foreground">Graduate Programs</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">$2B+</div>
              <div className="text-sm text-muted-foreground">In Scholarships</div>
            </CardContent>
          </Card>
          <Card className="text-center p-6">
            <CardContent className="p-0">
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}