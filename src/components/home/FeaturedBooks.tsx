import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/animations";
import bookImg from "@/assets/book-placeholder.jpg";

const books = [
  { title: "Education & Equity", desc: "A deep dive into creating equitable educational systems for all." },
  { title: "Foster Youth Voices", desc: "Amplifying the stories of foster youth through research and advocacy." },
  { title: "Rise & Transform", desc: "A personal development guide for leaders in education." },
];

const FeaturedBooks = () => (
  <section className="py-20 bg-warm/30">
    <div className="container mx-auto px-4">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
        <h2 className="font-heading text-3xl md:text-4xl text-primary mb-4">Featured Books</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">Explore Dr. Lundy's published works on education, advocacy, and personal growth.</p>
      </motion.div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {books.map((book, i) => (
          <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i + 1}
            className="bg-background rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
            <div className="h-64 overflow-hidden">
              <img src={bookImg} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-6">
              <h3 className="font-heading text-xl text-primary mb-2">{book.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">{book.desc}</p>
              <Link to="/books"><Button variant="secondary" size="sm">View Details</Button></Link>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link to="/books"><Button variant="default" size="lg">View All Books <ArrowRight className="w-4 h-4" /></Button></Link>
      </div>
    </div>
  </section>
);

export default FeaturedBooks;
