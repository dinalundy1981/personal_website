import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import profileImg from "@/assets/profile-placeholder.jpg";

interface AboutPreviewProps {
  images: Record<string, string>;
}

const AboutPreview = ({ images }: AboutPreviewProps) => {
  const img1 = images["about_1"] || profileImg;
  const img2 = images["about_2"] || profileImg;
  const img3 = images["about_3"] || profileImg;
  const img4 = images["about_4"] || profileImg;

  return (
    <section id="about-section" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Photo Collage — reference-style staggered layout */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            <div className="grid grid-cols-12 grid-rows-6 gap-2 sm:gap-3" style={{ minHeight: "340px" }}>
              {/* Top-left — tall */}
              <div className="col-span-5 row-span-4 rounded-2xl overflow-hidden shadow-lg">
                <img src={img1} alt="Dr. Dina Lundy speaking" className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Top-right — wide */}
              <div className="col-span-7 row-span-3 rounded-2xl overflow-hidden shadow-lg">
                <img src={img2} alt="Dr. Dina Lundy portrait" className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Bottom-right top */}
              <div className="col-span-7 row-span-3 rounded-2xl overflow-hidden shadow-lg">
                <img src={img3} alt="Dr. Dina Lundy coaching" className="w-full h-full object-cover" loading="lazy" />
              </div>
              {/* Bottom-left */}
              <div className="col-span-5 row-span-2 rounded-2xl overflow-hidden shadow-lg">
                <img src={img4} alt="Dr. Dina Lundy at event" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-2xl text-center ring-4 ring-background">
                <span className="text-xl sm:text-2xl font-bold leading-none">30+</span>
                <span className="text-[8px] sm:text-[10px] leading-tight mt-0.5">Years of<br />Expertise</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-secondary mb-2">About Dr. Dina Lundy</p>
            <div className="w-12 h-1 bg-secondary rounded-full mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary mb-2 leading-tight">
              The Voice of<br />
              <span className="text-secondary italic">Authority & Insight</span>
            </h2>
            <p className="text-foreground/80 leading-relaxed mt-4 mb-4">
              Born and raised in New York City, Dr. Dina Lundy built a coffee bar chain from the ground up, becoming a millionaire at 28. That success led her to pursue something deeper—her purpose. She earned a doctorate, transitioned into academe, writing, and life coaching, helping others break through their fear and build lives they believe in.
            </p>
            <p className="text-foreground/80 leading-relaxed mb-8">
              As a writer, researcher, and public speaker, her work intersects systemic inequity, implicit bias, and the phenomenology of youth whose lives have been shaped by foster care and criminal justice involvement. Her philosophy: <span className="font-semibold italic text-primary">"Empower through education."</span>
            </p>

            {/* Stats row */}
            <div className="flex gap-6 sm:gap-8 md:gap-12 mb-8">
              {[
                { num: "5+", label: "Published Books" },
                { num: "100+", label: "Speaking Events" },
                { num: "20+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.num}</span>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link to="/about" className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group">
              Learn More About Dr. Lundy <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
