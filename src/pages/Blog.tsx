import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { fadeUp } from "@/lib/animations";

const posts = [
  { title: "The Future of Education Equity", date: "Mar 5, 2026", excerpt: "Exploring how systemic changes can create more equitable outcomes for all students." },
  { title: "Why Foster Youth Advocacy Matters", date: "Feb 20, 2026", excerpt: "Understanding the unique challenges faced by foster youth and how advocacy can transform their journey." },
  { title: "Leadership Lessons from the Classroom", date: "Feb 8, 2026", excerpt: "What decades of teaching have taught me about compassionate and effective leadership." },
  { title: "Building Inclusive Communities", date: "Jan 25, 2026", excerpt: "Strategies for creating communities where diversity is celebrated and every voice is heard." },
];

const Blog = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Blog</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">Insights, reflections, and thought leadership from Dr. Lundy.</motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {posts.map((post, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl p-6 border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
              <span className="text-xs text-secondary font-semibold">{post.date}</span>
              <h3 className="font-heading text-xl text-primary mt-2 mb-3 group-hover:text-secondary transition-colors">{post.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Blog;
