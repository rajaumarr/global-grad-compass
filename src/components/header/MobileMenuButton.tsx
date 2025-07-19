import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MobileMenuButtonProps {
  isMenuOpen: boolean
  onToggle: () => void
}

export const MobileMenuButton = ({ isMenuOpen, onToggle }: MobileMenuButtonProps) => {
  return (
    <div className="lg:hidden">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={onToggle}
        className="relative transition-all duration-200"
      >
        {isMenuOpen ? (
          <X className="h-5 w-5 transition-transform duration-200 rotate-90" />
        ) : (
          <Menu className="h-5 w-5 transition-transform duration-200" />
        )}
      </Button>
    </div>
  )
}