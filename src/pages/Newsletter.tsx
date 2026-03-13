import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const newsletters = [
  { title: "Spring 2026 Newsletter", date: "Mar 1, 2026", summary: "Updates on upcoming events, new book announcements, and reflections on education equity progress." },
  { title: "Winter 2025 Recap", date: "Dec 15, 2025", summary: "A look back at the year's accomplishments, speaking engagements, and community impact highlights." },
  { title: "Fall 2025 Edition", date: "Oct 1, 2025", summary: "New course launch details, research updates, and stories from foster youth advocacy work." },
];

const Newsletter = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Newsletter</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
          Stay updated with Dr. Lundy's latest news, insights, and announcements.
        </motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {newsletters.map((nl, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-8 border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <span className="text-xs text-secondary font-semibold">{nl.date}</span>
              <h3 className="font-heading text-xl text-primary mt-2 mb-3 group-hover:text-secondary transition-colors">{nl.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{nl.summary}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Newsletter;
