import { motion } from "framer-motion";
import { Heart, BookOpen, GraduationCap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const Philanthropy = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Philanthropy</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Diversity Lens — Dr. Lundy's approach to inclusive education and social impact.</motion.p>
      </div>
    </section>

    {/* Diversity Lens */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-7 h-7 text-secondary" />
            <h2 className="font-heading text-3xl text-primary">Grab A Syllabus — Diversity Lens</h2>
          </div>
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              I believe it is necessary to meet students where they are. I have found it germane, when teaching psychology, one of my disciplines, to introduce historical figures that the class identifies with. It shows empathy for them as I have invested time in including aspects of history where they are represented.
            </p>
            <p>
              We know that universities are under increasing financial pressure. As such professors are asked to teach classes with little notice. This method accomplishes two significant goals; a student may persist towards the baccalaureate as a result of feeling included — especially if the historical figure was a pioneer in their field of interest. It also serves as an opportunity to educate the class about the contributions of figures from different ethnic groups.
            </p>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-7 h-7 text-secondary" />
            <h2 className="font-heading text-2xl text-primary">Foster Care Advocacy</h2>
          </div>
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              I have had the opportunity to liaise for The Division of Youth and Family Services in Newark, New Jersey. It is the agency that serves children removed from their biological home because the home was deemed unsafe. This population is often invisible. I learned a great deal and the experience fueled my desire to enact change in the lives of diverse populations.
            </p>
            <p>
              I introduce the foster care experience through the lens of Bowlby and Ainsworth. I deliver these lessons with empathy and understanding and encourage students to do the same. The foster child is a demographic that requires both inclusion and understanding as they suffer the shame of their status and typically lag behind academically as a consequence of frequent moves.
            </p>
            <p>
              Abdul-Alim (2016) reported that despite several initiatives introduced to support foster alumni degree attainment, college administrators frequently do not know the rules for programs that fund the education of this demographic. The lack of equitable educational opportunities is systemic, negatively correlates with generational poverty, and is detrimental to the life trajectory of the child in poverty.
            </p>
          </div>
        </motion.div>

        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2}>
          <div className="flex items-center gap-3 mb-6">
            <GraduationCap className="w-7 h-7 text-secondary" />
            <h2 className="font-heading text-2xl text-primary">Pedagogy & Empowerment</h2>
          </div>
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p>
              I employ Wiske (1998), which demonstrated the importance of connecting with a student's curiosity. This inquisitiveness will lead to larger more relevant concepts and challenges that the student may be facing. I want to reach the learner, and I must; if the paradigm of generational poverty is to be ameliorated.
            </p>
            <p>
              The primary learning outcome is that underrepresented students become their own agent and that is achieved through connecting with them in ways that are intangible. I also lean on Bandura's developmental theories that are instrumental in helping people take charge of their lives. Research demonstrates that the college degree is the single most significant benchmark that improves lives.
            </p>
            <p>
              Experiential Learning, another pedagogy I have employed, is instrumental in reaching important educational benchmarks with the first-generation college student because it presents an opportunity for them to learn from life experience and participate in the realities being studied.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Philanthropy;
