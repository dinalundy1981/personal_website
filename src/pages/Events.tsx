import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const events = [
  { date: "Mar 25, 2026", title: "Education Equity Summit", location: "Los Angeles, CA", desc: "A two-day conference exploring systemic reform in K-12 and higher education." },
  { date: "Apr 10, 2026", title: "Youth Advocacy Workshop", location: "Chicago, IL", desc: "Interactive workshop on creating advocacy programs for foster youth." },
  { date: "May 5, 2026", title: "Leadership Conference", location: "New York, NY", desc: "Annual leadership conference for academic administrators and educators." },
  { date: "Jun 15, 2026", title: "Community Impact Seminar", location: "Atlanta, GA", desc: "Seminar on evidence-based approaches to community-level education reform." },
];

const Events = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Events</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
          Join Dr. Lundy at upcoming speaking engagements, conferences, and workshops.
        </motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="space-y-6 max-w-3xl mx-auto">
          {events.map((event, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center gap-6">
              <div className="md:w-32 shrink-0 text-center">
                <div className="bg-warm/50 rounded-lg p-3 inline-block">
                  <Calendar className="w-5 h-5 text-primary mx-auto mb-1" />
                  <span className="text-sm font-semibold text-primary">{event.date}</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-heading text-xl text-primary mb-1">{event.title}</h3>
                <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
                  <MapPin className="w-3 h-3" /> {event.location}
                </div>
                <p className="text-muted-foreground text-sm">{event.desc}</p>
              </div>
              <Button variant="secondary" size="sm">Register</Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Events;
