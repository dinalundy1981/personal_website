import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const EmailSubscription = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast({ title: "Please enter a valid email address", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("email_subscriptions").insert({ email: trimmed });
    setLoading(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "You're already subscribed!", description: "This email is already on our list." });
        setSubscribed(true);
      } else {
        toast({ title: "Something went wrong", description: "Please try again later.", variant: "destructive" });
      }
      return;
    }
    setSubscribed(true);
    setEmail("");
    toast({ title: "Successfully subscribed!", description: "You'll receive updates from Dr. Lundy." });
  };

  return (
    <section className="py-16 md:py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary/15 mb-5">
            <Mail className="w-6 h-6 text-secondary" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl text-primary mb-3">Stay in the Loop</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Subscribe to get the latest updates, insights, and exclusive content from Dr. Dina Lundy.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-secondary font-medium"
            >
              <CheckCircle className="w-5 h-5" />
              <span>You're subscribed! Thank you.</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-background"
                required
              />
              <Button type="submit" disabled={loading} size="lg" className="h-12 px-6 shadow-md">
                {loading ? "Subscribing..." : <>Subscribe <Send className="w-4 h-4 ml-1" /></>}
              </Button>
            </form>
          )}

          <p className="text-xs text-muted-foreground mt-4">
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default EmailSubscription;
