import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";

const NewsletterCTA = () => (
  <section className="py-16 bg-warm/40">
    <div className="container mx-auto px-4 text-center">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
        <h2 className="font-heading text-3xl text-primary mb-4">Stay Connected</h2>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Read the latest newsletters and stay updated on Dr. Lundy's work.
        </p>
        <Link to="/newsletter"><Button variant="default" size="lg">View Newsletter</Button></Link>
      </motion.div>
    </div>
  </section>
);

export default NewsletterCTA;
