import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const primaryLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Publishing", path: "/publishing" },
  { label: "Books", path: "/books" },
  { label: "Work With Me", path: "/work-with-me" },
  { label: "Podcast", path: "/podcast" },
  { label: "Courses", path: "/courses" },
  { label: "Blog", path: "/blog" },
  { label: "Contact", path: "/contact" },
];

const otherLinks = [
  { label: "Media", path: "/media" },
  { label: "Newsletter", path: "/newsletter" },
  { label: "Events", path: "/events" },
  { label: "Philanthropy", path: "/philanthropy" },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [othersOpen, setOthersOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link to="/" className="font-heading text-2xl tracking-wide">
          Dr. Dina Lundy
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {primaryLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(link.path)
                  ? "bg-secondary text-secondary-foreground"
                  : "hover:bg-primary/80 text-primary-foreground/90 hover:text-primary-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Others Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOthersOpen(!othersOpen)}
              className="px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-primary/80 text-primary-foreground/90 hover:text-primary-foreground flex items-center gap-1"
            >
              Others <ChevronDown className="w-4 h-4" />
            </button>
            {othersOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setOthersOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 bg-background text-foreground rounded-lg shadow-xl border py-2 min-w-[160px]">
                  {otherLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setOthersOpen(false)}
                      className={cn(
                        "block px-4 py-2 text-sm transition-colors",
                        isActive(link.path) ? "bg-warm text-warm-foreground" : "hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>

          <Link to="/login">
            <Button variant="warm" size="sm" className="ml-2">
              Login
            </Button>
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <button className="lg:hidden text-primary-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="lg:hidden bg-primary border-t border-primary-foreground/10 pb-4">
          {primaryLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-6 py-3 text-sm font-medium transition-colors",
                isActive(link.path) ? "bg-secondary text-secondary-foreground" : "text-primary-foreground/90 hover:bg-primary/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-primary-foreground/50">Others</div>
          {otherLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block px-6 py-3 text-sm font-medium transition-colors",
                isActive(link.path) ? "bg-secondary text-secondary-foreground" : "text-primary-foreground/90 hover:bg-primary/80"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-6 pt-3">
            <Link to="/login" onClick={() => setMobileOpen(false)}>
              <Button variant="warm" size="sm" className="w-full">Login</Button>
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;

