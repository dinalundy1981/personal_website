import { motion } from "framer-motion";
import { Image, Video, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import media1 from "@/assets/media-1.jpg";
import media2 from "@/assets/media-2.png";
import media3 from "@/assets/media-3.png";
import media4 from "@/assets/media-4.png";
import media5 from "@/assets/media-5.png";
import tedxImg from "@/assets/tedx-img.png";

const photos = [
  { caption: "URI International Honor Society in Psychology", subtitle: "Awards Ceremony 2025", image: media1 },
  { caption: "Student Love — Andrea Paiva", subtitle: "URI Psychology Awards Ceremony", image: media2 },
  { caption: "URI Undergraduate Academic Ceremony", subtitle: "Awards Ceremony 2024", image: media3 },
  { caption: "URI College of Health Sciences", subtitle: "Commencement 2025", image: media4 },
  { caption: "University of Rhode Island", subtitle: "Awards Ceremony 2025", image: media5 },
];

const Media = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Media</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Photos and videos from Dr. Lundy's ceremonies, events, and appearances.</motion.p>
      </div>
    </section>

    {/* Photo Gallery */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Award className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Ceremonies & Awards</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="group rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow relative">
              <img src={photo.image} alt={photo.caption} className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <div>
                  <p className="text-primary-foreground text-sm font-semibold">{photo.caption}</p>
                  <p className="text-primary-foreground/70 text-xs">{photo.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* TEDx Video */}
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Video className="w-6 h-6 text-secondary" />
          <h2 className="font-heading text-2xl text-primary">Featured Talk</h2>
        </div>
        <div className="max-w-3xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}
            className="bg-background rounded-xl overflow-hidden shadow-md border">
            <div className="aspect-video overflow-hidden">
              <img src={tedxImg} alt="Hope from the Edge - TEDxURI" className="w-full h-full object-cover" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl text-primary mb-2">Hope from the Edge | TEDxURI</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                In this deeply personal talk, Dr. Lundy discusses her philanthropy on behalf of youth with foster care experience. While navigating the grief of losing both parents to Alzheimer's, what began as an effort to get out of her own head evolved into a powerful calling.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  </Layout>
);

export default Media;
