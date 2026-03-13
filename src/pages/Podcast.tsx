import { motion } from "framer-motion";
import { Mic, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const episodes = [
  { title: "Reimagining Education Equity", desc: "A conversation about systemic reform and the future of equitable education.", duration: "45 min" },
  { title: "Foster Youth: Resilience & Hope", desc: "Stories of resilience from foster youth and advocates making a difference.", duration: "38 min" },
  { title: "Leadership from the Heart", desc: "Exploring compassionate leadership in academic institutions.", duration: "42 min" },
  { title: "Diversity in Higher Education", desc: "Addressing challenges and opportunities for diversity in academia.", duration: "50 min" },
];

const Podcast = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Podcast</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
          Listen to Dr. Lundy's conversations on education, leadership, and advocacy.
        </motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {episodes.map((ep, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow flex items-center gap-6">
              <div className="w-16 h-16 rounded-full bg-warm flex items-center justify-center shrink-0">
                <Mic className="w-7 h-7 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-lg text-primary mb-1">{ep.title}</h3>
                <p className="text-muted-foreground text-sm">{ep.desc}</p>
                <span className="text-xs text-neutral mt-1 block">{ep.duration}</span>
              </div>
              <Button variant="secondary" size="icon" className="rounded-full shrink-0">
                <Play className="w-5 h-5" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Podcast;
