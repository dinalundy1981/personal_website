import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const socialLinks = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Twitter, href: "https://twitter.com", label: "X (Twitter)" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    setSending(true);
    const { error } = await supabase.from("contacts").insert({
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
      return;
    }
    toast({ title: "Message Sent!", description: "Thank you for reaching out. Dr. Lundy will respond soon." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-16 md:py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Get In Touch</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Have a question, collaboration idea, or speaking request? We'd love to hear from you.</motion.p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
            {/* Contact Info Sidebar */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-heading text-2xl text-primary mb-6">Contact Information</h2>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Email</p>
                      <p className="text-sm text-muted-foreground">contact@drdinalundy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Phone</p>
                      <p className="text-sm text-muted-foreground">Available upon request</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Location</p>
                      <p className="text-sm text-muted-foreground">United States</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-heading text-lg text-primary mb-4">Follow Along</h3>
                <div className="flex gap-3">
                  {socialLinks.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                      className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                      <s.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1}
              onSubmit={handleSubmit} className="lg:col-span-3 space-y-5 bg-card p-6 md:p-8 rounded-xl border shadow-md">
              <h2 className="font-heading text-xl text-primary mb-2">Send a Message</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required maxLength={100} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required maxLength={255} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can Dr. Lundy help you?" rows={5} required maxLength={2000} />
              </div>
              <Button type="submit" variant="default" size="lg" className="w-full" disabled={sending}>
                <Send className="w-4 h-4" /> {sending ? "Sending..." : "Send Message"}
              </Button>
            </motion.form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
