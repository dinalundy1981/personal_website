import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";

const events = [
  { date: "Mar 25, 2026", title: "Education Equity Summit", location: "Los Angeles, CA" },
  { date: "Apr 10, 2026", title: "Youth Advocacy Workshop", location: "Chicago, IL" },
  { date: "May 5, 2026", title: "Leadership Conference", location: "New York, NY" },
];

const UpcomingEvents = () => (
  <section className="py-20 bg-muted">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Upcoming Events</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Join Dr. Lundy at conferences, workshops, and speaking engagements.</p>
      </motion.div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {events.map((event, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            className="bg-background rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 text-secondary text-sm font-semibold mb-3">
              <Calendar className="w-4 h-4" /> {event.date}
            </div>
            <h3 className="font-heading text-lg text-primary mb-1">{event.title}</h3>
            <p className="text-muted-foreground text-sm">{event.location}</p>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/events"><Button variant="default" size="lg">View All Events</Button></Link>
      </div>
    </div>
  </section>
);

export default UpcomingEvents;
