import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Message Sent!", description: "Thank you for reaching out. Dr. Lundy will respond soon." });
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Contact</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Get in touch with Dr. Lundy for inquiries, speaking engagements, or collaborations.</motion.p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.form initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6 bg-card p-8 rounded-xl border shadow-md">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Name</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Message</label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Your message..." rows={5} required />
            </div>
            <Button type="submit" variant="default" size="lg" className="w-full"><Send className="w-4 h-4" /> Send Message</Button>
          </motion.form>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
