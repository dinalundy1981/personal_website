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
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">
      {/* Warm radial gradient background — matching reference */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,hsl(27,55%,78%,0.55),hsl(0,0%,100%,0)_70%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto flex-1 flex flex-col px-4 pt-8 md:pt-12">
        {/* Top area: image + "Hey, there" overlapping */}
        <div className="relative flex flex-col items-center flex-1">
          {/* "Hey, there" text — sits BEHIND the image */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="font-heading italic text-primary/70 text-5xl sm:text-6xl md:text-8xl lg:text-9xl select-none absolute top-[30%] sm:top-[28%] md:top-[25%] left-1/2 -translate-x-1/2 z-10 whitespace-nowrap pointer-events-none"
          >
            Hey, there
          </motion.h2>

          {/* Profile image — large, centered, overlapping text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="relative z-20 w-52 sm:w-64 md:w-80 lg:w-[22rem] xl:w-[26rem] mt-4"
          >
            <img
              src={imgSrc}
              alt="Dr. Dina Lundy"
              className="w-full h-auto object-cover object-top"
              style={{ maxHeight: "70vh" }}
            />
          </motion.div>

          {/* Info row — positioned over the image area */}
          <div className="absolute bottom-[38%] sm:bottom-[36%] md:bottom-[34%] left-0 right-0 z-30 flex flex-col sm:flex-row items-center justify-between px-2 md:px-8 gap-3">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-3 py-1.5 sm:px-4 sm:py-2 shadow-sm"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span className="text-[11px] sm:text-sm font-medium text-foreground">Available for speaking & coaching</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="text-[11px] sm:text-sm text-muted-foreground max-w-[200px] sm:max-w-xs text-center sm:text-right leading-snug"
            >
              Specialized in Education Equity, Foster Youth Advocacy, and Leadership Development.
            </motion.p>
          </div>

          {/* Bottom name + role — overlapping bottom of image */}
          <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-0 right-0 z-30 flex flex-col sm:flex-row items-end justify-between px-2 md:px-8 gap-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              className="text-center sm:text-left"
            >
              <p className="text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground mb-0.5">I AM</p>
              <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl text-primary leading-[0.9] tracking-tight font-bold">
                DR. DINA
                <br />
                LUNDY
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-center sm:text-right"
            >
              <h2 className="font-heading text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl text-primary font-bold leading-[0.95] uppercase tracking-tight">
                Scholar
                <br />
                Author
                <br />
                Speaker
              </h2>
            </motion.div>
          </div>
        </div>

        {/* CTA buttons — below the hero composition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap gap-3 sm:gap-4 justify-center py-6 md:py-8"
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
          className="mx-auto mb-4 flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          aria-label="Scroll to about section"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-5 h-7 rounded-full border-2 border-current flex items-start justify-center pt-1"
          >
            <span className="w-1 h-1.5 rounded-full bg-current" />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
};

export default HeroSection;
