import { motion } from "framer-motion";
import { Image, Video } from "lucide-react";
import Layout from "@/components/layout/Layout";
import heroBg from "@/assets/hero-bg.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const photos = [
  { caption: "Education Summit 2025", subtitle: "Keynote presentation", year: 2025 },
  { caption: "Youth Workshop", subtitle: "Community engagement", year: 2024 },
  { caption: "Book Launch Event", subtitle: "National conference", year: 2024 },
  { caption: "Panel Discussion", subtitle: "Higher education forum", year: 2023 },
  { caption: "Award Ceremony", subtitle: "Excellence in advocacy", year: 2023 },
  { caption: "Community Service", subtitle: "Volunteer program", year: 2022 },
];

const Media = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Media</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
          Photos and videos from Dr. Lundy's events, conferences, and appearances.
        </motion.p>
      </div>
    </section>

    {/* Photo Gallery */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Image className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Photo Gallery</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative">
              <img src={heroBg} alt={photo.caption} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-primary-foreground text-sm font-semibold">{photo.caption}</p>
                  <p className="text-primary-foreground/70 text-xs">{photo.subtitle} · {photo.year}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Video Gallery */}
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Video className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Video Gallery</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[1, 2].map((_, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-background rounded-xl overflow-hidden shadow-md border">
              <div className="aspect-video bg-primary/10 flex items-center justify-center">
                <Video className="w-12 h-12 text-muted-foreground" />
              </div>
              <div className="p-4">
                <h3 className="font-heading text-lg text-primary">Conference Keynote {i + 1}</h3>
                <p className="text-muted-foreground text-sm">Featured speaking engagement highlight.</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Media;
