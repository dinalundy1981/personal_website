import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const Login = () => {
  const { toast } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: isRegister ? "Account Created!" : "Welcome Back!",
      description: isRegister ? "Please check your email to verify." : "You are now logged in.",
    });
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="max-w-md mx-auto bg-background p-8 rounded-xl border shadow-lg"
          >
            <h1 className="font-heading text-3xl text-primary text-center mb-2">
              {isRegister ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="text-muted-foreground text-sm text-center mb-8">
              {isRegister ? "Register to buy books, courses, and attend events." : "Login to your account."}
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                  <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" required />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="your@email.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••" required />
              </div>
              <Button type="submit" variant="default" size="lg" className="w-full">
                {isRegister ? "Create Account" : "Login"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsRegister(!isRegister)} className="text-accent hover:text-secondary font-medium transition-colors">
                {isRegister ? "Login" : "Register"}
              </button>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
