import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";

const PodcastPreview = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Latest Podcast</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Listen to Dr. Lundy's insights on education, leadership, and advocacy.</p>
      </motion.div>
      <div className="max-w-3xl mx-auto bg-card rounded-xl p-8 border shadow-md flex flex-col md:flex-row items-center gap-8">
        <div className="w-24 h-24 rounded-full bg-warm flex items-center justify-center shrink-0">
          <Mic className="w-10 h-10 text-primary" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="font-heading text-xl text-primary mb-2">The Education Equity Podcast</h3>
          <p className="text-muted-foreground text-sm mb-4">Conversations about creating systemic change in education and uplifting underserved communities.</p>
          <Link to="/podcast"><Button variant="secondary" size="sm">Listen Now</Button></Link>
        </div>
      </div>
    </div>
  </section>
);

export default PodcastPreview;
