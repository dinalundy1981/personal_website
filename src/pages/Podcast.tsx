import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, PlayCircle, Music, Video, Calendar, Clock, Tag } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";
import { supabase } from "@/integrations/supabase/client";

const getYouTubeEmbedUrl = (url: string) => {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([a-zA-Z0-9_-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
};

const Podcast = () => {
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "audio" | "video">("all");

  useEffect(() => {
    supabase.from("podcasts").select("*").eq("is_published", true).order("published_at", { ascending: false })
      .then(({ data }) => { setPodcasts(data || []); setLoading(false); });
  }, []);

  const filtered = filter === "all" ? podcasts : podcasts.filter(p => p.podcast_format === filter);

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">
            Podcast
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
            Listen to Dr. Lundy's conversations on education, leadership, and advocacy.
          </motion.p>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {/* Filter Tabs */}
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0} className="flex justify-center gap-2 mb-12">
            {(["all", "video", "audio"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  filter === f
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {f === "all" && "All"}
                {f === "video" && <span className="flex items-center gap-1.5"><Video className="w-4 h-4" /> Video</span>}
                {f === "audio" && <span className="flex items-center gap-1.5"><Music className="w-4 h-4" /> Audio</span>}
              </button>
            ))}
          </motion.div>

          {loading ? (
            <p className="text-center text-muted-foreground">Loading podcasts...</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Mic className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No podcasts available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {filtered.map((podcast, i) => (
                <motion.div
                  key={podcast.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeUp}
                  custom={i}
                  className="bg-card rounded-2xl border shadow-sm hover:shadow-lg transition-all overflow-hidden group"
                >
                  {/* Banner Image */}
                  {podcast.image_url && (
                    <div className="aspect-[16/9] overflow-hidden">
                      <img
                        src={podcast.image_url}
                        alt={podcast.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Meta Row */}
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        podcast.podcast_format === "video"
                          ? "bg-secondary/20 text-secondary"
                          : "bg-accent/20 text-accent-foreground"
                      }`}>
                        {podcast.podcast_format === "video" ? <Video className="w-3 h-3" /> : <Music className="w-3 h-3" />}
                        {podcast.podcast_format === "video" ? "Video" : "Audio"}
                      </span>
                      {podcast.category && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Tag className="w-3 h-3" /> {podcast.category}
                        </span>
                      )}
                      {podcast.episode_number && (
                        <span className="text-xs text-muted-foreground">Ep. {podcast.episode_number}</span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-heading text-xl text-primary">{podcast.title}</h3>
                    {podcast.description && (
                      <p className="text-foreground/70 text-sm line-clamp-3">{podcast.description}</p>
                    )}

                    {/* Date & Duration */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {podcast.published_at && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(podcast.published_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      )}
                      {podcast.duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {podcast.duration}
                        </span>
                      )}
                    </div>

                    {/* Player */}
                    {podcast.podcast_format === "video" && podcast.video_url && (() => {
                      const embedUrl = getYouTubeEmbedUrl(podcast.video_url);
                      return embedUrl ? (
                        <div className="aspect-video rounded-lg overflow-hidden border">
                          <iframe
                            src={embedUrl}
                            title={podcast.title}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      ) : (
                        <a href={podcast.video_url} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm text-secondary hover:underline">
                          <PlayCircle className="w-5 h-5" /> Watch Video
                        </a>
                      );
                    })()}

                    {podcast.podcast_format === "audio" && podcast.audio_url && (
                      <audio controls className="w-full" preload="metadata">
                        <source src={podcast.audio_url} />
                        Your browser does not support the audio element.
                      </audio>
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

export default Podcast;
