import { motion } from "framer-motion";
import { FileText, Download, Award, GraduationCap, BookOpen, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import dinaImg from "@/assets/dina-portrait.jpg";
import SEO from "@/components/SEO";

const CV_DOC_URL = "https://docs.google.com/document/d/1jb_Wn_M8xVBIO34LTtuspECo7sm2vOrg/edit?usp=sharing&ouid=118314648783378577970&rtpof=true&sd=true";
const CV_PDF_URL = "/Dr_Adina_Lundy_CV.pdf";

const socials = [
  {
    label: "TikTok", href: "https://www.tiktok.com/@prettypsychprofessor", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.89 2.89 2.89 0 0 1 2.88-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.76 1.52V6.84a4.84 4.84 0 0 1-1-.15z" /></svg>
    )
  },
  {
    label: "LinkedIn", href: "https://www.linkedin.com/in/drlundy", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.47 2H3.53A1.45 1.45 0 0 0 2 3.47v17.06A1.45 1.45 0 0 0 3.53 22h16.94A1.45 1.45 0 0 0 22 20.53V3.47A1.45 1.45 0 0 0 20.47 2zM8.09 18.74h-3v-9h3v9zM6.59 8.48a1.56 1.56 0 1 1 0-3.12 1.56 1.56 0 0 1 0 3.12zM18.91 18.74h-3v-4.26c0-1.14-.23-2.26-1.58-2.26s-1.82 1.23-1.82 2.18v4.34h-3v-9h2.88v1.23h.04a3.16 3.16 0 0 1 2.85-1.56c3.05 0 3.63 2 3.63 4.63v4.7z" /></svg>
    )
  },
  {
    label: "YouTube", href: "https://www.youtube.com/channel/UCUONXU0zh8n2T-gZO1mpisg", icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.81 3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" /></svg>
    )
  },
];

const About = () => {
  return (
    <Layout>
      <SEO
        title="About Dr. Dina Lundy"
        description="Learn more about Dr. Dina Lundy's background as an entrepreneur, writer, public speaker, and Associate Director of Undergraduate Psychology."
        keywords="Dr Dina Lundy, about Dina Lundy, psychologist Dina Lundy, educational equity advocate, Dina Lundy CV"
      />

      {/* Hero with Prominent Portrait of Dr. Dina Lundy */}
      <section className="py-12 md:py-20 bg-warm/30 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
            {/* Portrait Column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={0}
              className="lg:col-span-5 flex flex-col items-center"
            >
              <div className="relative w-full max-w-sm sm:max-w-md">
                <div className="absolute -inset-3 bg-gradient-to-tr from-secondary/30 via-primary/10 to-transparent rounded-3xl blur-xl opacity-75 pointer-events-none" />
                <div className="relative rounded-3xl overflow-hidden border-2 border-border shadow-2xl bg-card">
                  <img
                    src={dinaImg}
                    alt="Dr. Dina Lundy"
                    className="w-full h-[380px] sm:h-[440px] object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Overlay Badge */}
                  <div className="absolute bottom-4 left-4 right-4 bg-card/95 backdrop-blur-md border border-border/80 rounded-xl p-3 shadow-lg">
                    <p className="font-heading font-bold text-base text-primary">Dr. Adina Lundy, EdD</p>
                    <p className="text-xs text-muted-foreground font-medium">Academic Director & Psychology Scholar</p>
                  </div>
                </div>

                {/* Social icons */}
                <div className="flex justify-center gap-3 mt-4">
                  {socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-secondary transition-colors shadow-md"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Intro & Credentials Column */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary uppercase tracking-widest bg-secondary/10 px-3 py-1 rounded-full mb-3">
                  <Award className="w-3.5 h-3.5" /> 15+ Years Behavioral & Family Expertise
                </span>
                <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary leading-tight">
                  About Dr.&nbsp;Dina Lundy
                </h1>
                <p className="text-muted-foreground text-base sm:text-lg mt-2 font-medium">
                  Faculty Leader, Author, Forensic Consultant & Advocate for Education Equity.
                </p>
              </motion.div>

              <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-foreground/85 leading-relaxed text-sm sm:text-base">
                Dr. Dina (Adina) Lundy is a higher education leader, author, and researcher specializing in psychological analysis for litigation, human development, and systemic equity. She serves as Director of Undergraduate Psychology at the University of Rhode Island and works with the Public Defender’s Office of the New Jersey Family Court.
              </motion.p>

              {/* CV Action Buttons */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={2} className="pt-2 flex flex-wrap gap-3 justify-center lg:justify-start">
                <a href={CV_PDF_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="default" size="lg" className="font-semibold shadow-md gap-2">
                    <Download className="w-4 h-4" /> Download Official CV (PDF)
                  </Button>
                </a>
                <a href={CV_DOC_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="lg" className="font-semibold gap-2 hover:bg-secondary hover:text-secondary-foreground transition-colors">
                    <ExternalLink className="w-4 h-4" /> View Live CV Document
                  </Button>
                </a>
              </motion.div>

              {/* Quick Stat Highlights */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="grid grid-cols-3 gap-3 pt-4 border-t border-border/60">
                <div className="bg-card/70 border rounded-xl p-3 text-center">
                  <p className="text-xl sm:text-2xl font-bold font-heading text-primary">EdD</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Higher Ed Leadership</p>
                </div>
                <div className="bg-card/70 border rounded-xl p-3 text-center">
                  <p className="text-xl sm:text-2xl font-bold font-heading text-secondary">Harvard</p>
                  <p className="text-[11px] text-muted-foreground font-medium">MA Psychology</p>
                </div>
                <div className="bg-card/70 border rounded-xl p-3 text-center">
                  <p className="text-xl sm:text-2xl font-bold font-heading text-accent">15+ Yrs</p>
                  <p className="text-[11px] text-muted-foreground font-medium">Behavioral Expertise</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Biography & Detailed Experience */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {/* Story */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={0} className="space-y-4">
            <div className="flex items-center gap-2 text-secondary font-bold text-xs uppercase tracking-widest">
              <GraduationCap className="w-4 h-4" /> Background & Evolution
            </div>
            <h2 className="font-heading text-2xl sm:text-3xl text-primary">My Story</h2>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              Born and raised in New York City, I built a coffee bar chain from the ground up making me a millionaire at 28. That success led me to pursue something deeper—my purpose. I earned a doctorate in Higher Education Leadership from the University of Hartford, a master's in Psychology from Harvard University, and transitioned into academe, writing, and life coaching. I help others break through fear and build lives they believe in. I split my time between the energy of my hometown and the calm of the Boston suburbs.
            </p>
          </motion.div>

          {/* Academic & Forensic Bio */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={1} className="space-y-4">
            <h3 className="font-heading text-xl sm:text-2xl text-primary">Bio & Leadership</h3>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              As a writer and researcher I seek etiology regarding systemic inequity. To that end I utilize social capital to advance equity, access, and knowledge in academic spaces. I possess over 15 years of behavioral and family expertise with eleven years of experience in teaching, researching, and administering undergraduate psychology programs, with a focus on retention vis a vis multicultural, social, and human developmental psychology.
            </p>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              As an expert witness for the Office of the Public Defender in New Jersey Family Court, my work intersects implicit bias, generational poverty, and the phenomenology of youth and adults whose bodies have been monetized and their families criminalized through foster care and criminal justice involvement.
            </p>
          </motion.div>

          {/* Publications & Projects */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={2} className="space-y-4">
            <h3 className="font-heading text-xl sm:text-2xl text-primary">Publications & Research</h3>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              My publications include <span className="italic font-semibold text-primary">The Psychological Perspectives of LATINX and Chicano Populations</span> (Cognella), <span className="italic font-semibold text-primary">Broadening Our Multicultural Lens</span> (Cognella), and <span className="italic font-semibold text-primary">Understanding Psychological Concepts</span> (Kendall Hunt), alongside numerous peer-reviewed book chapters and journal articles on human factors psychology, cybersecurity behavior, and education access.
            </p>
            <p className="text-foreground/80 leading-relaxed text-sm sm:text-base">
              Colleagues Dr. Tracie McCargo, Dr. Bailey Thomas, Anne Saluzaro-McGuigan and I are developing a conference at URI to impact the dismal statistics faced by Women of Color in the academy. The <span className="font-semibold text-primary">Publish or Perish Conference</span> is planned for Fall of 2025.
            </p>
          </motion.div>

          {/* Research Focus List */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} custom={3} className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
            <h3 className="font-heading text-xl sm:text-2xl text-primary mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Core Research Focus
            </h3>
            <ul className="grid sm:grid-cols-2 gap-3 text-foreground/80 text-sm">
              {[
                "Systemic inequity and social capital in academic spaces",
                "Multicultural, social, and human developmental psychology",
                "Forensic psychological evaluation for Family Courts",
                "Implicit bias in medicine and the academy",
                "Foster care survivors and criminal justice involvement",
                "Generational poverty and youth phenomenology",
                "Human factors in cyber risk and healthcare psychology",
                "Educational trajectories for system-involved youth",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Download Full CV Card Banner */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={4}
            className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-heading text-xl sm:text-2xl font-bold">Curriculum Vitae (CV)</h3>
              <p className="text-primary-foreground/80 text-xs sm:text-sm max-w-lg">
                View Dr. Dina Lundy's full academic credentials, leadership appointments, peer-reviewed publications, and conference presentations.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 justify-center sm:justify-end">
              <a href={CV_PDF_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg" className="font-semibold shadow-md gap-1.5 text-xs sm:text-sm">
                  <Download className="w-4 h-4" /> Download PDF
                </Button>
              </a>
              <a href={CV_DOC_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-xs sm:text-sm gap-1.5">
                  <FileText className="w-4 h-4" /> Google Doc
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
