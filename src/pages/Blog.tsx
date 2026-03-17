import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CalendarDays, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import { supabase } from "@/integrations/supabase/client";
import bookPlaceholder from "@/assets/book-placeholder.jpg";

interface Blog {
  id: string;
  title: string;
  excerpt: string | null;
  content: string | null;
  image_url: string | null;
  author: string | null;
  published_at: string | null;
  created_at: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 },
  }),
};

const BlogList = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("blogs")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });
      if (data) setBlogs(data);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <Layout>
      <section className="py-20 bg-warm/30">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Newsletter</motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Insights, reflections, and thought leadership from Dr. Lundy.</motion.p>
        </div>
      </section>
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <p className="text-center text-muted-foreground">Loading posts...</p>
          ) : blogs.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No blog posts yet. Check back soon!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {blogs.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  custom={i}
                  whileHover={{ y: -6, boxShadow: "0 20px 40px -12px hsl(var(--primary) / 0.12)" }}
                  onClick={() => navigate(`/newsletter/${post.id}`)}
                  className="bg-card rounded-xl overflow-hidden border shadow-sm cursor-pointer group flex flex-col"
                >
                  <div className="aspect-[16/9] overflow-hidden relative">
                    <img
                      src={post.image_url || bookPlaceholder}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                      {post.published_at && (
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-3 h-3" />
                          {new Date(post.published_at).toLocaleDateString()}
                        </span>
                      )}
                      {post.author && (
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      )}
                    </div>
                    <h3 className="font-heading text-lg text-primary mb-2 group-hover:text-secondary transition-colors">{post.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                    <span className="text-secondary text-sm font-medium mt-3 inline-block">Read more →</span>
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

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("blogs").select("*").eq("id", id).single();
      if (data) setBlog(data);
      setLoading(false);
    };
    if (id) fetch();
  }, [id]);

  if (loading) return <Layout><div className="py-20 text-center text-muted-foreground">Loading...</div></Layout>;
  if (!blog) return <Layout><div className="py-20 text-center text-muted-foreground">Post not found.</div></Layout>;

  return (
    <Layout>
      <article className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          <Button variant="ghost" size="sm" onClick={() => navigate("/blog")} className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Blog
          </Button>

          {blog.image_url && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden mb-8 border">
              <img src={blog.image_url} alt={blog.title} className="w-full h-auto max-h-[400px] object-cover" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
              {blog.published_at && (
                <span className="flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  {new Date(blog.published_at).toLocaleDateString()}
                </span>
              )}
              {blog.author && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {blog.author}
                </span>
              )}
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-primary mb-6">{blog.title}</h1>
          </motion.div>

          {blog.content && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="prose prose-lg max-w-none text-foreground overflow-hidden break-words
                [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-xl [&_img]:my-6 [&_img]:mx-auto [&_img]:block
                [&_iframe]:w-full [&_iframe]:max-w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:my-6
                [&_video]:w-full [&_video]:max-w-full [&_video]:rounded-xl [&_video]:my-6
                [&_pre]:overflow-x-auto [&_pre]:max-w-full
                [&_table]:overflow-x-auto [&_table]:block [&_table]:max-w-full
                [&_h1]:font-heading [&_h1]:text-primary
                [&_h2]:font-heading [&_h2]:text-primary
                [&_h3]:font-heading [&_h3]:text-primary
                [&_a]:text-secondary [&_a]:underline [&_a]:break-words
                [&_blockquote]:border-l-secondary [&_blockquote]:bg-muted/30 [&_blockquote]:rounded-r-lg [&_blockquote]:py-2 [&_blockquote]:px-4
                [&_p]:leading-relaxed [&_p]:text-foreground/90
                [&>*]:max-w-full"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          )}
        </div>
      </article>
    </Layout>
  );
};

const Blog = () => {
  const { id } = useParams();
  return id ? <BlogPost /> : <BlogList />;
};

export default Blog;
