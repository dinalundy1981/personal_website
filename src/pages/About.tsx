import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import profileImg from "@/assets/profile-placeholder.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const About = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">
          About Dr. Dina Lundy
        </motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
          Scholar, author, and advocate for education equity.
        </motion.p>
      </div>
    </section>

    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img src={profileImg} alt="Dr. Dina Lundy" className="w-full h-auto" />
            </div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
            <h2 className="font-heading text-3xl text-primary">My Story</h2>
            <p className="text-foreground/80 leading-relaxed">
              Dr. Dina Lundy is a dedicated scholar, researcher, and thought leader whose work 
              centers on education equity, foster youth advocacy, and leadership development. 
              With a career spanning decades in academia, Dr. Lundy has committed her life to 
              amplifying the voices of underserved communities.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Her academic research has been published in numerous peer-reviewed journals, and 
              her books have inspired educators, policymakers, and community leaders worldwide. 
              As a speaker, she brings a unique blend of personal experience, academic rigor, 
              and compassionate storytelling to every stage.
            </p>
            <h3 className="font-heading text-2xl text-primary pt-4">Research Focus</h3>
            <ul className="space-y-2 text-foreground/80">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Education equity and systemic reform</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Foster youth advocacy and outcomes</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Leadership development in academic institutions</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Diversity, inclusion, and belonging</li>
            </ul>
            <h3 className="font-heading text-2xl text-primary pt-4">Academic Background</h3>
            <p className="text-foreground/80 leading-relaxed">
              Dr. Lundy holds a doctorate in Education with a focus on educational leadership 
              and policy. She has served as a professor, researcher, and consultant at multiple 
              institutions across the United States.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>
);

export default About;
