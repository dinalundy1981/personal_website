import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout/Layout";
import bookImg from "@/assets/book-placeholder.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

const books = [
  { title: "Education & Equity", desc: "A deep dive into creating equitable educational systems for all learners.", price: "$24.99" },
  { title: "Foster Youth Voices", desc: "Amplifying the stories of foster youth through research and advocacy.", price: "$19.99" },
  { title: "Rise & Transform", desc: "A personal development guide for emerging leaders in education.", price: "$22.99" },
  { title: "Leading with Purpose", desc: "Strategies for compassionate and effective academic leadership.", price: "$27.99" },
];

const Books = () => (
  <Layout>
    <section className="py-20 bg-warm/30">
      <div className="container mx-auto px-4 text-center">
        <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="font-heading text-4xl md:text-5xl text-primary mb-4">Books</motion.h1>
        <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={1} className="text-muted-foreground max-w-2xl mx-auto">
          Explore Dr. Lundy's published works. Register and login to purchase.
        </motion.p>
      </div>
    </section>
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {books.map((book, i) => (
            <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i}
              className="bg-card rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group border">
              <div className="h-56 overflow-hidden">
                <img src={bookImg} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg text-primary mb-2">{book.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{book.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl text-secondary">{book.price}</span>
                  <Button variant="secondary" size="sm"><ShoppingCart className="w-4 h-4" /> Buy</Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </Layout>
);

export default Books;
