import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";
import { Play, User } from "lucide-react";

interface TedxTalk {
  id: string;
  title: string;
  author: string | null;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  is_published: boolean | null;
  created_at: string;
}

const getEmbedUrl = (url: string) => {
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  // Facebook
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false`;
  }
  return null;
};

const getThumbnail = (url: string) => {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
};

const TedxTalkPage = () => {
  const [talks, setTalks] = useState<TedxTalk[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("tedx_talks")
      .select("*")
      .eq("is_published", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setTalks((data as TedxTalk[]) || []);
        setLoading(false);
      });
  }, []);

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">
            TEDxTalk
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
            Watch inspiring talks, presentations, and conversations featuring Dr. Lundy.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading videos...</p>
          ) : talks.length === 0 ? (
            <p className="text-center text-muted-foreground">No videos available yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {talks.map((talk, i) => {
                const embedUrl = getEmbedUrl(talk.video_url);
                const thumb = talk.thumbnail_url || getThumbnail(talk.video_url);
                const isPlaying = playingId === talk.id;

                return (
                  <motion.div
                    key={talk.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeUp}
                    custom={i}
                    className="bg-card rounded-xl border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group flex flex-col"
                  >
                    <div className="aspect-video overflow-hidden relative bg-muted">
                      {isPlaying && embedUrl ? (
                        <iframe
                          src={embedUrl + (embedUrl.includes("?") ? "&" : "?") + "autoplay=1"}
                          title={talk.title}
                          className="w-full h-full"
                          allowFullScreen
                          allow="autoplay; encrypted-media"
                        />
                      ) : (
                        <div
                          className="w-full h-full cursor-pointer relative"
                          onClick={() => setPlayingId(talk.id)}
                        >
                          {thumb ? (
                            <img src={thumb} alt={talk.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                              <Play className="w-12 h-12 text-muted-foreground" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center shadow-lg">
                              <Play className="w-7 h-7 text-secondary-foreground ml-1" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-heading text-lg text-primary mb-2 group-hover:text-secondary transition-colors">
                        {talk.title}
                      </h3>
                      {talk.author && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                          <User className="w-3 h-3" /> {talk.author}
                        </p>
                      )}
                      {talk.description && (
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                          {talk.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default TedxTalkPage;
