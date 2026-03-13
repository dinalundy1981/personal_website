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

  return (
    <section className="relative min-h-[80vh] md:min-h-[90vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-warm/60 via-warm/30 to-background px-4">
      {/* Decorative radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full bg-warm/50 blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto flex flex-col items-center text-center max-w-5xl">
        {/* Script greeting */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-heading text-4xl sm:text-5xl md:text-7xl lg:text-8xl text-primary/80 italic mb-[-1.5rem] sm:mb-[-2rem] md:mb-[-3rem] z-0 select-none"
        >
          Hey, there
        </motion.h2>

        {/* Profile image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative z-10 w-40 h-40 sm:w-52 sm:h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-full overflow-hidden border-4 border-warm shadow-2xl"
        >
          <img src={imgSrc} alt="Dr. Dina Lundy" className="w-full h-full object-cover" />
        </motion.div>

        {/* Info row */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-6 md:mt-4 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-2 shadow-sm"
          >
            <span className="w-3 h-3 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-foreground">Available for speaking & coaching</span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-xs sm:text-sm text-muted-foreground max-w-xs text-center sm:text-right"
          >
            Specialized in Education Equity, Foster Youth Advocacy, and Leadership Development.
          </motion.p>
        </div>

        {/* Bold name + title */}
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-end justify-between mt-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="text-center sm:text-left"
          >
            <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-muted-foreground mb-1">I AM</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-primary leading-none tracking-tight">
              DR. DINA
              <br />
              LUNDY
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.7 }}
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
          transition={{ delay: 0.8, duration: 0.6 }}
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
      </div>
    </section>
  );
};

export default HeroSection;
