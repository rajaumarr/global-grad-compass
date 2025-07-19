import { createPortal } from "react-dom"
import { MobileMenuNavigation } from "./MobileMenuNavigation"
import { MobileMenuUserSection } from "./MobileMenuUserSection"
import { ThemeToggle } from "@/components/ThemeToggle"

interface MobileMenuOverlayProps {
  user: any
  profile: any
  isAdmin: boolean
  onMenuClose: () => void
  onSignOut: () => void
}

export const MobileMenuOverlay = ({ user, profile, isAdmin, onMenuClose, onSignOut }: MobileMenuOverlayProps) => {
  const overlayContent = (
    <>
      {/* Strong blur overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-[100] lg:hidden"
        onClick={onMenuClose}
      ></div>
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-background/95 backdrop-blur-2xl lg:hidden z-[101] overflow-y-auto pt-16">
        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Header controls */}
          <div className="flex justify-between items-center">
            <ThemeToggle />
            <button
              onClick={onMenuClose}
              className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col space-y-6">
            <MobileMenuNavigation 
              user={user} 
              isAdmin={isAdmin} 
              onLinkClick={onMenuClose} 
            />
          </div>

          <div className="border-t border-border/40 pt-4">
            <MobileMenuUserSection 
              user={user}
              profile={profile}
              onMenuClose={onMenuClose}
              onSignOut={onSignOut}
            />
          </div>
        </div>
      </div>
    </>
  )

  return createPortal(overlayContent, document.body)
}