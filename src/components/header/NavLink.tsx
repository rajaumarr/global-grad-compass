import React from "react"
import { useNavigate } from "react-router-dom"

interface NavLinkProps {
  href: string
  children: React.ReactNode
  isExternal?: boolean
  onClick?: () => void
}

export const NavLink = ({ href, children, isExternal = false, onClick }: NavLinkProps) => {
  const navigate = useNavigate()

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    
    if (onClick) {
      onClick()
    }
    
    if (isExternal) {
      window.open(href, '_blank', 'noopener noreferrer')
    } else {
      if (href.startsWith('/#')) {
        // Handle hash navigation for same page
        const element = document.getElementById(href.substring(2))
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      } else {
        navigate(href)
      }
    }
  }

  return (
    <a 
      href={href} 
      onClick={handleClick}
      className="relative group text-foreground/80 hover:text-primary transition-all duration-300 font-medium cursor-pointer"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-300 group-hover:w-full" />
    </a>
  )
}