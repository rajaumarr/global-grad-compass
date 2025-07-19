import { Logo } from "./header/Logo"
import { DesktopNavigation } from "./header/DesktopNavigation"
import { DesktopActions } from "./header/DesktopActions"
import { MobileMenu } from "./header/MobileMenu"

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-lg border-b border-border/40 shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Logo />
        <DesktopNavigation />
        <DesktopActions />
        <MobileMenu />
      </div>
    </header>
  )
}