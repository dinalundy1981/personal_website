import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-heading text-2xl mb-4">Dr. Dina Lundy</h3>
            <p className="text-footer-foreground/70 text-sm leading-relaxed">
              Scholar, author, speaker, and advocate dedicated to education equity, 
              foster youth advocacy, and personal development.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Books", path: "/books" },
                { label: "Courses", path: "/courses" },
                { label: "Events", path: "/events" },
                { label: "Blog", path: "/blog" },
                { label: "Work With Me", path: "/work-with-me" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-footer-link hover:text-footer-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg mb-4">Get In Touch</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-footer-link">
                <Mail className="w-4 h-4" />
                <span>contact@drdinalundy.com</span>
              </div>
              <div className="flex items-center gap-2 text-footer-link">
                <MapPin className="w-4 h-4" />
                <span>United States</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-footer-foreground/10 mt-12 pt-8 text-center text-sm text-footer-foreground/50">
          © {new Date().getFullYear()} Dr. Dina Lundy. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
