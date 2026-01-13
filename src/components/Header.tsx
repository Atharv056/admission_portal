import { Button } from "@/components/ui/button";
import { Menu, Bell, User, LogIn, LogOut, Shield, BarChart3 } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ThemeToggle";
export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
  const navLinks = [{
    href: "/",
    label: "Home"
  }, {
    href: "/admissions",
    label: "Admissions"
  }, {
    href: "/schedule",
    label: "Schedule"
  }, {
    href: "/results",
    label: "Results"
  }, {
    href: "/application-status",
    label: "Check Status"
  }, {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart3
  }, {
    href: "/contact",
    label: "Contact"
  }];
  return <header className="sticky top-0 z-50 w-full border-b bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl">
                SA
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Student Admission Portal</h1>
                
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6" role="navigation" aria-label="Main navigation">
            {navLinks.map(link => <Link key={link.href} to={link.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1">
                {link.icon && <link.icon className="h-4 w-4" />}
                {link.label}
              </Link>)}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" className="hidden md:flex gap-2" asChild>
              <Link to="/admin-login">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </Button>
            {user ? <>
                <Button variant="ghost" size="icon" className="hidden md:flex" aria-label="Notifications">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="outline" className="hidden md:flex gap-2" asChild>
                  <Link to="/dashboard">
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" className="hidden md:flex" onClick={handleSignOut} aria-label="Sign out">
                  <LogOut className="h-5 w-5" />
                </Button>
              </> : <Button variant="default" className="hidden md:flex gap-2" asChild>
                <Link to="/auth">
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" aria-expanded={isMenuOpen}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && <div className="lg:hidden py-4 border-t animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3" role="navigation" aria-label="Mobile navigation">
              {navLinks.map(link => <Link key={link.href} to={link.href} className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>)}
              <Link to="/admin-login" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2 flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                <Shield className="h-4 w-4" />
                Admin Portal
              </Link>
              {user ? <>
                  <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Button variant="outline" className="w-full mt-2 gap-2" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </Button>
                </> : <Button variant="default" className="w-full mt-2 gap-2" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>}
            </nav>
          </div>}
      </div>
    </header>;
};