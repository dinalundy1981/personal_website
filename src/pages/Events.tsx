import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, MapPin, Clock, Users, ArrowRight, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface EventImage {
  id: string;
  image_url: string;
  sort_order: number | null;
}

interface Event {
  id: string;
  title: string;
  description: string | null;
  date: string;
  close_date: string | null;
  location: string | null;
  image_url: string | null;
  max_attendees: number | null;
  is_published: boolean | null;
  images: EventImage[];
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [registerEventId, setRegisterEventId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "" });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchEvents = async () => {
      const { data: eventsData } = await supabase
        .from("events")
        .select("*")
        .eq("is_published", true)
        .order("date", { ascending: true });

      if (eventsData) {
        const eventsWithImages = await Promise.all(
          eventsData.map(async (event: any) => {
            const { data: images } = await supabase
              .from("event_images")
              .select("*")
              .eq("event_id", event.id)
              .order("sort_order", { ascending: true });
            return { ...event, images: images || [] };
          })
        );
        setEvents(eventsWithImages);
      }
      setLoading(false);
    };
    fetchEvents();
  }, []);

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const isRegistrationOpen = (event: Event) => {
    if (!event.close_date) return true;
    return new Date(event.close_date) > new Date();
  };

  const handleRegister = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast({ title: "Please fill in Name and Email", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("event_registrations").insert({
      event_id: registerEventId!,
      user_id: user?.id || null,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim() || null,
      location: form.location.trim() || null,
    } as any);
    setSubmitting(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Interest registered!", description: "We'll be in touch with more details." });
      setRegisterOpen(false);
      setForm({ name: "", email: "", phone: "", location: "" });
    }
  };

  const getAllImages = (event: Event) => {
    const imgs: string[] = [];
    if (event.image_url) imgs.push(event.image_url);
    event.images.forEach((img) => imgs.push(img.image_url));
    return imgs;
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Events
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
            Join Dr. Lundy at upcoming conferences, workshops, and speaking engagements.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-muted-foreground">No upcoming events at this time.</p>
          ) : (
            <div className="space-y-12 max-w-5xl mx-auto">
              {events.map((event, i) => {
                const images = getAllImages(event);
                const open = isRegistrationOpen(event);
                return (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="bg-card rounded-2xl overflow-hidden shadow-lg border hover:shadow-xl transition-shadow"
                  >
                    {/* Image Gallery */}
                    {images.length > 0 && (
                      <ImageCarousel images={images} title={event.title} />
                    )}

                    <div className="p-8">
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        <span className="flex items-center gap-1.5 text-secondary text-sm font-semibold">
                          <Calendar className="w-4 h-4" /> {formatDate(event.date)}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <MapPin className="w-3.5 h-3.5" /> {event.location}
                          </span>
                        )}
                        {event.close_date && (
                          <span className="flex items-center gap-1.5 text-muted-foreground text-sm">
                            <Clock className="w-3.5 h-3.5" /> Registration closes {formatDate(event.close_date)}
                          </span>
                        )}
                      </div>

                      <h3 className="font-heading text-2xl text-primary mb-3">{event.title}</h3>

                      {event.description && (
                        <p className="text-foreground/80 leading-relaxed mb-6 whitespace-pre-line">
                          {event.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3">
                        {open ? (
                          <Button
                            variant="default"
                            size="lg"
                            onClick={() => {
                              setRegisterEventId(event.id);
                              setRegisterOpen(true);
                            }}
                          >
                            <Users className="w-4 h-4 mr-2" /> Register Interest
                          </Button>
                        ) : (
                          <Button variant="outline" size="lg" disabled>
                            Registration Closed
                          </Button>
                        )}
                        {images.length > 1 && (
                          <Button variant="outline" size="lg" onClick={() => setSelectedEvent(event)}>
                            View All Photos <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Booking CTA */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
            className="mt-16 text-center max-w-2xl mx-auto">
            <h3 className="font-heading text-2xl text-primary mb-4">Want to Book Dr. Lundy?</h3>
            <p className="text-muted-foreground mb-6">For speaking engagements, workshops, or conference keynotes, reach out for a free consultation.</p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button variant="default" size="lg" onClick={() => window.open("https://calendly.com/dinalundy1981/30min", "_blank")}>Book a Free Consult</Button>
              <Button variant="outline" size="lg" onClick={() => window.location.href = "/contact"}>Email</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Register Interest Dialog */}
      <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-primary">Register Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Email *</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone Number</label>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Location</label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, State/Country" />
            </div>
            <Button onClick={handleRegister} disabled={submitting} className="w-full">
              {submitting ? "Submitting..." : "Submit Registration"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Photo Gallery Dialog */}
      <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl text-primary">{selectedEvent?.title} — Photos</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {selectedEvent && getAllImages(selectedEvent).map((img, idx) => (
              <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden border">
                <img src={img} alt={`Event photo ${idx + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

// Simple image carousel component
const ImageCarousel = ({ images, title }: { images: string[]; title: string }) => {
  const [current, setCurrent] = useState(0);

  if (images.length === 1) {
    return (
      <div className="h-72 md:h-96 overflow-hidden">
        <img src={images[0]} alt={title} className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="relative h-72 md:h-96 overflow-hidden group">
      <AnimatePresence mode="wait">
        <motion.img
          key={current}
          src={images[current]}
          alt={`${title} ${current + 1}`}
          className="w-full h-full object-cover absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      </AnimatePresence>
      <button
        onClick={() => setCurrent((c) => (c - 1 + images.length) % images.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % images.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-2 h-2 rounded-full transition-colors ${idx === current ? "bg-primary" : "bg-background/60"}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Events;
