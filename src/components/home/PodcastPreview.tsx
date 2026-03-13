import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import bookImg from "@/assets/book-placeholder.jpg";

const podcasts = [
  { title: "The Education Equity Podcast", desc: "Conversations about creating systemic change in education and uplifting underserved communities.", image: bookImg },
  { title: "Leadership Beyond Limits", desc: "Exploring what it takes to lead with purpose and impact in modern education.", image: bookImg },
];

const PodcastPreview = () => (
  <section className="py-20 bg-background">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Latest Podcasts</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Listen to Dr. Lundy's insights on education, leadership, and advocacy.</p>
      </motion.div>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {podcasts.map((podcast, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            className="bg-card rounded-xl overflow-hidden border shadow-md hover:shadow-lg transition-shadow group flex flex-col">
            <div className="h-48 overflow-hidden relative">
              <img src={podcast.image} alt={podcast.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-background/90 flex items-center justify-center shadow-lg">
                  <Mic className="w-6 h-6 text-primary" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl text-primary mb-2">{podcast.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{podcast.desc}</p>
              <Link to="/podcast"><Button variant="secondary" size="sm">Listen Now</Button></Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default PodcastPreview;
