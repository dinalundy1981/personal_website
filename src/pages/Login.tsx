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
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    const { error } = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (error) {
      toast({ title: "Google Sign-In Failed", description: String(error), variant: "destructive" });
    }
    setGoogleLoading(false);
  };

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
            <p className="text-muted-foreground text-sm text-center mb-6">{isRegister ? "Register to buy books, courses, and attend events." : "Login to your account."}</p>

            {/* Google Sign-In */}
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center gap-2 mb-4"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {googleLoading ? "Signing in..." : "Continue with Google"}
            </Button>

            <div className="flex items-center gap-3 my-4">
              <Separator className="flex-1" />
              <span className="text-xs text-muted-foreground uppercase">or</span>
              <Separator className="flex-1" />
            </div>

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
