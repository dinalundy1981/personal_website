import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const publications = [
  { title: "Systemic Reform in K-12: An Equity Framework", type: "Research Article", year: 2025 },
  { title: "Foster Youth Outcomes: A Longitudinal Study", type: "Academic Paper", year: 2024 },
  { title: "Compassionate Leadership in Higher Education", type: "Essay", year: 2024 },
  { title: "Diversity, Inclusion, and Belonging in Academia", type: "Research Article", year: 2023 },
  { title: "The Intersection of Race and Education Policy", type: "Academic Paper", year: 2022 },
];

const Publishing = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Publishing</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Academic publications, research articles, and essays by Dr. Lundy.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-4 max-w-3xl mx-auto">
          {publications.map((pub, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 cursor-pointer group">
              <div className="w-12 h-12 rounded-lg bg-warm/50 flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-primary" /></div>
              <div className="flex-1">
                <h3 className="font-heading text-lg text-primary group-hover:text-secondary transition-colors">{pub.title}</h3>
                <p className="text-muted-foreground text-sm">{pub.type} · {pub.year}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Publishing;
