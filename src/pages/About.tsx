import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import dinaImg from "@/assets/dina-portrait.jpg";

const About = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">About Dr. Dina Lundy</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Scholar, author, life coach, and advocate for education equity.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="rounded-2xl overflow-hidden shadow-xl"><img src={dinaImg} alt="Dr. Dina Lundy" className="w-full h-auto" /></div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
            <h2 className="font-heading text-3xl text-primary">My Story</h2>
            <p className="text-foreground/80 leading-relaxed">
              Born and raised in New York City, I built a coffee bar chain from the ground up making me a millionaire at 28. That success led me to pursue something deeper—my purpose. I earned a doctorate, transitioned into academe, writing, and life coaching. I help others break through their fear and build lives they believe in. I split my time between the energy of my hometown and the calm of the Boston suburbs.
            </p>

            <h3 className="font-heading text-2xl text-primary pt-4">Bio</h3>
            <p className="text-foreground/80 leading-relaxed">
              As a writer and researcher I seek etiology regarding systemic inequity. To that end I utilize social capital to advance equity, access, and knowledge in academic spaces. I possess eleven years of experience in teaching, researching, and administering undergraduate psychology programs, with a focus on retention vis a vis multicultural, social, and human developmental psychology.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              As a public speaker and workshop developer, my work intersects implicit bias in medicine and the academy. Generational poverty, and the phenomenology of youth and adults, whose bodies have been monetized and their families criminalized, through foster care and criminal justice involvement.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Last summer I completed my second book, <span className="italic font-semibold text-primary">The Psychological Perspectives of LATINX and Chicano Populations</span> in which I discuss the chattel slavery implications of the Bracero Program. The Forward is by Rosalba Moreno, a Chicana and community activist from the Salinas Valley.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Colleagues Dr. Tracie McCargo, Dr. Bailey Thomas, Anne Saluzaro-McGuigan and I are developing a conference at URI to impact the dismal statistics faced by Women of Color in the academy. The <span className="font-semibold text-primary">Publish or Perish Conference</span> is planned Fall of 2025.
            </p>

            <h3 className="font-heading text-2xl text-primary pt-4">Research Focus</h3>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Systemic inequity and social capital in academic spaces</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Multicultural, social, and human developmental psychology</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Implicit bias in medicine and the academy</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Foster care and criminal justice involvement</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Generational poverty and youth phenomenology</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
