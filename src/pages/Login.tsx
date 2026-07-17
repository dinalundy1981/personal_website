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
  const { signIn, signUp, signInWithGoogle } = useAuth();
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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      toast({ title: "Google Login Failed", description: error.message, variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30 min-h-[80vh] flex items-center">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="max-w-md mx-auto bg-background p-8 rounded-xl border shadow-lg">
            <h1 className="font-heading text-3xl text-primary text-center mb-2">{isRegister ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-muted-foreground text-sm text-center mb-6">{isRegister ? "Register to buy books, courses, and attend events." : "Login to your account."}</p>

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

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full gap-2 hover:bg-muted/50 border border-border" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Google
            </Button>

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
