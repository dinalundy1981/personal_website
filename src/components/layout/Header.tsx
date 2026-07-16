import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut, Shield, LayoutDashboard, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import CartButton from "@/components/checkout/CartButton";

const primaryLinks = [
  { label: "Home", path: "/" },
  { label: "About", path: "/about" },
  { label: "Publishing", path: "/publishing" },
  { label: "Books", path: "/books" },
  { label: "Work With Me", path: "/work-with-me" },
  { label: "Podcast", path: "/podcast" },
  { label: "Courses", path: "/courses" },
  { label: "Newsletter", path: "/newsletter" },
  { label: "TEDxTalk", path: "/tedxtalk" },
  { label: "Contact", path: "/contact" },
];

const CV_URL = "https://docs.google.com/document/d/1VULjLVU1uTAbmofsCVeWIwMZquFB0HJj/mobilebasic";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAdmin, signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

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

          <CartButton />

          {user ? (
            <div className="flex items-center gap-2 ml-2">
              <Link to="/dashboard">
                <Button variant="warm" size="sm"><LayoutDashboard className="w-4 h-4 mr-1" /> Dashboard</Button>
              </Link>
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="warm" size="sm"><Shield className="w-4 h-4 mr-1" /> Admin</Button>
                </Link>
              )}
              <a href={CV_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="warm" size="sm"><FileText className="w-4 h-4 mr-1" /> CV</Button>
              </a>
              <Button variant="warm" size="sm" onClick={handleLogout}><LogOut className="w-4 h-4 mr-1" /> Logout</Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-2">
              <a href={CV_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="warm" size="sm"><FileText className="w-4 h-4 mr-1" /> CV</Button>
              </a>
              <Link to="/login">
                <Button variant="warm" size="sm">Login</Button>
              </Link>
            </div>
          )}
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
          <div className="px-6 pt-3 space-y-2">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="warm" size="sm" className="w-full"><LayoutDashboard className="w-4 h-4 mr-1" /> My Dashboard</Button>
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setMobileOpen(false)}>
                    <Button variant="warm" size="sm" className="w-full"><Shield className="w-4 h-4 mr-1" /> Admin Dashboard</Button>
                  </Link>
                )}
                <a href={CV_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                  <Button variant="warm" size="sm" className="w-full"><FileText className="w-4 h-4 mr-1" /> CV</Button>
                </a>
                <Button variant="warm" size="sm" className="w-full" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </Button>
              </>
            ) : (
              <>
                <a href={CV_URL} target="_blank" rel="noopener noreferrer" onClick={() => setMobileOpen(false)}>
                  <Button variant="warm" size="sm" className="w-full"><FileText className="w-4 h-4 mr-1" /> CV</Button>
                </a>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="warm" size="sm" className="w-full">Login</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
