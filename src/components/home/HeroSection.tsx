import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import profileImg from "@/assets/profile-placeholder.jpg";

interface HeroSectionProps {
  heroImage?: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const imgSrc = heroImage || profileImg;

  const scrollToAbout = () => {
    const el = document.getElementById("about-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-[85vh] md:min-h-screen flex flex-col items-center justify-center overflow-hidden bg-warm px-4 py-10">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--warm-bg)/0.6),transparent_70%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto flex flex-col items-center text-center max-w-6xl">
        {/* Script greeting */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="font-heading text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-primary/80 italic mb-4 md:mb-6 select-none"
        >
          Hey, there
        </motion.h2>

        {/* Profile image — NO circle, natural rectangle with soft corners */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="relative z-10 w-48 h-56 sm:w-56 sm:h-64 md:w-72 md:h-80 lg:w-80 lg:h-[22rem] xl:w-96 xl:h-[26rem] rounded-2xl overflow-hidden shadow-2xl"
        >
          <img src={imgSrc} alt="Dr. Dina Lundy" className="w-full h-full object-cover object-top" />
        </motion.div>

        {/* Info row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-6 gap-3">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-sm"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Available for speaking & coaching</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs sm:text-sm text-muted-foreground max-w-xs text-center sm:text-right"
          >
            Specialized in Education Equity, Foster Youth Advocacy, and Leadership Development.
          </motion.p>
        </div>

        {/* Bold name + title */}
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-end justify-between mt-6 md:mt-8 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="text-center sm:text-left"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-1">I AM</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary leading-[0.95] tracking-tight">
              DR. DINA
              <br />
              LUNDY
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
            className="text-center sm:text-right"
          >
            <h2 className="font-heading text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-primary font-bold leading-tight uppercase tracking-tight">
              Scholar
              <br />
              Author
              <br />
              Speaker
            </h2>
          </motion.div>
        </div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex flex-wrap gap-3 sm:gap-4 mt-8 sm:mt-10 justify-center"
        >
          <Link to="/books">
            <Button variant="default" size="lg" className="shadow-lg">
              <BookOpen className="w-5 h-5" /> View Books
            </Button>
          </Link>
          <Link to="/work-with-me">
            <Button variant="outline" size="lg">
              Work With Me
            </Button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          onClick={scrollToAbout}
          className="mt-8 md:mt-12 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label="Scroll to about section"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-8 rounded-full border-2 border-current flex items-start justify-center pt-1"
          >
            <span className="w-1 h-2 rounded-full bg-current" />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
