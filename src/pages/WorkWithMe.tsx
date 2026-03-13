import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import profileImg from "@/assets/profile-placeholder.jpg";

const WorkWithMe = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Work With Me</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Transform your leadership and personal development journey with Dr. Lundy.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
            <div className="rounded-2xl overflow-hidden shadow-xl"><img src={profileImg} alt="Coaching" className="w-full h-auto" /></div>
          </motion.div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
            <h2 className="font-heading text-3xl text-primary">Coaching & Consultation</h2>
            <p className="text-foreground/80 leading-relaxed">Dr. Lundy offers one-on-one coaching and group consultation sessions focused on leadership development, academic career advancement, and personal growth strategies.</p>
            <h3 className="font-heading text-xl text-primary">What to Expect</h3>
            <ul className="space-y-3 text-foreground/80">
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Personalized coaching tailored to your goals</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Evidence-based strategies for leadership growth</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Accountability and follow-up support</li>
              <li className="flex items-start gap-2"><span className="w-2 h-2 rounded-full bg-secondary mt-2 shrink-0" /> Flexible scheduling via Calendly</li>
            </ul>
            <Button variant="hero" size="lg" onClick={() => window.open("https://calendly.com", "_blank")}>
              Schedule Consultation <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>
);

export default WorkWithMe;
