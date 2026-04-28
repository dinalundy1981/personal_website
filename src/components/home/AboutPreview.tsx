import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { fadeUp } from "@/lib/animations";
import profileImg from "@/assets/profile-placeholder.jpg";
import { useAboutSettings } from "@/hooks/useAboutSettings";

interface AboutPreviewProps {
  images: Record<string, string>;
}

const AboutPreview = ({ images }: AboutPreviewProps) => {
  const { settings } = useAboutSettings();
  const img1 = images["about_1"] || profileImg;
  const img2 = images["about_2"] || profileImg;
  const img3 = images["about_3"] || profileImg;
  const img4 = images["about_4"] || profileImg;

  const s = settings;

  return (
    <section id="about-section" className="py-16 md:py-24 bg-background scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="relative w-full max-w-lg mx-auto lg:max-w-none"
          >
            <div className="grid grid-cols-12 grid-rows-6 gap-2 sm:gap-3" style={{ minHeight: "340px" }}>
              <div className="col-span-5 row-span-4 rounded-2xl overflow-hidden shadow-lg">
                <img src={img1} alt="Dr. Dina Lundy speaking" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="col-span-7 row-span-3 rounded-2xl overflow-hidden shadow-lg">
                <img src={img2} alt="Dr. Dina Lundy portrait" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="col-span-7 row-span-3 rounded-2xl overflow-hidden shadow-lg">
                <img src={img3} alt="Dr. Dina Lundy coaching" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="col-span-5 row-span-2 rounded-2xl overflow-hidden shadow-lg">
                <img src={img4} alt="Dr. Dina Lundy at event" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5, type: "spring" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className="bg-primary text-primary-foreground rounded-full w-20 h-20 sm:w-24 sm:h-24 flex flex-col items-center justify-center shadow-2xl text-center ring-4 ring-background">
                <span className="text-xl sm:text-2xl font-bold leading-none">{s?.badge_number ?? "30+"}</span>
                <span className="text-[8px] sm:text-[10px] leading-tight mt-0.5 px-1">{s?.badge_label ?? "Years of Expertise"}</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={1}
          >
            <p className="text-sm font-semibold tracking-widest uppercase text-secondary mb-2">
              {s?.eyebrow ?? "About Dr. Dina Lundy"}
            </p>
            <div className="w-12 h-1 bg-secondary rounded-full mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary mb-2 leading-tight">
              {s?.heading_line1 ?? "The Voice of"}<br />
              <span className="text-secondary italic">{s?.heading_highlight ?? "Authority & Insight"}</span>
            </h2>
            <p className="text-foreground/80 leading-relaxed mt-4 mb-4 whitespace-pre-line">
              {s?.paragraph1 ?? ""}
            </p>
            <p className="text-foreground/80 leading-relaxed mb-8 whitespace-pre-line">
              {s?.paragraph2 ?? ""}{" "}
              {s?.quote && <span className="font-semibold italic text-primary">"{s.quote}"</span>}
            </p>

            <div className="flex gap-6 sm:gap-8 md:gap-12 mb-8">
              {[
                { num: s?.stat1_number ?? "5+", label: s?.stat1_label ?? "Published Books" },
                { num: s?.stat2_number ?? "100+", label: s?.stat2_label ?? "Speaking Events" },
                { num: s?.stat3_number ?? "20+", label: s?.stat3_label ?? "Years Experience" },
              ].map((stat) => (
                <div key={stat.label} className="text-center sm:text-left">
                  <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.num}</span>
                  <p className="text-xs sm:text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            <Link to="/about" className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-3 transition-all group">
              {s?.button_text ?? "Learn More About Dr. Lundy"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
