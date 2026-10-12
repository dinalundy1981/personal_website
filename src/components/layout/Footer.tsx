import { Link } from "react-router-dom";
import { Mail, MapPin, Instagram, Linkedin, Youtube } from "lucide-react";

const navigationLinks = [
  { label: "About", path: "/about" },
  { label: "Books", path: "/books" },
  { label: "Courses", path: "/courses" },
  { label: "Work With Me", path: "/work-with-me" },
  { label: "Podcast", path: "/podcast" },
  { label: "Newsletter", path: "/newsletter" },
  { label: "Contact", path: "/contact" },
];

const socialLinks = [
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com/in/drlundy", label: "LinkedIn" },
  { icon: Youtube, href: "https://www.youtube.com/channel/UCUONXU0zh8n2T-gZO1mpisg", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="font-heading text-xl">Dr. Dina Lundy</h3>
            <p className="text-footer-foreground/60 text-sm leading-relaxed max-w-sm">
              Scholar, author, speaker, and advocate for education equity and personal development.
            </p>
            <div className="flex gap-2.5">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-8 h-8 rounded-md bg-footer-foreground/10 flex items-center justify-center text-footer-link hover:bg-footer-link hover:text-footer transition-all duration-300">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-footer-foreground/80 mb-4">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-2 text-sm">
              {navigationLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-footer-foreground/60 hover:text-footer-link transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-footer-foreground/80 mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <a href="mailto:contact@drdinalundy.com" className="flex items-center gap-2 text-footer-foreground/60 hover:text-footer-link transition-colors">
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@drdinalundy.com</span>
              </a>
              <div className="flex items-center gap-2 text-footer-foreground/60">
                <MapPin className="w-4 h-4 shrink-0" />
                <span>United States</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-footer-foreground/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-footer-foreground/40">
          <p>© {new Date().getFullYear()} Dr. Dina Lundy. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-footer-link transition-colors">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-footer-link transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
