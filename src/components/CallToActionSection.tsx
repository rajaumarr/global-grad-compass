import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export const CallToActionSection = () => {
  const navigate = useNavigate()

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
          Join thousands of international students who have found their perfect graduate program through our platform.
        </p>
        <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
          Create Your Profile
        </Button>
      </div>
    </section>
  )
}