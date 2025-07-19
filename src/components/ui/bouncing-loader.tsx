import { cn } from "@/lib/utils"

interface BouncingLoaderProps {
  message?: string
  className?: string
  size?: "sm" | "md" | "lg"
}

export const BouncingLoader = ({ 
  message = "Loading...", 
  className,
  size = "md" 
}: BouncingLoaderProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  }

  const containerClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3"
  }

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <div className={cn("flex items-center mb-3", containerClasses[size])}>
        <div 
          className={cn(
            "bg-gradient-to-r from-primary to-accent rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: "0ms", animationDuration: "600ms" }}
        />
        <div 
          className={cn(
            "bg-gradient-to-r from-accent to-primary rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: "150ms", animationDuration: "600ms" }}
        />
        <div 
          className={cn(
            "bg-gradient-to-r from-primary to-accent rounded-full animate-bounce",
            sizeClasses[size]
          )}
          style={{ animationDelay: "300ms", animationDuration: "600ms" }}
        />
      </div>
      <p className={cn("text-muted-foreground font-medium", textClasses[size])}>
        {message}
      </p>
    </div>
  )
}