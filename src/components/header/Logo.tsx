import { GraduationCap, Sparkles } from "lucide-react"
import { useNavigate } from "react-router-dom"

export const Logo = () => {
  const navigate = useNavigate()

  return (
    <div 
      className="flex items-center space-x-3 cursor-pointer group transition-all duration-300 hover:scale-105" 
      onClick={() => navigate("/")}
    >
      <div className="relative">
        <GraduationCap className="h-8 w-8 text-primary transition-all duration-300 group-hover:rotate-12 group-hover:text-accent" />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
      </div>
      <div className="hidden md:flex flex-col">
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Global Graduate Gateway
        </span>
        <span className="text-xs text-muted-foreground -mt-1">Your pathway to success</span>
      </div>
      <div className="hidden sm:flex md:hidden flex-col">
        <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Graduate Gateway
        </span>
        <span className="text-xs text-muted-foreground -mt-1">Your pathway</span>
      </div>
      <span className="text-base font-bold sm:hidden bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        GGG
      </span>
    </div>
  )
}