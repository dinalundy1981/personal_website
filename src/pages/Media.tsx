import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Image as ImageIcon, Video, Calendar, User, Tag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MediaCategory {
  id: string;
  title: string;
  sort_order: number;
}

interface MediaItem {
  id: string;
  category_id: string;
  image_url: string;
  subtitle: string | null;
  year: string | null;
  sort_order: number;
}

interface FeaturedTalk {
  id: string;
  video_url: string;
  author_name: string | null;
  date: string | null;
  keywords: string | null;
  subtitle: string | null;
  description: string | null;
  thumbnail_url: string | null;
}

const getYouTubeId = (url: string) => {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
};

const Media = () => {
  const [categories, setCategories] = useState<MediaCategory[]>([]);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [talks, setTalks] = useState<FeaturedTalk[]>([]);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [catRes, itemRes, talkRes] = await Promise.all([
        supabase.from("media_categories").select("*").order("sort_order"),
        supabase.from("media_items").select("*").order("sort_order"),
        supabase.from("featured_talks").select("*").eq("is_published", true).order("sort_order"),
      ]);
      if (catRes.data) setCategories(catRes.data as MediaCategory[]);
      if (itemRes.data) setItems(itemRes.data as MediaItem[]);
      if (talkRes.data) setTalks(talkRes.data as FeaturedTalk[]);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const getItemsForCategory = (catId: string) =>
    items.filter((i) => i.category_id === catId).slice(0, 6);

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1
            initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="font-heading text-4xl md:text-5xl text-primary mb-4"
          >
            Media
          </motion.h1>
          <motion.p
            initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Photos and videos from Dr. Lundy's ceremonies, events, and appearances.
          </motion.p>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading media...</p>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted-foreground">No media categories yet.</p>
          ) : (
            <div className="space-y-16">
              {categories.map((cat, ci) => {
                const catItems = getItemsForCategory(cat.id);
                return (
                  <motion.div
                    key={cat.id}
                    initial="hidden" whileInView="visible" viewport={{ once: true }}
                    variants={fadeUp} custom={ci}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-secondary" />
                      </div>
                      <h2 className="font-heading text-2xl text-primary">{cat.title}</h2>
                    </div>

                    {catItems.length === 0 ? (
                      <p className="text-muted-foreground text-sm">No images in this category yet.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {catItems.map((item, idx) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20, rotateX: 5 }}
                            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.08, duration: 0.5 }}
                            whileHover={{
                              scale: 1.05,
                              rotateY: 3,
                              boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.25)",
                            }}
                            className="group cursor-pointer rounded-xl overflow-hidden border bg-card shadow-sm"
                            style={{ perspective: "800px", transformStyle: "preserve-3d" }}
                            onClick={() => setLightboxItem(item)}
                          >
                            <div className="aspect-square overflow-hidden">
                              <img
                                src={item.image_url}
                                alt={item.subtitle || "Media"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                            </div>
                            <div className="p-2.5">
                              {item.year && (
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-secondary">
                                  {item.year}
                                </span>
                              )}
                              {item.subtitle && (
                                <p className="text-xs text-foreground/80 leading-snug line-clamp-2 mt-0.5">
                                  {item.subtitle}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Featured Talks */}
      {talks.length > 0 && (
        <section className="py-16 md:py-20 bg-muted">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Video className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-heading text-2xl text-primary">Featured Talks</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {talks.map((talk, idx) => {
                const ytId = getYouTubeId(talk.video_url);
                const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}` : null;
                const thumbUrl = talk.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : null);
                const keywordList = talk.keywords?.split(",").map((k) => k.trim()).filter(Boolean) || [];

                return (
                  <motion.div
                    key={talk.id}
                    initial={{ opacity: 0, y: 30, rotateX: 4 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15, duration: 0.6 }}
                    whileHover={{
                      y: -6,
                      boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.2)",
                    }}
                    className="bg-card rounded-2xl overflow-hidden border shadow-md group"
                    style={{ perspective: "1000px", transformStyle: "preserve-3d" }}
                  >
                    {/* Video */}
                    <div className="aspect-video overflow-hidden relative">
                      {embedUrl ? (
                        <iframe
                          src={embedUrl}
                          title={talk.subtitle || "Featured Talk"}
                          className="w-full h-full"
                          allowFullScreen
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      ) : thumbUrl ? (
                        <img src={thumbUrl} alt={talk.subtitle || ""} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center">
                          <Play className="w-12 h-12 text-muted-foreground" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      {talk.subtitle && (
                        <h3 className="font-heading text-lg text-primary leading-snug">{talk.subtitle}</h3>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        {talk.author_name && (
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" /> {talk.author_name}
                          </span>
                        )}
                        {talk.date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> {talk.date}
                          </span>
                        )}
                      </div>

                      {keywordList.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {keywordList.map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-full bg-secondary/10 text-secondary text-[10px] font-medium"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      )}

                      {talk.description && (
                        <p className="text-sm text-foreground/75 leading-relaxed line-clamp-3">
                          {talk.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      <Dialog open={!!lightboxItem} onOpenChange={() => setLightboxItem(null)}>
        <DialogContent className="max-w-3xl p-2 sm:p-4">
          {lightboxItem && (
            <div className="space-y-3">
              <img
                src={lightboxItem.image_url}
                alt={lightboxItem.subtitle || "Media"}
                className="w-full max-h-[70vh] object-contain rounded-lg"
              />
              <div className="px-2 pb-2">
                {lightboxItem.year && (
                  <span className="text-xs font-semibold uppercase tracking-wider text-secondary">
                    {lightboxItem.year}
                  </span>
                )}
                {lightboxItem.subtitle && (
                  <p className="text-sm text-foreground mt-1">{lightboxItem.subtitle}</p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Media;
