import { Link } from "react-router-dom";
import { Mail, MapPin, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const quickLinks = [
  { label: "Books", path: "/books" },
  { label: "Courses", path: "/courses" },
  { label: "Events", path: "/events" },
  { label: "Blog", path: "/blog" },
  { label: "Podcast", path: "/podcast" },
  { label: "Contact", path: "/contact" },
];

const resourceLinks = [
  { label: "Work With Me", path: "/work-with-me" },
  { label: "Publishing", path: "/publishing" },
  { label: "Media", path: "/media" },
  { label: "Newsletter", path: "/newsletter" },
  { label: "Privacy Policy", path: "/privacy-policy" },
];

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "X (Twitter)" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-heading text-xl mb-3">Dr. Dina Lundy</h3>
            <p className="text-footer-foreground/60 text-sm leading-relaxed mb-5">
              Scholar, author, speaker, and advocate for education equity and personal development.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-8 h-8 rounded-md bg-footer-foreground/10 flex items-center justify-center text-footer-link hover:bg-footer-link hover:text-footer transition-all duration-300">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-footer-foreground/80 mb-3">Explore</h4>
            <ul className="space-y-1.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-footer-foreground/60 hover:text-footer-link transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-footer-foreground/80 mb-3">Resources</h4>
            <ul className="space-y-1.5 text-sm">
              {resourceLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-footer-foreground/60 hover:text-footer-link transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-sm uppercase tracking-wider text-footer-foreground/80 mb-3">Contact</h4>
            <div className="space-y-2 text-sm">
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

        <div className="border-t border-footer-foreground/10 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-footer-foreground/40">
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
