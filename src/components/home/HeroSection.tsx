import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, PenTool, Scale, Award, ShieldCheck, GraduationCap } from "lucide-react";
import { useHeroSettings } from "@/hooks/useHeroSettings";

interface HeroSectionProps {
  heroImage?: string; // Kept for prop signature compatibility
}

const HeroSection = ({ heroImage }: HeroSectionProps) => {
  const { settings } = useHeroSettings();

  const badgeText = settings?.badge_text ?? "Family Advocate · Author · Keynote Speaker";
  const headingMain = settings?.heading_main ?? "Understanding the Human Mind While Strengthening";
  const headingHighlight = settings?.heading_highlight ?? "Court Cases.";
  const subtitle = settings?.subtitle ?? "Specializing in Psychological Analysis for Litigation, Criminal Cases and Forensic Evaluation";
  const description = settings?.description ?? "Dr. Dina Lundy is a nationally recognized scholar, author, and speaker who has dedicated her career to education equity, foster youth advocacy, and leadership development with confidence and authority.";
  const booksCountNumber = settings?.books_count_number ?? "5+";
  const booksCountLabel = settings?.books_count_label ?? "Published Books";
  const forthcomingLabel = settings?.forthcoming_label ?? "Forthcoming Release";
  const forthcomingTitle = settings?.forthcoming_title ?? "Self-Help Book for the Child Raised in Foster Care";

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-background py-12 md:py-20 lg:py-24">
      {/* Decorative premium radial gradients for rich aesthetics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,hsl(27,55%,78%,0.3),transparent_45%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_75%,hsl(35,39%,46%,0.15),transparent_55%)] pointer-events-none" />
      <div className="absolute -top-[30%] -right-[10%] w-[600px] h-[600px] rounded-full bg-secondary/5 blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/5 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column — Text & Main CTA */}
          <div className="order-2 lg:order-1 lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start">
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
              className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-primary leading-[1.05] tracking-tight mb-4"
            >
              {headingMain}{" "}
              <span className="text-secondary italic block lg:inline">{headingHighlight}</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg sm:text-xl font-medium text-foreground/80 mb-6 max-w-2xl"
            >
              {subtitle}
            </motion.p>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base text-muted-foreground leading-relaxed max-w-xl mb-8"
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
            </motion.div>
          </div>

          {/* Right Column — Elegant, Rich Information Dashboard (No photo) */}
          <div className="order-1 lg:order-2 lg:col-span-5 flex flex-col gap-6 w-full max-w-xl mx-auto lg:max-w-none">
            {/* Stat Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Stat Card 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold font-heading text-primary leading-none mb-1">{booksCountNumber}</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-tight">{booksCountLabel}</p>
              </motion.div>

              {/* Stat Card 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                  <Award className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-3xl sm:text-4xl font-bold font-heading text-secondary leading-none mb-1">30+</h3>
                <p className="text-xs text-muted-foreground font-semibold leading-tight">Years of Behavioral & Family Expertise</p>
              </motion.div>
            </div>

            {/* Forthcoming Book Feature Card (Clickable, links to books page) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}
              className="bg-gradient-to-br from-primary/[0.03] to-secondary/[0.03] backdrop-blur-md border border-primary/10 rounded-2xl p-6 shadow-sm hover:border-primary/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Sleek top brand accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-secondary" />
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0 text-secondary">
                  <PenTool className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="inline-block text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">
                    {forthcomingLabel}
                  </span>
                  <h4 className="text-xl font-bold font-heading text-primary leading-snug mb-2">
                    {forthcomingTitle}
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4">
                    A highly anticipated self-help and empowerment book crafted specifically for young adults navigating the critical transition from foster care and state custody to independent living.
                  </p>
                  <Link
                    to="/books"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-secondary transition-colors group/link"
                  >
                    Explore Dr. Lundy's Publications <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Core Pillars / Areas of Authority Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl p-6 shadow-sm"
            >
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-4">
                Areas of Expert Authority
              </h4>
              <div className="grid gap-4">
                {/* Pillar 1 */}
                <div className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-primary/[0.03] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:scale-105 transition-transform">
                    <Scale className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground leading-tight">Forensic & Litigation Consulting</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Specialized psychological analysis for Family Court, custody disputes & criminal forensic evaluations.</p>
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-secondary/[0.03] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground leading-tight">Foster Youth & Family Advocacy</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Empowering system-involved individuals and advising child welfare organizations nationally.</p>
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="flex items-start gap-3 p-1.5 rounded-lg hover:bg-accent/[0.03] transition-colors group">
                  <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0 group-hover:scale-105 transition-transform">
                    <GraduationCap className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-foreground leading-tight">Behavioral Science & Education Equity</h5>
                    <p className="text-xs text-muted-foreground mt-0.5">Deep research in human development, institutional bias, anti-racism, and social capital building.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
