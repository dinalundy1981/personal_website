import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import coachingImg from "@/assets/coaching-img.jpg";

const CALENDLY_LINK = "https://calendly.com/dinalundy1981/30min";

const helpItems = [
  "Get clear on what's actually holding you back",
  "Break the grip of past mistakes, failures, or regrets",
  "Replace fear with strategy, and hesitation with momentum",
  "Build a life that finally feels aligned — and unapologetically yours",
];

const card3D = {
  hidden: { opacity: 0, y: 40, rotateX: 10, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1, y: 0, rotateX: 0, scale: 1,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const WorkWithMe = () => {
  const [coachingImage, setCoachingImage] = useState<string>(coachingImg);

  useEffect(() => {
    supabase.from("site_images").select("image_url").eq("section", "work_with_me_image").single()
      .then(({ data }) => {
        if (data) setCoachingImage(data.image_url);
      });
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Work With Me
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
            Transform your life with purpose-driven coaching grounded in psychological frameworks.
          </motion.p>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center max-w-5xl mx-auto">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={card3D}
              custom={0}
              style={{ perspective: 1000 }}
            >
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img src={coachingImage} alt="Dr. Dina Lundy coaching" className="w-full h-auto" />
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="space-y-6">
              <h2 className="font-heading text-3xl text-primary">WHY?</h2>
              <p className="text-foreground/80 leading-relaxed">
                Because you're Not Broken. You're Just Stuck. You've got vision and desire. Maybe even the plan. But something keeps pulling you back — fear, self-doubt, burnout, or the weight of past failures.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                That's where I come in. I designed a coaching experience based on psychological frameworks designed for individuals who are ready to move — not just dream, not just "get inspired" — but take real, necessary steps forward.
              </p>
              <p className="text-foreground/80 leading-relaxed">
                I started my psychological journey after watching far too many people stay stuck in cycles that didn't serve them — not because they lacked talent, but because fear kept them playing small. I, too, was stuck once. My Mom died and so did my identity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* I Will Help You */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-3xl text-center" style={{ perspective: 1200 }}>
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="font-heading text-3xl text-primary mb-8">
            I Will Help You
          </motion.h2>
          <div className="space-y-4 mb-10">
            {helpItems.map((item, i) => (
              <motion.div
                key={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={card3D}
                custom={i + 1}
                whileHover={{ rotateX: -2, rotateY: 3, scale: 1.02, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="flex items-start gap-3 bg-card rounded-xl p-5 border shadow-[0_4px_20px_rgba(255,255,255,0.15)] text-left cursor-default"
              >
                <CheckCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-foreground/80">{item}</p>
              </motion.div>
            ))}
          </div>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={5} className="text-foreground/80 leading-relaxed mb-8">
            This isn't about "fixing" yourself. It's about finally giving yourself permission to grow. Ready to stop circling the same mountain? Let's move the needle — together.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={6}>
            <Button variant="default" size="lg" onClick={() => window.open(CALENDLY_LINK, "_blank")}>
              Book a Free Discovery Call <ArrowRight className="w-5 h-5 ml-1" />
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default WorkWithMe;
