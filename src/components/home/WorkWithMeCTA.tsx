import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";

const WorkWithMeCTA = () => (
  <section className="py-20 bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
        <h2 className="font-heading text-3xl md:text-4xl mb-4">Work With Me</h2>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8 text-lg">
          Ready to transform your leadership, academic career, or personal journey?
          Schedule a coaching consultation with Dr. Lundy today.
        </p>
        <Link to="/work-with-me">
          <Button variant="hero" size="lg">Schedule Consultation <ArrowRight className="w-5 h-5" /></Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default WorkWithMeCTA;
