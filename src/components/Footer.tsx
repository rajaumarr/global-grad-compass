import { GraduationCap } from "lucide-react"

export const Footer = () => {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">Global Graduate Gateway</span>
        </div>
        <p className="text-muted-foreground">
          Empowering international students to achieve their academic dreams in the United States.
        </p>
      </div>
    </footer>
  )
}