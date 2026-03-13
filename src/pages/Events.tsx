import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import conferenceImg from "@/assets/conference-img.jpg";

const events = [
  {
    date: "Spring 2026",
    title: "Publish or Perish Conference for Black Women in Academe",
    location: "University of Rhode Island",
    desc: "Developed by Dr. Dina Lundy, Dr. Tracie McCargo, Dr. Bailey Thomas, and Anne Saluzaro-McGuigan to impact the dismal statistics faced by Women of Color in the academy.",
    image: conferenceImg,
    featured: true,
  },
];

const Events = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Events</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Join Dr. Lundy at upcoming conferences, workshops, and speaking engagements.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-8 max-w-4xl mx-auto">
          {events.map((event, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl overflow-hidden shadow-lg border">
              {event.image && (
                <div className="h-64 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8">
                {event.featured && (
                  <span className="inline-block bg-secondary text-secondary-foreground text-xs font-semibold px-3 py-1 rounded-full mb-4">Featured Event</span>
                )}
                <div className="flex items-center gap-2 text-secondary text-sm font-semibold mb-2">
                  <Calendar className="w-4 h-4" /> {event.date}
                </div>
                <h3 className="font-heading text-2xl text-primary mb-2">{event.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
                  <MapPin className="w-3 h-3" /> {event.location}
                </div>
                <p className="text-foreground/80 leading-relaxed mb-6">{event.desc}</p>
                <Button variant="default">Register Interest</Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
          className="mt-16 text-center max-w-2xl mx-auto">
          <h3 className="font-heading text-2xl text-primary mb-4">Want to Book Dr. Lundy?</h3>
          <p className="text-muted-foreground mb-6">For speaking engagements, workshops, or conference keynotes, reach out for a free consultation.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button variant="default" size="lg" onClick={() => window.open("https://calendly.com", "_blank")}>Book a Free Consult</Button>
            <Button variant="outline" size="lg" onClick={() => window.location.href = "/contact"}>Email</Button>
          </div>
        </motion.div>
      </div>
    </section>
  </Layout>
);

export default Events;
