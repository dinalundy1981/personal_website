import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, PenTool, Scale, Award, ShieldCheck, GraduationCap, Sparkles } from "lucide-react";
import { useHeroSettings } from "@/hooks/useHeroSettings";
import dinaImg from "@/assets/dina-portrait.jpg";

interface HeroSectionProps {
  heroImage?: string;
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const { settings } = useHeroSettings();

  const badgeText = settings?.badge_text ?? "Authority on Families · Author · Behavior Change Consultant · Human Development Professor";
  const headingMain = settings?.heading_main ?? "Understanding the Human Mind While Strengthening";
  const headingHighlight = settings?.heading_highlight ?? "Court Cases.";
  const subtitle = settings?.subtitle ?? "Specializing in Psychological Analysis for Litigation, Criminal Cases and Forensic Evaluation";
  const description = settings?.description ?? "Dr. Dina Lundy is a leading scholar, author, and faculty director who brings deep historical insight and interdisciplinary expertise to forensic psychology, education equity, and systemic family advocacy.";
  const booksCountNumber = settings?.books_count_number ?? "5+";
  const booksCountLabel = settings?.books_count_label ?? "Published Books";
  const forthcomingLabel = settings?.forthcoming_label ?? "Forthcoming Release";
  const forthcomingTitle = settings?.forthcoming_title ?? "So You're On Your Own: A Practical Guide to Life Beyond Foster Care";

  const photoSrc = heroImage || dinaImg;

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-12 md:py-16 lg:py-20">
      {/* Decorative premium radial gradients for rich aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,hsl(27,55%,78%,0.3),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,hsl(35,39%,46%,0.15),transparent_55%)] pointer-events-none" />
      <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column — Text & Main CTA */}
          <div className="order-2 lg:order-1 lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            {/* Premium Animated Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
              <span className="text-xs font-semibold text-primary tracking-wide">{badgeText}</span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-heading text-4xl sm:text-5xl md:text-5xl lg:text-6xl text-primary leading-[1.08] tracking-tight mb-4"
            >
              {headingMain}{" "}
              <span className="text-secondary italic block lg:inline">{headingHighlight}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl font-medium text-foreground/85 mb-5 max-w-2xl"
            >
              {subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mb-8"
            >
              {description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
            >
              <Link to="/work-with-me">
                <Button variant="default" size="lg" className="shadow-lg group text-base font-semibold px-6 py-6 h-auto">
                  Book Dr. Lundy <ArrowRight className="w-5 h-5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="text-base font-semibold px-6 py-6 h-auto hover:bg-primary/5 transition-colors">
                  Learn More
                </Button>
              </Link>
              <Link to="/books">
                <Button variant="secondary" size="lg" className="text-base font-semibold px-6 py-6 h-auto">
                  View Publications
                </Button>
              </Link>
            </motion.div>

            {/* Areas of Expertise Mini-Pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-8 pt-6 border-t border-border/60 w-full flex flex-wrap gap-2 justify-center lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary">
                <Scale className="w-3.5 h-3.5" /> Forensic & Court Consulting
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-secondary/15 text-secondary">
                <ShieldCheck className="w-3.5 h-3.5" /> Foster Youth & Family Advocacy
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent">
                <GraduationCap className="w-3.5 h-3.5" /> Behavioral Science & Equity
              </span>
            </motion.div>
          </div>

          {/* Right Column — Personal Photo with Rich Glassmorphic Badges */}
          <div className="order-1 lg:order-2 lg:col-span-6 flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="relative w-full max-w-md sm:max-w-lg lg:max-w-none"
            >
              {/* Decorative background glow behind portrait */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-secondary/25 via-primary/10 to-transparent rounded-3xl blur-2xl opacity-70 pointer-events-none" />

              {/* Portrait Container */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-border/80 shadow-2xl bg-card">
                <img
                  src={photoSrc}
                  alt="Dr. Dina Lundy"
                  className="w-full h-[400px] sm:h-[480px] lg:h-[520px] object-cover object-top hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Subtle dark gradient overlay on bottom for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Floating Bottom Left Badge: 15+ Years of Behavioral & Family Expertise */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-xs bg-card/95 backdrop-blur-md border border-border/80 rounded-2xl p-4 shadow-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-secondary/15 flex items-center justify-center flex-shrink-0 text-secondary">
                      <Award className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl sm:text-3xl font-extrabold font-heading text-secondary leading-none">15</span>
                        <span className="text-lg font-bold text-secondary leading-none">+</span>
                        <span className="text-xs font-semibold text-muted-foreground ml-1">Years</span>
                      </div>
                      <p className="text-xs text-foreground font-semibold leading-snug mt-0.5">
                        Behavioral & Family Expertise
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating Top Right Badge: Published Books */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="absolute top-4 right-4 bg-primary/95 text-primary-foreground backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-xl flex items-center gap-2.5 border border-primary-foreground/20"
                >
                  <BookOpen className="w-4 h-4 text-secondary" />
                  <div>
                    <p className="text-sm font-extrabold leading-none">{booksCountNumber}</p>
                    <p className="text-[10px] text-primary-foreground/80 leading-none mt-0.5">{booksCountLabel}</p>
                  </div>
                </motion.div>
              </div>

              {/* Forthcoming Release Teaser Card below photo */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-4 bg-card/90 backdrop-blur-md border border-secondary/30 rounded-2xl p-4 shadow-md flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      {forthcomingLabel}
                    </span>
                    <p className="text-xs sm:text-sm font-semibold text-primary truncate">
                      {forthcomingTitle}
                    </p>
                  </div>
                </div>
                <Link to="/books" className="flex-shrink-0">
                  <Button variant="outline" size="sm" className="text-xs font-semibold h-8 gap-1">
                    Explore <ArrowRight className="w-3 h-3" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
