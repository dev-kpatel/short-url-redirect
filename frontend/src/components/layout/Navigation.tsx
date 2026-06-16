import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@shared/lib/cn";
import { useTheme } from "@shared/context/ThemeContext";
import { useAuth } from "@shared/context/AuthContext";
import { OAuthModal } from "@components/ui/OAuthModal";
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  LogIn, 
  LogOut, 
  Activity, 
  User as UserIcon, 
  ChevronDown 
} from "lucide-react";

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Redirects', href: '/app/redirect' },
  { name: 'AB Splits', href: '/app/ab' },
  { name: 'Calendars', href: '/app/calendar' },
];

export const Navigation = () => {
  const { pathname } = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="relative z-40 transition-colors duration-300">
      <nav className="border-b border-border bg-card/75 backdrop-blur-md sticky top-0 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 text-foreground hover:opacity-90 transition-opacity">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-brand/10 text-lime-brand border border-lime-brand/20 shadow-sm shadow-lime-brand/5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-shuffle animate-float" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.6 9.6 0 0 0 7.556 8a9.6 9.6 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.6 10.6 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.6 9.6 0 0 0 6.444 8a9.6 9.6 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5" />
                    <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192m0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192" />
                  </svg>
                </div>
                <span className="font-display font-bold tracking-tight text-lg">
                  Slug<span className="text-lime-brand">Split</span>
                </span>
              </Link>

              {/* Desktop Nav Items */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-1">
                  {navigation.map((item) => {
                    const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          isActive
                            ? 'bg-lime-brand/10 text-lime-brand font-semibold border-b-2 border-lime-brand rounded-t-lg'
                            : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground rounded-lg',
                          'px-3.5 py-2 text-sm font-medium transition-all duration-200 ease-in-out',
                        )}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Utility Actions & Session Settings */}
            <div className="hidden md:flex items-center gap-3">
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="h-4.5 w-4.5 text-lime-brand animate-spin-slow" />
                ) : (
                  <Moon className="h-4.5 w-4.5 text-slate-800" />
                )}
              </button>

              {/* Auth Settings / User Session Button */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 rounded-xl border border-border bg-muted/20 px-3 py-1.5 text-sm font-medium hover:bg-muted/50 transition-all cursor-pointer"
                  >
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="h-6 w-6 rounded-full border border-border/80"
                    />
                    <span className="max-w-28 truncate text-xs text-foreground font-semibold">{user.displayName}</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-muted-foreground transition-transform duration-200", profileDropdownOpen && "transform rotate-180")} />
                  </button>

                  {profileDropdownOpen && (
                    <>
                      <div 
                        className="fixed inset-0 z-30" 
                        onClick={() => setProfileDropdownOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-card p-2 shadow-xl z-40 transition-all">
                        <div className="px-3 py-2 border-b border-border/60 mb-1">
                          <p className="text-xs text-muted-foreground">Signed in with <span className="capitalize font-semibold text-foreground">{user.provider}</span></p>
                          <p className="text-xs font-semibold text-foreground truncate mt-0.5">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            logout();
                            setProfileDropdownOpen(false);
                          }}
                          className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 transition-colors font-medium cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setLoginModalOpen(true)}
                  className="flex items-center gap-1.5 rounded-xl bg-lime-brand hover:bg-lime-brand/90 px-4 py-2 text-xs font-semibold text-primary-foreground tracking-wide transition-all shadow-sm shadow-lime-brand/10 hover:shadow-md cursor-pointer"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  <span>Control Sign-In</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Actions */}
            <div className="-mr-2 flex md:hidden items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-muted/20 text-muted-foreground hover:text-foreground"
              >
                {theme === "dark" ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/30 focus:outline-none"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-card px-4 py-3 space-y-2">
            {navigation.map((item) => {
              const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    isActive
                      ? 'bg-lime-brand/10 text-lime-brand font-semibold'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/40',
                    'block rounded-lg px-3 py-2 text-base font-medium transition-colors',
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
            <div className="border-t border-border/80 pt-3 mt-3">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 px-3 py-1.5">
                    <img src={user.photoURL} alt={user.displayName} className="h-8 w-8 rounded-full border" />
                    <div>
                      <p className="text-sm font-semibold">{user.displayName}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-48">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setLoginModalOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-lime-brand text-primary-foreground px-4 py-2.5 text-sm font-semibold"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Control Sign-In</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Auth Pop-up Dialog */}
      <OAuthModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </div>
  );
};
