import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import dinaImg from "@/assets/dina-portrait.jpg";

const socials = [
  { label: "TikTok", href: "https://www.tiktok.com/@prettypsychprofessor", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z"/></svg>
  )},
  { label: "LinkedIn", href: "https://www.linkedin.com/in/drlundy", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.47 2H3.53A1.45 1.45 0 0 0 2 3.47v17.06A1.45 1.45 0 0 0 3.53 22h16.94A1.45 1.45 0 0 0 22 20.53V3.47A1.45 1.45 0 0 0 20.47 2zM8.09 18.74h-3v-9h3v9zM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12zM18.91 18.74h-3v-4.26c0-1.14-.23-2.26-1.58-2.26s-1.82 1.23-1.82 2.18v4.34h-3v-9h2.88v1.23h.04a3.16 3.16 0 0 1 2.85-1.56c3.05 0 3.63 2 3.63 4.63v4.7z"/></svg>
  )},
  { label: "YouTube", href: "https://www.youtube.com/@PrettyPsychProfessor", icon: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z"/></svg>
  )},
];

const About = () => {
  const imgRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: imgRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-12 md:py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
            About Dr.&nbsp;Dina Lundy
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Scholar, author, life coach, and advocate for education equity.
          </motion.p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Image column */}
            <div ref={imgRef}>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={0}
                style={{ y: imgY }}
                className="sticky top-24"
              >
                <div className="rounded-2xl overflow-hidden shadow-xl max-w-xs sm:max-w-sm md:max-w-md mx-auto lg:max-w-none">
                  <img src={dinaImg} alt="Dr. Dina Lundy" className="w-full h-auto" />
                </div>

                {/* Social icons */}
                <div className="flex justify-center gap-4 mt-6">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Text column */}
            <div className="space-y-8">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={0} className="space-y-4">
                <h2 className="font-heading text-2xl sm:text-3xl text-primary">My Story</h2>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  Born and raised in New York City, I built a coffee bar chain from the ground up making me a millionaire at 28. That success led me to pursue something deeper—my purpose. I earned a doctorate, transitioned into academe, writing, and life coaching. I help others break through their fear and build lives they believe in. I split my time between the energy of my hometown and the calm of the Boston suburbs.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={1} className="space-y-4">
                <h3 className="font-heading text-xl sm:text-2xl text-primary">Bio</h3>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  As a writer and researcher I seek etiology regarding systemic inequity. To that end I utilize social capital to advance equity, access, and knowledge in academic spaces. I possess eleven years of experience in teaching, researching, and administering undergraduate psychology programs, with a focus on retention vis a vis multicultural, social, and human developmental psychology.
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  As a public speaker and workshop developer, my work intersects implicit bias in medicine and the academy. Generational poverty, and the phenomenology of youth and adults, whose bodies have been monetized and their families criminalized, through foster care and criminal justice involvement.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={2} className="space-y-4">
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  Last summer I completed my second book, <span className="italic font-semibold text-primary">The Psychological Perspectives of LATINX and Chicano Populations</span> in which I discuss the chattel slavery implications of the Bracero Program. The Forward is by Rosalba Moreno, a Chicana and community activist from the Salinas Valley.
                </p>
                <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
                  Colleagues Dr. Tracie McCargo, Dr. Bailey Thomas, Anne Saluzaro-McGuigan and I are developing a conference at URI to impact the dismal statistics faced by Women of Color in the academy. The <span className="font-semibold text-primary">Publish or Perish Conference</span> is planned Fall of 2025.
                </p>
              </motion.div>

              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.3 }} variants={fadeUp} custom={3}>
                <h3 className="font-heading text-xl sm:text-2xl text-primary mb-4">Research Focus</h3>
                <ul className="space-y-2 text-foreground/80 text-sm sm:text-base">
                  {[
                    "Systemic inequity and social capital in academic spaces",
                    "Multicultural, social, and human developmental psychology",
                    "Implicit bias in medicine and the academy",
                    "Foster care and criminal justice involvement",
                    "Generational poverty and youth phenomenology",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
