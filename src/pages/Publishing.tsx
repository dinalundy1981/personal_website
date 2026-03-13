import { motion } from "framer-motion";
import { FileText, ExternalLink, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const publications = [
  {
    title: "The Long-Term Implications of Transracial Adoption and its Effect on Identity Development and Social Adaptation",
    authors: "Adina Lundy, Dani Shifman",
    journal: "Creative Education 13 (8), 2401-2416",
    year: 2022,
    type: "Research Article",
  },
  {
    title: "An Examination of the Educational Trajectory of Foster Care Alumni Regarding the Social Capital Held by Their Foster Parents",
    authors: "Adina N. Lundy",
    journal: "University of Hartford",
    year: 2022,
    type: "Doctoral Dissertation",
  },
];

const opEds = [
  {
    title: "The Academic Freedom Index of 2024",
    desc: "The U.S. ranks below 80 other countries in the 2024 Academic Freedom Index, scoring 0.68 out of 1.00. Over 600 university presidents released a statement defending academic freedom against government overreach.",
    authors: "Jessica Frazier, Dina Lundy, Ryan Trimm and colleagues — University of Rhode Island professors",
  },
];

const worksInProgress = [
  "Foster Care as a Precursor to Criminal Justice Involvement",
  "Alcohol expectancies are robust modifiable correlates of alcohol use amongst young adults",
  "Human Development for the Real World",
  "So You're on Your Own: Applying Research to Everyday Life — A Guide For the Recently Emancipated",
];

const Publishing = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Publishing</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Academic publications, research articles, op-eds, and works in progress by Dr. Lundy.</motion.p>
      </div>
    </section>

    {/* Research Publications */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <FileText className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Research Publications</h2>
        </div>
        <div className="space-y-4">
          {publications.map((pub, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-heading text-lg text-primary mb-1">{pub.title}</h3>
              <p className="text-muted-foreground text-sm mb-1">{pub.authors}</p>
              <p className="text-muted-foreground text-xs">{pub.journal} · {pub.year} · {pub.type}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Op-Eds */}
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <ExternalLink className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Op-Eds</h2>
        </div>
        <div className="space-y-4">
          {opEds.map((op, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-background rounded-xl p-6 border shadow-sm">
              <h3 className="font-heading text-lg text-primary mb-2">{op.title}</h3>
              <p className="text-foreground/80 text-sm leading-relaxed mb-2">{op.desc}</p>
              <p className="text-muted-foreground text-xs italic">{op.authors}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Works in Progress */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <BookOpen className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Works in Progress</h2>
        </div>
        <div className="space-y-3">
          {worksInProgress.map((work, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-5 border shadow-sm flex items-center gap-4">
              <span className="w-2 h-2 rounded-full bg-secondary shrink-0 animate-pulse" />
              <p className="text-foreground/80 text-sm italic">{work}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Publishing;
