import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, User, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

const Publishing = () => {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("publishing")
        .select("*")
        .eq("is_published", true)
        .order("published_date", { ascending: false });
      setPublications(data || []);
      setLoading(false);
    };
    fetch();
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {publications.map((pub, i) => (
                <motion.div
                  key={pub.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i % 3}
                  className="bg-card rounded-2xl border shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                >
                  {/* Image */}
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
                    {/* Category Badge */}
                    {pub.publication_type && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Tag className="w-3.5 h-3.5 text-secondary" />
                        <span className="text-xs font-medium text-secondary uppercase tracking-wide">
                          {pub.publication_type}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="font-heading text-lg sm:text-xl text-primary mb-2 line-clamp-2">
                      {pub.title}
                    </h3>

                    {/* Author */}
                    {pub.author && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-2">
                        <User className="w-3.5 h-3.5" />
                        <span>{pub.author}</span>
                      </div>
                    )}

                    {/* Date */}
                    {pub.published_date && (
                      <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{new Date(pub.published_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
                      </div>
                    )}

                    {/* Abstract */}
                    {(pub.abstract || pub.description) && (
                      <p className="text-foreground/70 text-sm leading-relaxed mb-4 line-clamp-4 flex-1">
                        {pub.abstract || pub.description}
                      </p>
                    )}

                    {/* Read More Button */}
                    {pub.url ? (
                      <a href={pub.url} target="_blank" rel="noopener noreferrer" className="mt-auto">
                        <Button variant="secondary" className="w-full">Read More</Button>
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
    </Layout>
  );
};

export default Publishing;
