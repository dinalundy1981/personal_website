import { motion } from "framer-motion";
import { Heart, Users, GraduationCap } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const initiatives = [
  { icon: Users, title: "Foster Youth Advocacy", desc: "Supporting foster youth through mentorship programs, educational resources, and community partnerships to ensure every young person has access to opportunity." },
  { icon: Heart, title: "Diversity Initiatives", desc: "Promoting diversity, equity, and inclusion in higher education institutions through policy advocacy, training programs, and research-driven recommendations." },
  { icon: GraduationCap, title: "Education Equity Work", desc: "Working to eliminate systemic barriers in education through community engagement, policy reform, and grassroots organizing efforts." },
];

const Philanthropy = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Philanthropy</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Dr. Lundy's social impact work and community initiatives.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {initiatives.map((item, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-8 border shadow-md text-center">
              <div className="w-16 h-16 rounded-full bg-warm/50 flex items-center justify-center mx-auto mb-6"><item.icon className="w-8 h-8 text-primary" /></div>
              <h3 className="font-heading text-xl text-primary mb-4">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Philanthropy;
