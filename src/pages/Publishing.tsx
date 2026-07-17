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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" style={{ perspective: "1200px" }}>
              {publications.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={card3D}
                  custom={i % 4}
                  whileHover={{ y: -5, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.08)" }}
                  className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Image Container with Full-bleed Clear Rendering */}
                  <div className="aspect-[3/4] overflow-hidden border-b relative group bg-muted/10">
                    {pub.image_url ? (
                      <img
                        src={pub.image_url}
                        alt={pub.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                      {pub.publication_type && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary/10 text-secondary uppercase tracking-wider">
                          {pub.publication_type}
                        </span>
                      )}
                      {pub.published_date && (
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(pub.published_date).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                        </span>
                      )}
                    </div>

                    <h3 className="font-heading text-base text-primary mb-2 line-clamp-2 hover:text-accent transition-colors font-semibold leading-snug">
                      {pub.title}
                    </h3>

                    {pub.author && (
                      <p className="text-muted-foreground text-[12px] mb-3 flex items-center gap-1 font-medium">
                        <User className="w-3 h-3" />
                        <span className="truncate">{pub.author}</span>
                      </p>
                    )}

                    {(pub.abstract || pub.description) && (
                      <p className="text-foreground/70 text-[12px] leading-relaxed mb-4 line-clamp-3 flex-1">
                        {pub.abstract || pub.description}
                      </p>
                    )}

                    {pub.url ? (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="mt-auto pt-2">
                        <Button variant="outline" size="sm" className="w-full text-xs font-semibold h-9 gap-1.5 hover:bg-secondary hover:text-secondary-foreground transition-all duration-300">
                          <ExternalLink className="w-3.5 h-3.5" /> Read Article
                        </Button>
                      </a>
                    ) : (
                      <Button variant="ghost" size="sm" className="w-full mt-auto text-xs h-9" disabled>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ perspective: "1200px" }}>
              {wips.map((wip, i) => (
                <motion.div
                  key={wip.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={card3D}
                  custom={i % 2}
                  whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0,0,0,0.08)" }}
                  className="bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col sm:flex-row hover:shadow-md transition-all duration-300"
                >
                  {wip.image_url ? (
                    <div className="sm:w-36 flex-shrink-0 aspect-[3/4] sm:aspect-auto overflow-hidden border-r border-b sm:border-b-0">
                      <img src={wip.image_url} alt={wip.title} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="sm:w-36 flex-shrink-0 aspect-[3/4] sm:aspect-auto bg-muted flex items-center justify-center">
                      <Clock className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="font-heading text-base font-semibold text-primary mb-1.5 line-clamp-2 leading-snug">{wip.title}</h3>
                    <div className="flex items-center gap-3 text-muted-foreground text-[12px] mb-2 flex-wrap">
                      {wip.author && (
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3 h-3" /> {wip.author}
                        </span>
                      )}
                      {wip.expected_date && (
                        <span className="flex items-center gap-1 font-medium bg-accent/10 text-accent px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider">
                          Expected: {wip.expected_date}
                        </span>
                      )}
                    </div>
                    {wip.description && (
                      <p className="text-foreground/70 text-[12px] leading-relaxed mb-3 line-clamp-2 flex-1">{wip.description}</p>
                    )}
                    {wip.url && (
                      <a href={wip.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                          <ExternalLink className="w-3 h-3 mr-1" /> View Project
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
