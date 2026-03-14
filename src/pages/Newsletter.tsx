import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, ArrowRight, X } from "lucide-react";

interface Newsletter {
  id: string;
  title: string;
  content: string | null;
  image1_url: string | null;
  image2_url: string | null;
  image3_url: string | null;
  published_at: string | null;
  created_at: string;
  is_published: boolean | null;
}

const Newsletter = () => {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Newsletter | null>(null);

  useEffect(() => {
    supabase
      .from("newsletters")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setNewsletters(data || []);
        setLoading(false);
      });
  }, []);

  const formatDate = (d: string | null) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Newsletter
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with Dr. Lundy's latest news, insights, and announcements.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading newsletters...</p>
          ) : newsletters.length === 0 ? (
            <p className="text-center text-muted-foreground">No newsletters available yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {newsletters.map((nl, i) => (
                <motion.div
                  key={nl.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                >
                  {nl.image1_url && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={nl.image1_url}
                        alt={nl.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    {(nl.published_at || nl.created_at) && (
                      <span className="text-xs text-secondary font-semibold flex items-center gap-1 mb-2">
                        <Calendar className="w-3 h-3" />
                        {formatDate(nl.published_at || nl.created_at)}
                      </span>
                    )}
                    <h3 className="font-heading text-lg text-primary mb-3 group-hover:text-secondary transition-colors">
                      {nl.title}
                    </h3>
                    {nl.content && (
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3 flex-1">
                        {nl.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
                      </p>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-auto self-start group/btn"
                      onClick={() => setSelected(nl)}
                    >
                      Learn More <ArrowRight className="w-4 h-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-heading text-2xl text-primary">{selected?.title}</DialogTitle>
            {selected && (selected.published_at || selected.created_at) && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <Calendar className="w-3 h-3" />
                {formatDate(selected.published_at || selected.created_at)}
              </p>
            )}
          </DialogHeader>
          {selected && (
            <div className="space-y-6 mt-4">
              {selected.image1_url && (
                <img src={selected.image1_url} alt={selected.title} className="w-full rounded-lg object-cover max-h-80" />
              )}
              {selected.content && (
                <div className="prose prose-sm max-w-none text-foreground" dangerouslySetInnerHTML={{ __html: selected.content }} />
              )}
              <div className="grid grid-cols-2 gap-4">
                {selected.image2_url && (
                  <img src={selected.image2_url} alt="Newsletter image" className="w-full rounded-lg object-cover" />
                )}
                {selected.image3_url && (
                  <img src={selected.image3_url} alt="Newsletter image" className="w-full rounded-lg object-cover" />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Newsletter;
