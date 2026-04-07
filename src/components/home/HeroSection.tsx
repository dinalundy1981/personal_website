import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight } from "lucide-react";
import profileImg from "@/assets/profile-placeholder.jpg";

interface HeroSectionProps {
  heroImage?: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const imgSrc = heroImage || profileImg;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background">
      {/* Subtle warm gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_50%,hsl(27,55%,78%,0.25),transparent_60%)] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left — Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-secondary" />
              <span className="text-xs font-semibold text-primary tracking-wide">Scholar · Author · Speaker</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary leading-[0.95] tracking-tight mb-4"
            >
              Empowering Marginalized Populations Through{" "}
              <span className="text-secondary italic">Education.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-base sm:text-lg font-medium text-foreground/70 mb-4"
            >
              Education Equity Advocate
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0 mb-8"
            >
              Dr. Dina Lundy is a nationally recognized scholar, author, and speaker who has dedicated her career to education equity, foster youth advocacy, and leadership development with confidence and authority.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link to="/work-with-me">
                <Button variant="default" size="lg" className="shadow-lg group">
                  Book Dr. Lundy <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right — Profile Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="order-1 lg:order-2 relative flex justify-center"
          >
            <div className="relative w-64 sm:w-72 md:w-80 lg:w-[22rem] xl:w-[26rem]">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/30">
                <img
                  src={imgSrc}
                  alt="Dr. Dina Lundy"
                  className="w-full h-auto object-cover object-top"
                  style={{ maxHeight: "75vh" }}
                />
              </div>


              {/* Floating books badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.85, duration: 0.5 }}
                className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 bg-card border border-border rounded-xl px-4 py-3 shadow-lg flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold text-primary leading-none">5+</p>
                  <p className="text-[10px] text-muted-foreground">Published Books</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
