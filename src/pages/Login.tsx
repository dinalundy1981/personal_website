import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const { toast } = useToast();
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isRegister) {
      const { error } = await signUp(form.email, form.password, form.name);
      if (error) {
        toast({ title: "Registration Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Account Created!", description: "Please check your email to verify." });
      }
    } else {
      const { error } = await signIn(form.email, form.password);
      if (error) {
        toast({ title: "Login Failed", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Welcome Back!", description: "You are now logged in." });
        navigate("/");
      }
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="max-w-md mx-auto bg-background p-8 rounded-xl border shadow-lg">
            <h1 className="font-heading text-3xl text-primary text-center mb-2">{isRegister ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-muted-foreground text-sm text-center mb-8">{isRegister ? "Register to buy books, courses, and attend events." : "Login to your account."}</p>
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
              <Button type="submit" variant="default" size="lg" className="w-full" disabled={loading}>
                {loading ? "Please wait..." : isRegister ? "Create Account" : "Login"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground mt-6">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button onClick={() => setIsRegister(!isRegister)} className="text-accent hover:text-secondary font-medium transition-colors">{isRegister ? "Login" : "Register"}</button>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Login;
