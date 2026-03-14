import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, User, Tag, Loader2, ExternalLink, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

const card3D = {
  hidden: { opacity: 0, y: 40, rotateX: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const Publishing = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [wips, setWips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [pubRes, wipRes] = await Promise.all([
        supabase.from("publishing").select("*").eq("is_published", true).order("published_date", { ascending: false }),
        supabase.from("works_in_progress").select("*").eq("is_published", true).order("created_at", { ascending: false }),
      ]);
      setPublications(pubRes.data || []);
      setWips(wipRes.data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-3xl sm:text-4xl md:text-5xl text-primary mb-4">
            Publishing
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Academic publications, research articles, op-eds, and works in progress by Dr. Lundy.
          </motion.p>
        </div>
      </section>

      {/* Publications Grid */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="font-heading text-2xl sm:text-3xl text-primary mb-8 text-center">
            Published Works
          </motion.h2>

          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No publications yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8" style={{ perspective: "1200px" }}>
              {publications.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={card3D}
                  custom={i % 3}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px rgba(0,0,0,0.1)" }}
                  className="bg-card rounded-2xl border shadow-[0_4px_20px_-4px_rgba(255,255,255,0.6),0_2px_12px_-2px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_-4px_rgba(255,255,255,0.8),0_4px_20px_-4px_rgba(0,0,0,0.1)] transition-shadow duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image — fixed aspect ratio */}
                  {pub.image_url ? (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={pub.image_url}
                        alt={pub.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="aspect-[16/10] bg-muted flex items-center justify-center">
                      <FileText className="w-12 h-12 text-muted-foreground/40" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {pub.publication_type && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Tag className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                          {pub.publication_type}
                        </span>
                      </div>
                    )}

                    <h3 className="font-heading text-lg sm:text-xl text-primary mb-2 line-clamp-2">
                      {pub.title}
                    </h3>

                    {pub.author && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                        <User className="w-3.5 h-3.5" />
                        <span>{pub.author}</span>
                      </div>
                    )}

                    {pub.published_date && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(pub.published_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                    )}

                    {(pub.abstract || pub.description) && (
                      <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-4 flex-1">
                        {pub.abstract || pub.description}
                      </p>
                    )}

                    {pub.url ? (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                        <Button variant="secondary" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" /> Read More
                        </Button>
                      </a>
                    ) : (
                      <Button variant="outline" className="w-full mt-auto" disabled>
                        Coming Soon
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Works in Progress */}
      <section className="py-12 md:py-16 bg-warm/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="font-heading text-2xl sm:text-3xl text-primary mb-3 text-center">
            Works in Progress
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-muted-foreground text-center mb-10 max-w-xl mx-auto text-sm sm:text-base">
            Current research and upcoming publications.
          </motion.p>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : wips.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No works in progress at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8" style={{ perspective: "1200px" }}>
              {wips.map((wip, i) => (
                <motion.div
                  key={wip.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={card3D}
                  custom={i % 2}
                  whileHover={{ y: -4, boxShadow: "0 16px 32px -8px rgba(0,0,0,0.08)" }}
                  className="bg-card rounded-2xl border shadow-[0_4px_20px_-4px_rgba(255,255,255,0.6),0_2px_12px_-2px_rgba(0,0,0,0.06)] overflow-hidden flex flex-col sm:flex-row"
                >
                  {wip.image_url ? (
                    <div className="sm:w-48 flex-shrink-0 aspect-[16/10] sm:aspect-auto overflow-hidden">
                      <img src={wip.image_url} alt={wip.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="sm:w-48 flex-shrink-0 aspect-[16/10] sm:aspect-auto bg-muted flex items-center justify-center">
                      <Clock className="w-10 h-10 text-muted-foreground/40" />
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-heading text-lg text-primary mb-2">{wip.title}</h3>
                    {wip.author && (
                      <p className="text-muted-foreground text-sm mb-1">
                        <User className="w-3.5 h-3.5 inline mr-1" />{wip.author}
                      </p>
                    )}
                    {wip.expected_date && (
                      <p className="text-muted-foreground text-xs mb-2">Expected: {wip.expected_date}</p>
                    )}
                    {wip.description && (
                      <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-3 flex-1">{wip.description}</p>
                    )}
                    {wip.url && (
                      <a href={wip.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Learn More
                        </Button>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Publishing;
